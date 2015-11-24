var express        = require('express'),
	server         = express(),
	ejs            = require('ejs'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	bcrypt         = require('bcrypt'),
	session        = require('express-session'),
	morgan         = require('morgan'),
	mongoose       = require('mongoose'),
	Schema         = mongoose.Schema,
	mongoClient    = require('mongodb').MongoClient,
	MONGOURI       = /*process.env.MONGO_URI ||*/ "mongodb://localhost:27017",
	PORT           = 3000,
	DBNAME         = "scicollab",
	// mongo,
	db;

//Set Views
server.use(express.static('./public'));

server.set('views', './views');
server.set('view engine', 'ejs');

//Set Usage
server.use(session({
	secret: "iLoveCamelCasing",
	resave: false,
	saveUninitialized: true
}));
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));

// server.use(function (req, res, next) {
// 	res.locals.presentUser = req.session.currentUser;
// 	next();
// });

//Controllers & Models

// var localUser = require('./controllers/current_user.js');

var userController = require('./controllers/users.js');
server.use('/users', userController);

var projectController = require('./controllers/projects.js');
server.use('/projects', projectController);

var sessionController = require('./controllers/session.js');
server.use(sessionController);

var requireCurrentUser = require('./controllers/middleware.js');

server.use(function (req, res, next) {
	res.locals.presentUser = req.session.currentUser;
	next();
});


//Index Get
server.get('/', function (req, res) {
	res.render('index', {
		presentUser: res.locals.presentUser
	});
});

//Database & Server Listen
// mongoClient.connect(MONGOURI + "/" + DBNAME, function (err, mongoDB) {
// 	db = mongoDB;
// });

mongoose.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	mongo = database;
	server.listen(PORT, function () {
		console.log("SciCollab Server, listening here on Port " + PORT + ".");
	});
});