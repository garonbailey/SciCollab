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

//bcrypt check pass on login
// bcrypt.compare(passAttempt, hash, function (err, res) {
// 	if (err) {
// 		message = "Incorrect password";
// 		console.log(err);
// 	} else {
// 		//set session & current user, then res.redirect to 'projects/index'
// 	}
// });

//Session Stuff
server.post('/session', function (req, res) {
	var userLogin = req.body.session.email;
	req.session.currentUser;
	User.findOne({ email: userLogin }, function (err, sessionUser) {
		if (err) {
			console.log(err);
			res.redirect(302, '/user/login');
		} else if (req.body.session.password !== sessionUser.password) {
			res.redirect(302, '/user/login');			
		} else {
			req.session.currentUser = sessionUser;
			console.log(req.session.currentUser);
			res.redirect(302, '/articles/');
		}
	});
});

var requireCurrentUser = function (req, res, next) {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect(302, '/user/login');
	}
};

// server.delete('/session', function (req, res) {
// 	req.session.currentUser;
// 	req.locals.currentUser;
// 	res.redirect(302, '/');
// });

//Routes
server.get('/', function (req, res) {
	res.render('index');
});

server.get('/signup', function (req, res) {
	res.render('users/signup');
});

server.post('/users/signup', function (req, res) {
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

server.get('/users/', function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			res.render('users/index', { 
				users: allUsers
			});
		}
	});
});

server.get('/users/:id', function (req, res) {
	var scientist = req.params.id;
	User.findOne({_id: scientist}, function (err, singleUser) {
		if (err) {
			console.log(err);
			res.redirect(302, '/users');
		} else {
			res.render('users/show', {
				singleUser: singleUser
			});
		}
	})
})

mongoose.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	mongo = database;
	server.listen(PORT, function () {
		console.log("SciCollab Server, listening here on Port 3000.")
	});
});