/* --------------------------------------------------------- TRACK HANDLERS */
// show gps tracks, kml and geojson files on a map
    function poly(pars){
        var n = $(pars).attr("id").substr(-4);
        var dataExtent;
        var setExtent = function() {
            if(dataExtent) {
                dataExtent.extend(this.getDataExtent());
            }
            else {
                dataExtent = this.getDataExtent();
                $('.olMap.mb-element').data('mbMap').map.olMap.zoomToExtent(dataExtent);
            }
        };
        switch(n) {
            case ".gpx":
                var lgpx = new OpenLayers.Layer.Vector("Hiking routes", {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: $(pars).attr("id"),
                        format: new OpenLayers.Format.GPX()
                    }),
                    style: {strokeColor: $(pars).attr("name"), strokeWidth: 6, strokeOpacity: 1},
                    projection: new OpenLayers.Projection("EPSG:4326")
                });

                lgpx.events.register("loadend", lgpx, setExtent);
                $('.olMap.mb-element').data('mbMap').map.olMap.addLayer(lgpx);
                
                function highlightSelected(feature){
                    hoverStyle = {
                        strokeColor: $(pars).attr("name"),
                        strokeWidth: 5,
                        strokeOpacity: 1,
                        label: $(pars).attr("id").substring($(pars).attr("id").lastIndexOf("/")+1),
                        labelAlign: 'cm',
                        labelYOffset: 6,
                        fontSize: 15,
                        fontFamily: "Arial",
                        fontColor: "red",
                        fontWeight: "bold",
                        cursor: "pointer"
                    };
                    lgpx.drawFeature(feature, hoverStyle);                  
                }

                var highlight = new OpenLayers.Control.SelectFeature(
                    lgpx, {
                            clickout: false, toggle: false,
                            multiple: false, hover: true,
                            onSelect: highlightSelected
                    }
                );

                $('.olMap.mb-element').data('mbMap').map.olMap.addControl(highlight);
                highlight.activate();
                break;
                
            case ".kml":
                var shapes = new OpenLayers.Layer.Vector("KML", {
                projection: $('.olMap.mb-element').data('mbMap').map.olMap.displayProjection,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: $(pars).attr("id"),
                    headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Access-Control-Allow-Origin","Content-Type":"application/xml","Content-Type":"application/octet-stream"},
                    readWithPOST: true,
                    format: new OpenLayers.Format.KML({
                        extractStyles: true,
                        extractAttributes: true
                    })
                })
                });

                shapes.events.register("loadend", shapes, setExtent);
                $('.olMap.mb-element').data('mbMap').map.olMap.addLayer(shapes);

                select = new OpenLayers.Control.SelectFeature(shapes);
                
                function onPopupClose(evt) {
                    select.unselectAll();
                }
                
                function onFeatureSelect(event) {
                    var feature = event.feature;
                    var content;
                    if (feature.attributes.description) {
                        content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>" + feature.attributes.description + "</div>";
                    }
                    else {
                        content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2></div>";
                    };
                    if (content.search("<script") != -1) {
                        content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
                    };
                    popup = new OpenLayers.Popup.FramedCloud("kml", 
                        feature.geometry.getBounds().getCenterLonLat(),
                        new OpenLayers.Size(100,100),
                        content,
                        null, true, onPopupClose);
                    feature.popup = popup;
                    $('.olMap.mb-element').data('mbMap').map.olMap.addPopup(popup);
                }
                
                function onFeatureUnselect(event) {
                    var feature = event.feature;
                    if(feature.popup) {
                        $('.olMap.mb-element').data('mbMap').map.olMap.removePopup(feature.popup);
                        feature.popup.destroy();
                        delete feature.popup;
                    }
                }
                
                shapes.events.on({
                    "featureselected": onFeatureSelect,
                    "featureunselected": onFeatureUnselect
                });

                $('.olMap.mb-element').data('mbMap').map.olMap.addControl(select);
                select.activate();
                break;
                
            case "json":
                var geojson_layer = new OpenLayers.Layer.Vector("GeoJSON", {
                    projection: $('.olMap.mb-element').data('mbMap').map.olMap.getProjectionObject(),
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: $(pars).attr("id"),
                        format: new OpenLayers.Format.GeoJSON()
                    }),
                    styleMap: new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            pointRadius: 8,
                            fillColor: $(pars).attr("name"),
                            fillOpacity: 0.9,
                            strokeColor: "black",
                            strokeWidth: 1,
                            strokeOpacity: 0.8
                        }),
                        "select": {
                            fillColor: "#8aeeef",
                            strokeColor: "#32a8a9"
                        }
                    })
                });

                geojson_layer.events.register("loadend", geojson_layer, setExtent);
                $('.olMap.mb-element').data('mbMap').map.olMap.addLayer(geojson_layer);
                
                select = new OpenLayers.Control.SelectFeature(geojson_layer);
                
                function onPopupClose(evt) {
                    select.unselectAll();
                }
                
                function onFeatureSelect(event) {
                    var feature = event.feature;
                    var content;
                    if (feature.attributes.description && feature.attributes.type) {
                        content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>" + feature.attributes.description + feature.attributes.type + "</div>";
                    }
                    else if (!feature.attributes.description) {
                        content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>" + feature.attributes.type + "</div>";
                    }
                    else if (!feature.attributes.type) {
                        content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>" + feature.attributes.description + "</div>";
                    };
                    if (content.search("<script") != -1) {
                        content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
                    };
                    popup = new OpenLayers.Popup.FramedCloud("kml", 
                        feature.geometry.getBounds().getCenterLonLat(),
                        new OpenLayers.Size(100,100),
                        content,
                        null, true, onPopupClose);
                    feature.popup = popup;
                    $('.olMap.mb-element').data('mbMap').map.olMap.addPopup(popup);
                }
                
                function onFeatureUnselect(event) {
                    var feature = event.feature;
                    if(feature.popup) {
                        $('.olMap.mb-element').data('mbMap').map.olMap.removePopup(feature.popup);
                        feature.popup.destroy();
                        delete feature.popup;
                    }
                }
                
                geojson_layer.events.on({
                    "featureselected": onFeatureSelect,
                    "featureunselected": onFeatureUnselect
                });

                $('.olMap.mb-element').data('mbMap').map.olMap.addControl(select);
                select.activate();
                break;
        }
    };

  // server response after deleting file - last uploaded files div
        function del(par) {         
                $.ajax({
                type: "POST",
                data: { filename: $(par).attr("name"), filepath: $(par).attr("id") },
                url: "/mapbender3/app_dev.php/deletetrack/",
                success: function(response){ 
                        alert(response);
                        $.ajax({ 
                            url: "/mapbender3/app_dev.php/lastuploadedfiles/",
                            success: function(response){
                                $('#tracks').html(response);
                            }
                        });                                                             
                }});            
        };
    
  // server response after deleting file - search div
        function deltk(par) {           
                $.ajax({
                type: "POST",
                data: { filename: $(par).attr("name"), filepath: $(par).attr("id") },
                url: "/mapbender3/app_dev.php/deletetrack/",                
                success: function(response){                    
                            alert(response);                            
                                $.ajax({ 
                                    async: false,           
                                    data: { fname: $("#fname").val() },
                                    url: "/mapbender3/app_dev.php/findtrack/",
                                    success: function(response){
                                        $('#find').html(response);
                                    }
                                });
                }});            
        };
    
  // file download   
        function downl(param) {     
                window.location = "/mapbender3/app_dev.php/downloadtrack/?" + $.param({ dname: $(param).attr("name"), dpath: $(param).attr("id") });        
        };

