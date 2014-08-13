Meteor.publish('entries', function() {
	return Entries.find({archive: false}, {sort: {timestamp: 1}});
});

