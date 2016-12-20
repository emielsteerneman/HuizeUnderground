let l = console.log

let mongoose = require('mongoose')
let express = require('express')
let User = require('../models/User.js')

var db = mongoose.connection

db.on('error', l)
db.once('open', () => {
	l('once open')
})

mongoose.connect('mongodb://localhost/test', err => {
	l('connected')
})

var henk = new User({
	name: 'Henk',
	username: 'henk',
	password:'pw',
	created: Date.now(),
	last_login: Date.now()
})

// henk.save((err, henk) => {
	// l('saved!')
	// l(err)
	// l(henk)
// })

User.find({'name': 'Henk'}, (err, result) => {
	if(err) console.error(err)
	
	l('Query!')
	l(result.length)
})


l(henk._id)