/* --------------------------------------------------------- FORM HANDLERS */
  //  3 buttons div toggle at the top of the sidebar        
        $("a[data-toggle]").on("click", function(e) {
                e.preventDefault();  // cancel the default action of the click
                $(".d").find(".dv").hide();
                $("li").find("a").removeClass("current");
                $($(this).data("toggle")).show();
                $(this).addClass("current");                
            });

  //  input color reset
        $(document).ready(function(){ 
                    $("#import").click(function(){
                        document.getElementById('color').color.fromString('#ffffff');
                    });
            });

  //  server response after uploading file
        $(document).ready(function(){ 
                $("#uploaderForm").ajaxForm({ 
                    success: function(responseText){ 
                        $('#output').html(responseText);
                        },
                    clearForm: true
                });
        });

  //  show last 5 uploaded files - last uploaded files div        
        $(document).ready(function(){
                $("#lastk").click(function(){
                    $.ajax({                    
                    url: "/mapbender3/app_dev.php/lastuploadedfiles/",
                    success: function(response){
                        $('#tracks').html(response);
                        }
                    });
                });
        });

  //  show file after searching - search div        
        $(document).ready(function(){
                $("#fname").keyup(function(){
                    if ($.trim($(this).val()) == ''){
                        $('#find').html('')
                        }
                    else {
                        $.ajax({ 
                            async: false,
                            data: { fname: $.trim($(this).val()) },
                            url: "/mapbender3/app_dev.php/findtrack/",
                            success: function(response){
                                $('#find').html(response);
                            }
                        });
                    }
                });
        });

/* --------------------------------------------------------- UPLOADERBUTTON HANDLERS */
 //  shows dialog and tabs
        $(document).ready(function(){
            $("#showall").removeAttr("href").click(function(){
                $("#tabs").tabs().css("display", "block");
                $("#dialog").dialog({height: 690, width: 415, title: "Upload and view files"});
            });
        });
