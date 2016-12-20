let l = console.log

let mongoose 	= require('mongoose')
let express 	= require('express')
let User 		= require('../models/User.js')
let _ 			= require('lodash')
let bcrypt 		= require('bcrypt')

let app = express()

app.on('mount', parent => {
	app.set('views', parent.get('views'))
})

let db = mongoose.connection
db.on('error', l)
mongoose.connect('mongodb://localhost/test', err => {
	l('connected')
})

app.use('/', (req, res, next) => {
	res.locals.title = "Users"
	next()
})

function verifyUser(username, password){
	l(`userManager: verifying user ${username} : ${password}`)
	
	res.render('users', res.locals)
}

app.get('/', (req, res, next) => {
	
	res.locals.userProperties = ['name', 'username', 'password']
	
	User
	.find()
	.exec((err, result) => {
		if(err) 
			console.error(err)

		res.locals.users = result
		res.render('users', res.locals)
	})
})

app.post('/', (req, res, next) => {
	let name 	 = req.body.name
	let username = req.body.username
	let password = req.body.password
	
	let result = User.create(name, username, password, (err, user) => {
		if(err)
			console.error('Error ' + err.code + ' : User already exists')
		else
			console.log('Success : user ' + user.username + ' created')
	})

	res.redirect('/users')
})

app.get('/:user', (req, res, next) => {
	let username = req.params.user
	
	l('User: ' + username)
	User
	.findOne({'username' : username})
	.exec((err, user) => {
		l(err)
		l(user)
		l('User found')
		l('\t' + user.name)
		l('\t' + user.username)
		l('\t' + user.password)
		l('\t' + user.created)
		l('\t' + user.last_login)
		user.verify('password')
	})
	
})

module.exports = {
	 app
	,verifyUser
}





