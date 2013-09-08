/* --------------------------------------------------------- TRACK HANDLERS */
// show gps tracks, kml and geojson files on a map
function poly(pars) {
	var dataExtent;
	var setExtent = function() {
		if (dataExtent) {
			dataExtent.extend(this.getDataExtent());
		} else {
			dataExtent = this.getDataExtent();
			$('.olMap.mb-element').data('mbMap').map.olMap.zoomToExtent(dataExtent);
		}
	};
	switch($(pars).attr("id").substr(-4)) {
		case ".gpx":
			var format = new OpenLayers.Format.GPX({
				keepData : true
			});

			var protocol = new OpenLayers.Protocol.HTTP({
				url : $(pars).attr("id"),
				headers : {
					"Access-Control-Allow-Origin" : "*",
					"Access-Control-Allow-Headers" : "Access-Control-Allow-Origin",
					"Content-Type" : "application/xml",
					"Content-Type" : "application/octet-stream"
				},
				readWithPOST : true,
				format : format
			});

			var lgpx = new OpenLayers.Layer.Vector("Gpx", {
				strategies : [new OpenLayers.Strategy.Fixed()],
				protocol : protocol,
				projection : new OpenLayers.Projection("EPSG:4326"),
				styleMap : new OpenLayers.StyleMap({
					"default" : new OpenLayers.Style({
						strokeColor : $(pars).attr("name"),
						strokeWidth : 6,
						strokeOpacity : 1
					}),
					"select" : new OpenLayers.Style({
						fillColor : "#8aeeef",
						strokeColor : "#32a8a9",
						strokeWidth : 6,
						strokeOpacity : 1
					}),
					"temporary" : new OpenLayers.Style({
						strokeColor : $(pars).attr("name"),
						strokeWidth : 5,
						strokeOpacity : 1,
						label : $(pars).attr("id").substring($(pars).attr("id").lastIndexOf("/") + 1),
						labelAlign : 'cm',
						labelYOffset : 6,
						fontSize : 15,
						fontFamily : "Arial",
						fontColor : "red",
						fontWeight : "bold",
						cursor : "pointer"
					})
				})
			});

			lgpx.events.register("loadend", lgpx, setExtent);
			$('.olMap.mb-element').data('mbMap').map.olMap.addLayer(lgpx);

			var highlight = new OpenLayers.Control.SelectFeature(lgpx, {
				hover : true,
				highlightOnly : true
			});

			highlight.events.register("featurehighlighted", highlight, function(event) {
				lgpx.drawFeature(event.feature, "temporary");
			});

			$('.olMap.mb-element').data('mbMap').map.olMap.addControl(highlight);
			highlight.activate();

			var select_gpx = new OpenLayers.Control.SelectFeature(lgpx);

			function onPopupClosing(evt) {
				select_gpx.unselectAll();
			}

			function onGpxSelect(event) {
				var feature = event.feature;
				var len = feature.geometry.getGeodesicLength() / 1000;
				var kms = +(parseFloat(len).toFixed(2));
				var content_gpx = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + $(pars).attr("id").substring($(pars).attr("id").lastIndexOf("/") + 1) + "</h2>";
				if (feature.attributes.desc) {
					content_gpx += feature.attributes.desc + "<br />";
				};
				if (feature.attributes.time) {
					content_gpx += "<b>Time:</b> " + feature.attributes.time + "<br />";
				};
				content_gpx += "<b>Length:</b> " + kms + " km<br />";
				if (feature.attributes.ele) {
					content_gpx += "<b>Elevation:</b> " + feature.attributes.ele + " m";
				};
				content_gpx += "</div>";
				if (content_gpx.search("<script") != -1) {
					content_gpx = "Content contained Javascript! Escaped content below.<br>" + content_gpx.replace(/</g, "&lt;");
				};
				popup = new OpenLayers.Popup.FramedCloud("gpx", feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(100, 100), content_gpx, null, true, onPopupClosing);
				feature.popup = popup;
				$('.olMap.mb-element').data('mbMap').map.olMap.addPopup(popup);
			}

			function onGpxUnselect(event) {
				var feature = event.feature;
				if (feature.popup) {
					$('.olMap.mb-element').data('mbMap').map.olMap.removePopup(feature.popup);
					feature.popup.destroy();
					delete feature.popup;
				}
			};

			lgpx.events.on({
				"featureselected" : onGpxSelect,
				"featureunselected" : onGpxUnselect
			});

			$('.olMap.mb-element').data('mbMap').map.olMap.addControl(select_gpx);
			select_gpx.activate();
			break;

		case ".kml":
			var shapes = new OpenLayers.Layer.Vector("KML", {
				projection : $('.olMap.mb-element').data('mbMap').map.olMap.displayProjection,
				strategies : [new OpenLayers.Strategy.Fixed()],
				protocol : new OpenLayers.Protocol.HTTP({
					url : $(pars).attr("id"),
					headers : {
						"Access-Control-Allow-Origin" : "*",
						"Access-Control-Allow-Headers" : "Access-Control-Allow-Origin",
						"Content-Type" : "application/xml",
						"Content-Type" : "application/octet-stream"
					},
					readWithPOST : true,
					format : new OpenLayers.Format.KML({
						extractStyles : true
					})
				})
			});

			shapes.events.register("loadend", shapes, setExtent);
			$('.olMap.mb-element').data('mbMap').map.olMap.addLayer(shapes);

			var select = new OpenLayers.Control.SelectFeature(shapes);

			function onPopupClose(evt) {
				select.unselectAll();
			}

			function onFeatureSelect(event) {
				var feature = event.feature;
				var content = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>";
				if (feature.attributes.description) {
					content += feature.attributes.description;
				};
				content += "</div>";
				if (content.search("<script") != -1) {
					content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
				};
				popup = new OpenLayers.Popup.FramedCloud("kml", feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(100, 100), content, null, true, onPopupClose);
				feature.popup = popup;
				$('.olMap.mb-element').data('mbMap').map.olMap.addPopup(popup);
			}

			function onFeatureUnselect(event) {
				var feature = event.feature;
				if (feature.popup) {
					$('.olMap.mb-element').data('mbMap').map.olMap.removePopup(feature.popup);
					feature.popup.destroy();
					delete feature.popup;
				}
			};

			shapes.events.on({
				"featureselected" : onFeatureSelect,
				"featureunselected" : onFeatureUnselect
			});

			$('.olMap.mb-element').data('mbMap').map.olMap.addControl(select);
			select.activate();
			break;

		case "json":
			var geojson_layer = new OpenLayers.Layer.Vector("GeoJSON", {
				projection : $('.olMap.mb-element').data('mbMap').map.olMap.getProjectionObject(),
				strategies : [new OpenLayers.Strategy.Fixed()],
				protocol : new OpenLayers.Protocol.HTTP({
					url : $(pars).attr("id"),
					format : new OpenLayers.Format.GeoJSON()
				}),
				styleMap : new OpenLayers.StyleMap({
					"default" : new OpenLayers.Style({
						pointRadius : 8,
						fillColor : $(pars).attr("name"),
						fillOpacity : 0.9,
						strokeColor : "black",
						strokeWidth : 1,
						strokeOpacity : 0.8
					}),
					"select" : {
						fillColor : "#8aeeef",
						strokeColor : "#32a8a9"
					}
				})
			});

			geojson_layer.events.register("loadend", geojson_layer, setExtent);
			$('.olMap.mb-element').data('mbMap').map.olMap.addLayer(geojson_layer);

			var select_json = new OpenLayers.Control.SelectFeature(geojson_layer);

			function onClosePopup(evt) {
				select_json.unselectAll();
			}

			function onJsonSelect(event) {
				var feature = event.feature;
				var content_json = "<div style='width:100%; height:100%; min-height:42px; overflow:auto'><h2>" + feature.attributes.name + "</h2>";
				if (feature.attributes.description) {
					content_json += feature.attributes.description + "<br />";
				};
				if (feature.attributes.type) {
					content_json += feature.attributes.type;
				};
				content_json += "</div>";
				if (content_json.search("<script") != -1) {
					content_json = "Content contained Javascript! Escaped content below.<br>" + content_json.replace(/</g, "&lt;");
				};
				popup = new OpenLayers.Popup.FramedCloud("geojson", feature.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(100, 100), content_json, null, true, onClosePopup);
				feature.popup = popup;
				$('.olMap.mb-element').data('mbMap').map.olMap.addPopup(popup);
			}

			function onJsonUnselect(event) {
				var feature = event.feature;
				if (feature.popup) {
					$('.olMap.mb-element').data('mbMap').map.olMap.removePopup(feature.popup);
					feature.popup.destroy();
					delete feature.popup;
				}
			};

			geojson_layer.events.on({
				"featureselected" : onJsonSelect,
				"featureunselected" : onJsonUnselect
			});

			$('.olMap.mb-element').data('mbMap').map.olMap.addControl(select_json);
			select_json.activate();
			break;
	}
};

