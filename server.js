let l = console.log

let timers = [Date.now(), Date.now(), Date.now()]
time('initializing...\n')
let _ 			= require('lodash')				;time('lodash', 2);
let express 	= require('express')			;time('express', 2);
let session 	= require('express-session')	;time('express-session', 2);
let http 		= require('http')				;time('http', 2);
let socketio	= require('socket.io')			;time('socket.io', 2);
let path 		= require('path')				;time('path', 2);
let mongoose 	= require('mongoose')			;time('mongoose', 2);
let bodyParser 	= require('body-parser')		;time('body-parser', 2);
let cookieParser= require('cookie-parser')		;time('cookie-parser', 2);
let bcrypt		= require('bcrypt')				;time('bcrypt', 2);
let Promise 	= require('bluebird')			;time('bluebird', 2);
let moment 		= require('moment')				;time('moment', 2);
let fs	 		= require('fs-extra')			;time('fs-extra', 2);
let winston		= require('winston')			;time('winston', 2);

let authManager = require('./managers/authManager.js')	;time('authManager', 2);
let userManager = require('./managers/userManager.js')	;time('userManager', 2);
time('requires completed\n', 1)

let app, server, io, logger

// Winston
logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: './logs/log.txt' })
	]
});
time('winston initiated\n', 1)

app = express()
server = http.Server(app)
io = socketio(server)
/* ======== app ======== */ {
	app.locals.basedir = __dirname	
		
	// Static files
	app.use('/', express.static(path.join(__dirname, 'public')))
	app.use('/', express.static(path.join(__dirname, 'node_modules')))

	// Rendering engine
	app.set('views', __dirname + '/public/')
	app.set('view engine', 'jade')

	// BodyParser
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	// Cookies
	let secret = bcrypt.genSaltSync(0)
	app.use(cookieParser(secret));
	app.use(session({
		 secret: secret
		,httpOnly: true
		,resave: false
		,saveUninitialized: true
	}))

	// On every request
	app.use('/', function(req, res, next){
		l(`====== ${req.method} ${req.url} ====== ${moment().format('ddd D MMM YYYY HH:mm:ss')} ======`)
		res.locals.session = req.session
		
		// let f = (cookie, key) => l(`    ${key} -> \t${JSON.stringify(cookie)}`)
		// _.each(['cookies', 'signedCookies', 'session'], key => {
			// l(`--- ${key} `)
			// _.each(req[key], f)
		// })
		// l('\n')
		
		logger.info(`${moment().format('ddd D MMM YYYY HH:mm:ss')} | ${req.method} ${req.url} | connect.sid : ${req['signedCookies']['connect.sid']}`)
		
		next()
	})

	// Session
	app.use('/'			, authManager.app)

	app.use('/$', (req, res, next) => res.render('views/index', {'title' : 'Home'}))
	
	// Managers
	app.use('/log'		, authManager.app)
	app.use('/users'	, userManager.app)

	time('statics, engine, bodyparser, cookies, all, sessions, managers', 2)
	
	// Scan all module folders for index.js
	let indexes = []
	let basePath = './modules'
	;(function walk(p = ''){
		let relPath = path.join(basePath, p)
		_.each(fs.readdirSync(relPath), filename => {
			let filepath = path.join(p, filename)
			relPath = path.join(basePath, filepath)
			if(filename === 'index.js')
				indexes.push(p)
			if(fs.statSync(relPath).isDirectory())
				walk(filepath)
		})
	})();
	
	// init all index.js files
	_.each(indexes, index => {
		let reqPath = path.join(basePath, index, 'index.js')
		reqPath = './' + reqPath
		app.use('/' + index, require(reqPath).app)
	})
	time('dynamic index.js files', 2)
	
	// Default
	app.use('/', (req, res, next) => {
		console.log('Error!')
		res.render('views/index', {title : 'Page not found'})
	})
} /* ================ */
time('app completed\n', 1)

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/test', err => {
	time('connected to mongoDB', 1)
	server.listen(3000, function(a, b, c){
		time('listening on 3000\n', 1)
		time('App running')
	})
})

function time(str, level = 0){
	let time = Date.now()
	let lastTime = timers[level]	
	
	l(`time ${level} : ${modStr((time-lastTime) + 'ms', 7)} : ${str}`)
	
	time = Date.now()
	for(var i = level; i < timers.length; i++){
		timers[level] = time
	}
}

function modStr(str, len){
	return ("                 " + str).slice(-len)
}