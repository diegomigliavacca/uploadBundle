/* --------------------------------------------------------- TRACK HANDLERS */
// show gps track on a map
    function poly(pars){
                var dataExtent;
                var setExtent = function()
                {
                    if(dataExtent)
                        dataExtent.extend(this.getDataExtent());
                    else
                        dataExtent = this.getDataExtent();
                    $('.olMap.mb-element').data('mbMap').map.olMap.zoomToExtent(dataExtent);
                };

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
                        label: $(pars).attr("id").substring(9),
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
        };
    
  // server response after deleting track - last uploaded files div
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
    
  // server response after deleting track - search div
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
    
  // track download   
        function downl(param) {     
                window.location = "/mapbender3/app_dev.php/downloadtrack/?" + $.param({ dname: $(param).attr("name"), dpath: $(param).attr("id") });        
        };

/* --------------------------------------------------------- SIDEBAR HANDLERS */
  //  3 buttons div toggle at the top of the sidebar        
        $("a[data-toggle]").on("click", function(e) {
                e.preventDefault();  // cancel the default action of the click
                var selector = $(this).data("toggle");  // get relating element
                $(".d").find(".dv").hide();
                $("li").find("a").removeClass("current");
                $(selector).show();
                $(this).addClass("current");                
            });

  //  input color reset
        $(document).ready(function(){ 
                    $("#import").click(function(){
                        document.getElementById('color').color.fromString('#ffffff');
                    });
            });

  //  server response after uploading track
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

  //  show track after searching - search div        
        $(document).ready(function(){
                $("#fname").keyup(function(){
                    var datas = $.trim($(this).val());
                    if (datas == ''){
                        $('#find').html('')
                        }
                    else {
                        $.ajax({ 
                            async: false,
                            data: { fname: datas },
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
                $("#dialog").dialog({height: 690, width: 415, title: "Upload and view tracks"});
            });
        });
