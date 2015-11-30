var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var projectSchema = new Schema ({
	title: { type: String, required: true },
	author: {
		name: { type: String, required: true },
		id: { type: String, required: true }
	},
	collaborators: [{ 
		name: { type: String },
		id: { type: String }
	}],
	description: { type: String, required: true },
	category: { type: String, required: true },
	subcategory: [{ type: String }],
	data: {
		layout: [{}],
		data: [{}]
	},
	open: Boolean,
}, { collection: 'projects', strict: false });

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;