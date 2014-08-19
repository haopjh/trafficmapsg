Meteor.methods({
	'getData': function() {
		getData();

	},

	removeData: function(){
		removeData();
	}
});


getData = function() {
	HTTP.get("http://datamall.mytransport.sg/ltaodataservice.svc/IncidentSet",
		{
			headers: {
				AccountKey: "4dA1XNRsBc3cSvN2AtYwpA==",
				UniqueUserID: "273d5f43-a08f-4990-8724-18f33374c1b4"
			}
			// headers: {'Access-Control-Allow-Origin': '*'}
		}, function(err, results) {
		if (err) {
			console.log("error returned");
			return err;
        }else{

			var entries = results["content"].split("<entry>");
			//removes first data
			entries.shift();
			_.each(entries, function(entry) {
				var wholeTitle = entry.split("</title>")[0].split("<title type=\"text\">")[1];
				var tList = wholeTitle.split(" ");
				tList.shift(); 
				var title = tList.join(" ");

				var type = entry.split("</d:Type>")[0].split("<d:Type>")[1];
				var longitude = entry.split("</d:Longitude>")[0].split("<d:Longitude m:type=\"Edm.Double\">")[1];
				var latitude = entry.split("</d:Latitude>")[0].split("<d:Latitude m:type=\"Edm.Double\">")[1];
				
				//get time
				var time = wholeTitle.split(" ")[0];
				var date = time.split(")")[0].split("(")[1];
				var hour = time.split(")")[1].split(":")[0];
				var minute = time.split(")")[1].split(":")[1];
				var timestamp = moment(date, "DD-MM").unix() + parseInt(hour) * 60 + parseInt(minute);

				console.log(timestamp);

				//getid
				var id = entry.split("(")[1].split(")")[0];

				var entry = Entries.findOne({title: title, type: type});
				if(entry){
					console.log("Warning: Entry exists, will not be saving to db");
				}else{
					Entries.insert({
						'title': title,
						'type': type,
						'long': longitude,
						'lat': latitude,
						'timestamp': timestamp,
						'id': id,
						'archive': false
					});
					console.log("Success: Entry added"); 
				}
					

			});

        }
	});
}

if(Entries.find().count() === 0){
	getData();
	Meteor.setTimeout(function(){
		removeData();
	},12000);
}

removeData = function() {
	var eList = Entries.find({archive: false}).fetch();
	_.each(eList, function(entry) {
		if((moment().unix() - entry.timestamp) > 900){
			Entries.update(entry._id, {$set: {archive: true}}, function(error) {
				if (error) {
					// display the error to the user
					throwError(error.reason);
				}
			});
		}
	});
}


var MyCron = new Cron();
MyCron.addJob(10, function(){
	getData();
	removeData();
});







