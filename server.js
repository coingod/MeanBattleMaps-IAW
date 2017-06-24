// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
const path = require('path');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
const saltRounds = 10;

var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Battle = require('./app/models/battle');

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
	console.log(req.body.battles);
	Battle.collection.insertOne(req.body.battle, function(err,r) {
 		 console.log("Batalla: "+req.body.battle.name+" insertada en la Base de Datos");
	});
	res.json({success:true, message:"Llego el mapa :)"});
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
//Batalla de prueba
    var battle = {};
    battle.name = "Dia D";
    battle.operation = "Overlord";
    battle.conflict = "Segunda Guerra Mundial";
    battle.start = new Date(1944, 6, 6);
    battle.end = new Date(1944, 6, 6);
    battle.location = "Normandia, Francia";
    battle.result = "Victoria Aliada";
    battle.markers = [
        {id:0, title: "Playa Utah", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.4222982, lng: -1.1968746, casualties: 197},
        {id:1, title: "Playa Omaha", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3726418, lng: -0.9077147, casualties: 2000},
        {id:2, title: "Playa Gold", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3319829, lng: -0.5778482, casualties: 1000},
        {id:3, title: "Playa Juno", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3260474, lng: -0.4601456, casualties: 961},
        {id:4, title: "Playa Sword", icon:{url:"/assets/img/icons/battle.png", size: [32, 32], origin: [0,0], anchor: [16, 16]}, lat: 49.3214565, lng: -0.3907291, casualties: 1000},
    ];
    battle.belligerents = [
        {
          faction: "Aliados",
          armies:
          [
            {id:0, title: "4º Division", icon:"us", lat: 49.5222982, lng: -0.9968746, strength: 23300},
            {id:1, title: "1º y 29º Division", icon:"us", lat: 49.4726418, lng: -0.8077147, strength: 34230},
            {id:2, title: "50º Division", icon:"uk", lat: 49.4319829, lng: -0.5278482, strength: 25000},
            {id:3, title: "3º Division", icon:"ca", lat: 49.4260474, lng: -0.4101456, strength: 21400},
            {id:4, title: "3º Division", icon:"uk", lat: 49.4214565, lng: -0.3007291, strength: 28850}
          ],
          strength: 156000,
          casualties: 10000
        },
        {
          faction: "Eje",
          armies:
          [
            {id:0, title: "352º Division Infanteria", icon:"ge", lat: 49.2222982, lng: -1.1968746, strength: 0},
            {id:1, title: "VII Ejercito", icon:"ge", lat: 49.0726418, lng: -0.9077147, strength: 0},
            {id:2, title: "716º Division Infanteria", icon:"ge", lat: 49.1319829, lng: -0.5778482, strength: 0},
            {id:3, title: "XV Ejercito", icon:"ge", lat: 49.1060474, lng: -0.3601456, strength: 0},
            {id:4, title: "21º Division Panzer", icon:"ge", lat: 49.1214565, lng: -0.3007291, strength: 0}
          ],
          strength: 50350,
          casualties: 6500
        }
    ];
    battle.frontlines = [
        {
          id: 0,
          avatar:"trending_up", 
          title:"Desembarco 1", 
          color:"red",
          path: [
            [49.5122982,-1.0068746], 
            [49.4412982, -1.1668746]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          id: 1,
          avatar:"trending_up", 
          title:"Desembarco 2",
          color:"red",
          path: [
            [49.4726418, -0.8077147], 
            [49.3726418, -0.9077147]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          id: 2,
          avatar:"trending_up", 
          title:"Desembarco 3", 
          color:"red",
          path: [
            [49.4319829, -0.5278482], 
            [49.3319829, -0.5778482]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          id: 3,
          avatar:"trending_up", 
          title:"Desembarco 4", 
          color:"red",
          path: [
            [49.4260474, -0.4101456],
            [49.3260474, -0.4601456]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          id: 4,
          avatar:"trending_up", 
          title:"Desembarco 5", 
          color:"red",
          path: [
            [49.4214565, -0.3007291], 
            [49.3214565, -0.3907291]
          ], 
          icons: [{icon:{path: 'FORWARD_CLOSED_ARROW'},offset: '100%'}]
        },
        {
          id: 5,
          avatar:"show_chart", 
          title:"12 de Junio de 1944",
          color:"red",
          path: [
            [49.463661554130816, -1.231842041015625],
            [49.426160395179274, -1.327972412109375],
            [49.348388163438194, -1.344451904296875],
            [49.30811283252169, -1.201629638671875],
            [49.283035996995174, -1.10687255859375],
            [49.174521518067834, -0.965423583984375],
            [49.10444366870733, -0.77178955078125],
            [49.20683172516032, -0.60699462890625],
            [49.2032427441791, -0.330963134765625],
            [49.222081988283755, -0.240325927734375],
            [49.29109779978075, -0.24169921875]
          ]
        },
        {
          id: 6,
          avatar:"show_chart", 
          title:"25 de Junio de 1944",
          color:"blue",
          path: [
            [49.257050109522424, -1.669921875],
            [49.19426915204543, -1.34033203125],
            [49.08106236432073, -1.1370849609375],
            [49.11702904077932, -0.92010498046875],
            [49.0729662700941, -0.800628662109375],
            [49.10893881094389, -0.560302734375],
            [49.0945529223241, -0.384521484375],
            [49.112534631533656, -0.243072509765625],
            [49.21670007971534, -0.20050048828125],
            [49.29199347427707, -0.199127197265625]
          ]
        },
    ]

	Battle.collection.insertOne(battle, function(err,r) {
			console.log("Batalla: "+battle.name+" insertada en la Base de Datos");
	});

	res.json(battle);	
	//Repetir código para agregar más batallas
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

