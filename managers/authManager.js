let l = console.log

let mongoose 	= require('mongoose')
let express 	= require('express')
let User 		= require('../models/User.js')
let _ 			= require('lodash')
let bcrypt 		= require('bcrypt')
let cookieParser= require('cookie-parser')
let jade 		= require('jade')
let brcypt		= require('bcrypt')

let app = express()

let db = mongoose.connection

// app.use('/', (req, res, next) => {
	// l('authManager ' + req.method)
	// next()
// })

app.post('/login', (req, res, next) => {
	let username = req.body.username
	let password = req.body.password
	l(`authManager : ${req.method} /login : '${username}' - '${password}'`)
	
	req.session.loggedIn = false
	
	// Get user
	User
	.findOne({'username' : username})
	.exec((err, user) => {
		if(err){
			console.log('authManager : login failed - MongoDB error : ' + err.code)
			res.redirect('/users')
		}else
		if(!user){
			console.log('authManager : login failed - no such user')
			res.redirect('/users')
		}
		else{
			user.verify(password, (err, result) => {
				if(err){
					console.log('authManager : login failed - verification error : ' + err.code)
				}else
				if(!result){
					console.log('authManager : login failed - incorrect password')
					res.redirect('/users')
				}else{
					console.log('authManager : login succesful')
					req.session.loggedIn = true
					res.redirect('/users')
				}
			})
		}
	})
	
	// res.redirect('/users')
})

app.post('/logout', (req, res, next) => {
	l(`authManager : ${req.method} /logout`)
	req.session.loggedIn = false
	res.redirect('/users')
})

module.exports = {
	 app
}