// server response after deleting file - last uploaded files div
function del(par) {
	$.ajax({
		type : "POST",
		data : {
			filename : $(par).attr("name"),
			filepath : $(par).attr("id")
		},
		url : "/mapbender3/app_dev.php/deletetrack/",
		success : function(response) {
			alert(response);
			$.ajax({
				url : "/mapbender3/app_dev.php/lastuploadedfiles/",
				success : function(response) {
					$('#tracks').html(response);
				}
			});
		}
	});
};

// server response after deleting file - search div
function deltk(par) {
	$.ajax({
		type : "POST",
		data : {
			filename : $(par).attr("name"),
			filepath : $(par).attr("id")
		},
		url : "/mapbender3/app_dev.php/deletetrack/",
		success : function(response) {
			alert(response);
			$.ajax({
				async : false,
				data : {
					fname : $("#fname").val()
				},
				url : "/mapbender3/app_dev.php/findtrack/",
				success : function(response) {
					$('#find').html(response);
				}
			});
		}
	});
};

// file download
function downl(param) {
	window.location = "/mapbender3/app_dev.php/downloadtrack/?" + $.param({
		dname : $(param).attr("name"),
		dpath : $(param).attr("id")
	});
};

/* --------------------------------------------------------- FORM HANDLERS */
//  3 buttons div toggle at the top of the sidebar
$("a[data-toggle]").on("click", function(e) {
	e.preventDefault();
	// cancel the default action of the click
	$(".d").find(".dv").hide();
	$("li").find("a").removeClass("current");
	$($(this).data("toggle")).show();
	$(this).addClass("current");
});

