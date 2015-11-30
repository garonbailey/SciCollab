var express            = require('express'),
	projectRouter      = express.Router(),
	requireCurrentUser = require('./middleware.js'),
	Project            = require('../models/project.js'),
	User               = require('../models/user.js');

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
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
			res.redirect(302, '/');
		} else {
			res.render('projects/new', {
				presentUser: res.locals.presentUser,
				allUsers: allUsers
			});
		}
	});
});

projectRouter.post('/', requireCurrentUser, function (req, res) {
	var projectInfo = req.body.project;
	var presentUser = req.session.currentUser;
	var newProject = new Project(projectInfo);
	var newCollab = function () {
		newProject.collaborators.push({
			name: "",
			id: ""
		});
	};

	newProject.author.id = presentUser._id;
	newProject.author.name = presentUser.firstname + " " + presentUser.lastname;
	subcat = newProject.subcategory;
	newProject.subcategory = subcat[0].split(/,\W?/);
	collabs = [];
	if (newProject.collaboratorInit && newProject.collaboratorInit.length > 0) {
		for (var i = 0; i < newProject.collaboratorInit.length; i++) {
			collabs.push(newProject.collaboratorInit[i].split(/,\W?/));
		};
		console.log("collabs: ", collabs);
	};
	for (var x = 0; x < collabs.length; x++) {
		if (collabs.length > x) {
			newCollab();
			newProject.collaborators[x].id = collabs[x][0];
			newProject.collaborators[x].name = collabs[x][1];
		};
	};

	newProject.save(function (err, projectCreated) {
		if (err) {
			console.log(err);
			res.redirect(302, '/projects/new');
		} else {
			console.log(projectCreated);
			res.redirect(302, '/projects/');
		}
	});
});

projectRouter.get('/:id', requireCurrentUser, function (req, res) {
	var projectID = req.params.id;
	Project.findOne({ _id: projectID }, function (err, currentProject) {
		if (err) {
			console.log(err);
			res.redirect(302, 'projects/')
		} else {
			console.log(currentProject);
			res.render('projects/show', {
				project: currentProject,
				presentUser: res.locals.presentUser
			});
		}
	});
});

projectRouter.get('/:id/edit', requireCurrentUser, function (req, res) {
	// form to edit the project (or just to add new data, preferably) rendered
	var projectToEdit = req.params.id;
	Project.findOne({_id: projectToEdit}, function (err, projectEdit) {
		if (err) {
			console.log(err);
			res.redirect(302, '/projects');
		} else {
			res.render('projects/edit', {
				projectEdit: projectEdit,
				presentUser: res.locals.presentUser
			});
		}
	});
});

projectRouter.patch('/:id', requireCurrentUser, function (req, res) {
	// update project in db and redirect to current '/:id' project
	var projectToPatch = req.params.id;
	var projectUpdate = req.body.project;

	//pre-process data on form submission to more easily push to the project in the DB

	Project.findOneAndUpdate({_id: projectToPatch}, /*info to update the project with; example {$push: { "data.data": projectUpdate.data }} ,*/function (err, projectPatch) {
		console.log("Form data: ", projectUpdate);
		console.log("X data: ", projectUpdate.data.x.value);
		console.log("Y data: ", projectUpdate.data.y.value);
	});
});

projectRouter.delete('/:id', requireCurrentUser, function (req, res) {
	// remove project from DB and redirect to projects' index
});

module.exports = projectRouter;