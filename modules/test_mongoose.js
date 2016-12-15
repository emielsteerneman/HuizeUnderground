let l = console.log

let mongoose = require('mongoose')
var express = require('express')

var db = mongoose.connection

db.on('error', l)
db.once('open', () => {
	l('once open')
})

mongoose.connect('mongodb://localhost/test', err => {
	l('connected')
})

var Schema = mongoose.Schema
var UserSchema = new Schema({
	first_name: String,
	last_name : String,
	email : String
})

var User = mongoose.model('users', UserSchema)

var app = express()

