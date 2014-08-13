Entries = new Meteor.Collection('entries');

Meteor.methods({

	newEntry: function(entryAttr) {

		if (!feedAttr.name)
      		throw new Meteor.Error(422, 'Every entry must have a id');

		var entry = _.extend(_.pick(feedAttr, 'id', 'title', 'type',
			'long', 'lat', 'timestamp'),{
			archive: false,
		});

		Entries.insert(entry);

		return entry.id;
	}

});

