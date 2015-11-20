var express          = require('express'),
	server           = express(),
	ejs              = require('ejs'),
	expressLayouts   = require('express-ejs-layouts'),
	bodyParser       = require('body-parser'),
	methodOverride   = require('method-override'),
	bcrypt           = require('bcrypt'),
	session          = require('express-session'),
	morgan           = require('morgan'),
	mongoose         = require('mongoose'),
	Schema           = mongoose.Schema,
	mongoClient      = require('mongodb').MongoClient,
	MONGOURI         = /*process.env.MONGO_URI ||*/ "mongodb://localhost:27017",
	DBNAME           = "scicollab",
	PORT             = /*process.end.PORT ||*/ 3000,
	presentUser,
	mongo,
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
// server.use(expressLayouts);
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(methodOverride('_method'));

//Schema
var userSchema = new Schema ({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	field: { type: String, required: true },
	research: [],
	organization: { type: String, required: true},
	degree: { type: String },
	education: { type: String, required: true },
	bio: { type: String },
	projects: [{ namee: String,
				 id: String
	}],
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true}
}, {collection: 'users', strict: false}, {strict: false});
var User = mongoose.model('User', userSchema);
//bcrypt salting & hashing
userSchema.pre('save', function (next) {
	var user = this;
	bcrypt.genSalt(10, function (err, salt) {
		var userPass = user.password;
		bcrypt.hash(userPass, salt, function (err, hash) {
			user.password = hash;
			next();
		});
	});
});


//Session Stuff
server.get('/login', function (req, res) {
	var flash = {
		message: ""
	};
	res.render('users/new', {
		flash: flash
	});
});

server.post('/session', function (req, res) {
	var userLogin = req.body.session;
	req.session.currentUser;
	User.findOne({ email: userLogin.email }, function (userErr, sessionUser) {
		if (userErr) {
			console.log(err);
			res.redirect(302, '/login');
		} else {
			bcrypt.compare(userLogin.pass, sessionUser.password, function(passErr, cryptRes) {
				if (passErr) {
					var passErrFlash = {
						message: "Error Logging in"
					};
					console.log(err);
					res.render('users/new', {
						flash: passErrFlash
					});
				} else if (cryptRes) {
					req.session.currentUser = sessionUser._id;
					presentUser = sessionUser;
					res.redirect(302, '/projects');
				} else if (!cryptRes) {
					var invalidFlash = {
						message: "Invalid Email/Password Combination"
					};
					res.render('users/new', {
						flash: invalidFlash
					});
				}
			});
		}
	});
});

server.get('/logout', function (req, res) {
	delete req.session.currentUser;
	presentUser = undefined;
	res.redirect(302, '/login');
});

var requireCurrentUser = function (req, res, next) {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect(302, '/login');
	}
};

//Routes

//No Current User Required
server.get('/', function (req, res) {
	res.render('index', {
		presentUser: presentUser
	});
});

server.post('/users/new', function (req, res) {
	var userInfo = req.body.user;

	var newUser = new User(userInfo);
	newUser.projects = [];
	newUser.save(function (err, userCreated) {
		if (err) {
			console.log(newUser);
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			console.log(userCreated);
			res.redirect(302, '/');
		}
	});
});

//With Current User

//User routes
server.get('/users', requireCurrentUser, function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			res.render('users/index', {
				users: allUsers,
				presentUser: presentUser
			});
		}
	});
});

server.get('/users/:id', requireCurrentUser, function (req, res) {
	var scientist = req.params.id;
	User.findOne({_id: scientist}, function (err, singleUser) {
		if (err) {
			console.log(err);
			res.redirect(302, '/users');
		} else {
			res.render('users/show', {
				singleUser: singleUser,
				presentUser: presentUser
			});
		}
	});
});

//Project routes

server.get('/projects', requireCurrentUser, function (req, res) {
	var allProjects = db.collection('projects').find({});
	console.log(allProjects);
	res.render('projects/index', {
		projects: allProjects,
		presentUser: presentUser
	});
});

server.get('/projects/new', requireCurrentUser, function (req, res) {
	res.render('projects/new', {
		presentUser: presentUser
	});
});

server.get('/projects/:id', requireCurrentUser, function (req, res) {
	var projectID = req.params.id;
	var currentProject = db.collection('projects').find({ _id: projectID });

	console.log(currentProject);
	res.render('projects/show', {
		project: currentProject,
		presentUser: presentUser
	});
});

mongoClient.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	db = database;
});

mongoose.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	mongo = database;
	server.listen(PORT, function () {
		console.log("SciCollab Server, listening here on Port 3000.")
	});
});