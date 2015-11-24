var express            = require('express'),
	projectRouter      = express.Router(),
	requireCurrentUser = require('./middleware.js'),
	Project            = require('../models/project.js');

projectRouter.get('/', requireCurrentUser, function (req, res) {
	Project.find({}, function (err, allProjects) {
		if (err) {
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			res.render('projects/index', {
				projects: allProjects,
				presentUser: res.locals.presentUser
			});
		}
	});
});

projectRouter.get('/new', requireCurrentUser, function (req, res) {
	res.render('projects/new', {
		presentUser: res.locals.presentUser
	});
});

projectRouter.post('/', requireCurrentUser, function (req, res) {
	var projectInfo = req.body.project;
	var presentUser = req.session.currentUser;
	var newProject = new Project(projectInfo);

	newProject.author.id = presentUser._id;
	newProject.author.name = presentUser.firstname + " " + presentUser.lastname;

	console.log(newProject);
});

projectRouter.get('/:id', requireCurrentUser, function (req, res) {
	var projectID = req.params.id;
	var currentProject = Project.find({ _id: projectID });

	console.log(currentProject);
	res.render('projects/show', {
		project: currentProject,
		presentUser: res.locals.presentUser
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