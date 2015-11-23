var express            = require('express'),
	projectRouter      = express.Router(),
	requireCurrentUser = require('./middleware.js'),
	mongoClient        = require('mongodb').MongoClient,
	db;

projectRouter.get('/', requireCurrentUser, function (req, res) {
	var allProjects = db.collection('projects').find({});
	console.log(allProjects);
	res.render('projects/index', {
		projects: allProjects
	});
});

projectRouter.get('/new', requireCurrentUser, function (req, res) {
	res.render('projects/new');
});

projectRouter.post('/', requireCurrentUser, function (req, res) {
	// add new project to database from form
});

projectRouter.get('/:id', requireCurrentUser, function (req, res) {
	var projectID = req.params.id;
	var currentProject = db.collection('projects').find({ _id: projectID });

	console.log(currentProject);
	res.render('projects/show', {
		project: currentProject
	});
});

projectRouter.get('/:id/edit', requireCurrentUser, function (req, res) {
	// form to edit the project (or just to add new data, preferably) rendered
});

projectRouter.patch('/:id', requireCurrentUser, function (req, res) {
	// update project in db and redirect to current '/:id' project
});

projectRouter.delete('/:id', requireCurrentUser, function (req, res) {
	// remove project from DB and redirect to projects' index
});

module.exports = projectRouter;