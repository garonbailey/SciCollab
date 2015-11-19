var express        = require('express'),
	server         = express(),
	ejs            = require('ejs'),
	expressLayouts = require('express-ejs-layouts'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	bcrypt         = require('bcrypt'),
	session        = require('express-session'),
	morgan         = require('morgan'),
	mongoClient    = require('mongodb').MongoClient,
	MONGOURI       = /*process.env.MONGO_URI ||*/ "mongodb://localhost:27017",
	DBNAME         = "scicollab",
	PORT           = /*process.end.PORT ||*/ 3000,
	mongo;

//Set Views
server.set('views', './views');
server.set('view engine', 'ejs');

//Set Usage
server.use(session({
	secret: "iLoveCamelCasing",
	resave: false,
	saveUninitialized: true
}));
server.use(expressLayouts);
server.use(express.static('./public'));
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));


server.get('/', function (req, res) {
	res.render('index');
});

server.get('/signup', function (req, res) {
	res.render('users/signup');
});

server.post('/users/signup', function (req, res) {
	var newUser = req.body.user;

	console.log(newUser);

	res.redirect(302, '/');
});

mongoClient.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	mongo = database;
	server.listen(PORT, function () {
		console.log("SciCollab Server, listening here on Port 3000.")
	});
});