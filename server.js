console.log('Initializing..')
let l = console.log

let _ 		= require('lodash')
let express = require('express')
let session = require('express-session')
let path 	= require('path')
let mongoose 	= require('mongoose')
let bodyParser 	= require('body-parser')
let cookieParser= require('cookie-parser')
let bcrypt		= require('bcrypt')

let app = express()

let authManager = require('./managers/authManager.js')
let userManager = require('./managers/userManager.js')

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', express.static(path.join(__dirname, 'node_modules')))

app.set('views', __dirname + '/public/views')
app.set('view engine', 'jade')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let secret = bcrypt.genSaltSync(0)
app.use(cookieParser(secret));
app.use(session({
	 secret: secret
	,httpOnly: true
	,resave: false
	,saveUninitialized: true
}))


app.use('/', function(req, res, next){
	console.log(`\n\n\n\n==================== ${req.method} Request: ${req.url} ====================`)
	res.locals.session = req.session
	
	if (!req.session.views)
		req.session.views = 0
	req.session.views++;
	
	let f = (cookie, key) => l(key + ' -> \t' + JSON.stringify(cookie))
	l('\n====== Cookies ======')
	_.each(req.cookies, 	  f)
	l('====== Signed  ======')
	_.each(req.signedCookies, f)	
	l('====== Session ======')
	_.each(req.session, f)	
	l('=====================\n')
	
	next()
})

app.use('/'			, authManager.app)
app.use('/log'		, authManager.app)
app.use('/users'	, userManager.app)

app.get('/', (req, res, next) => {
	res.render('index', {title : 'Page not found'})
})

app.listen(3000, function(a, b, c){
	console.log("Server listening on port 3000..")
})
