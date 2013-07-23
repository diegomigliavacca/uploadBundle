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
