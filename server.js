var express        = require('express'),
	server         = express(),
	ejs            = require('ejs'),
	expressLayouts = require('express-ejs-layouts'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	morgan         = require('morgan'),
	mongoClient    = require('mongodb').MongoClient,
	MONGOURI       = process.env.MONGO_URI || "mongodb://localhost:27017",
	DBNAME         = "scicollab",
	PORT           = process.end.PORT || 3000,
	mongo;








mongoClient.connect(MONGOURI + "/" + DBNAME, function (err, database) {
	mongo = database;
	server.listen(PORT, function () {
		console.log("SciCollab Server, listening here on Port 3000.")
	});
});