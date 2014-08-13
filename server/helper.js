Meteor.methods({
	'getData': function() {
		getData();

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
				var timestamp = moment(date, "MM-DD").add('hours', hour).add('minutes', minute).unix();

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

var MyCron = new Cron();
MyCron.addJob(10, function(){
	getData();
});