//  input color reset
$(document).ready(function() {
	$("#import").click(function() {
		document.getElementById('color').color.fromString('#ffffff');
	});
});

//  server response after uploading file
$(document).ready(function() {
	$("#uploaderForm").ajaxForm({
		success : function(responseText) {
			$('#output').html(responseText);
		},
		clearForm : true
	});
});

//  show last 5 uploaded files - last uploaded files div
$(document).ready(function() {
	$("#lastk").click(function() {
		$.ajax({
			url : "/mapbender3/app_dev.php/lastuploadedfiles/",
			success : function(response) {
				$('#tracks').html(response);
			}
		});
	});
});

//  show file after searching - search div
$(document).ready(function() {
	$("#fname").keyup(function() {
		if ($.trim($(this).val()) == '') {
			$('#find').html('');
		} else {
			$.ajax({
				async : false,
				data : {
					fname : $.trim($(this).val())
				},
				url : "/mapbender3/app_dev.php/findtrack/",
				success : function(response) {
					$('#find').html(response);
				}
			});
		}
	});
});

/* --------------------------------------------------------- UPLOADERBUTTON HANDLERS */
//  shows dialog and tabs
$(document).ready(function() {
	$("#showall").removeAttr("href").click(function() {
		$("#tabs").tabs().css("display", "block");
		$("#dialog").dialog({
			height : 690,
			width : 415,
			title : "Upload and view files"
		});
	});
});
