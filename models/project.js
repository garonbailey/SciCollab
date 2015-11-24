var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var projectSchema = new Schema ({
	title: { type: String, required: true },
	author: {
		name: { type: String, required: true },
		id: { type: String, required: true }
	},
	collaborators: [{
		name: String,
		id: String
	}],
	description: { type: String, required: true },
	data: {
		layout: [{}],
		data: [{}]
	},
	open: Boolean,
}, { collection: 'projects', strict: false });

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;