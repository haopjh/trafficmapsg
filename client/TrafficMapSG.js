
Template.data.events({
	'click #get-data': function(){
		Meteor.call('removeData');
	},
});


Template.map.rendered = function() {
	var stop = false;

	var id = Meteor.setInterval(function() {
		console.log("this ran");
		if(entryHandle.ready()){

			var mapOptions = {
				center: new google.maps.LatLng(1.35208, 103.81984),
				zoom: 11,
    			styles: mapStyle
			};
			map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);
			var trafficLayer = new google.maps.TrafficLayer();
			trafficLayer.setMap(map);

			// Try HTML5 geolocation
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

					var infowindow = new google.maps.InfoWindow({
						map: map,
						position: pos,
						content: 'You are here!'
					});

					map.setCenter(pos);
					map.setZoom(12);
				}, function() {
					handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				handleNoGeolocation(false);
			}

			var eList = Entries.find({archive: false}).fetch();


			_.each(eList, function(entry) {
				var myLatlng = new google.maps.LatLng(entry.lat,entry.long);
				var marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: entry.title
				});
			});	
			Meteor.clearInterval(id);
		}
	},10);
	
	mapStyle = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
}


handleNoGeolocation = function(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(60, 105),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

