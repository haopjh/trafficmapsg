
Template.data.events({
	'click #get-data': function(){
		Meteor.call('getData');
	},
});


Template.map.rendered = function() {
	var stop = false;

	var id = Meteor.setInterval(function() {
		console.log("this ran");
		if(entryHandle.ready()){

			var mapOptions = {
				center: new google.maps.LatLng(1.35208, 103.81984),
				zoom: 11
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

