// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	    = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var morgan        = require('morgan');
var mongoose      = require('mongoose');
const path        = require('path');

var jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt        = require('bcrypt');
const saltRounds  = 10;

var config        = require('./config'); // get our config file
var User          = require('./app/models/user'); // get our mongoose model
var Battle        = require('./app/models/battle');
var fs            = require('fs');

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var password = 'admin'
	bcrypt.hash(password, saltRounds, function(err, hash) {
  		// Store hash in your password DB.
		var admin = new User({ 
			name: 'admin', 
			password: hash,
			admin: true 
		});
		admin.save(function(err) {
			if (err) throw err;

			console.log('User saved successfully');
			res.json({ success: true });
		});
	});
});


// basic route (http://localhost:8080)
// app.get('/', function(req, res) {
// 	res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

apiRoutes.post('/loadbattle', function(req, res) {
  //Insertamos la batalla
	Battle.collection.insertOne(req.body.battle, function(err,result) {
        console.log("Id que devuelvo-> "+result["ops"][0]["_id"]);
        res.json({id:result["ops"][0]["_id"] });
  });
});

apiRoutes.post('/updatebattle/:id', function(req, res) {
	console.log(req.body.battle);
	Battle.update({_id: req.params.id}, req.body.battle, function(err,r){
		if (err) {
			res.send(err);
			}
		res.send(r);
	});
});

apiRoutes.get('/battle/:id', function(req, res) {
	Battle.findOne({_id: req.params.id}, function(err, battle) {
		console.log("Los id que estoy comparando:" + req.params.id)
		res.json(battle);
	});
});

apiRoutes.get('/getbattles', function(req, res) {
	Battle.find({}, function(err, battles) {
		res.json(battles);
	});
});

apiRoutes.get('/loaddefault',function(req,res){
  //Cargamos las Batallas de prueba
  var battles = JSON.parse(fs.readFileSync('battles.json', 'utf8'));
  //Las guardamos en la Base de Datos
  for (var index = 0; index < battles.length; index++) {
    var element = battles[index];
    Battle.collection.insertOne(element, function(err,r) {
        console.log("Batalla: "+element.name+" insertada en la Base de Datos");
    });
  }
	res.json(battles);	
});

apiRoutes.get('/deletebattles', function(req, res) {
	Battle.collection.deleteMany({},function(err, battles) {
		console.log("Flush exitoso!");
		res.json(battles);
	});
});

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	console.log(req.body);
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			bcrypt.compare(req.body.password, user.password, function(err, match) {
				if (!match) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(
						{
							'username': user.name,
							'admin': user.admin
						}, 
						app.get('superSecret'), {
						expiresIn: 86400 // expires in 24 hours
					});

					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}		
			});

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('App listening on port ' + port);

