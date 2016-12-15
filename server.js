let l = console.log

let _ = require('lodash')
var express = require('express')
var path = require('path')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

app.use('/', function(req, res, next){
	console.log("Request incoming: " + req.url)
	next();
	// res.send("WEEEEEBBBBSSSSIIIIIIIIIIIIIIIITEEEEEEEEEEEEEEEEEE!!!!!!")
})

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', express.static(path.join(__dirname, 'node_modules')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use('/api', require('./routes/api'))







// let arr = ['a', 'b', 'c']
// let i = 0

// setInterval(() => {
	// i++
	// l('sending ' + arr[i%3])
	// port.write(arr[i%3])
// }, 1000);

app.use('/:n(\\d)', (req, res, next) => {
	res.send(req.params.n)
	l('sending ' + req.params.n)
	port.write(req.params.n)
})

app.use('/r', (req, res, next) => {
	var rand = Math.floor(Math.random() * 8)
	rand = String.fromCharCode(rand | 48)
	res.send('' + rand)
	l('sending ' + rand)
	port.write(rand)
})

app.listen(3000, function(a, b, c){
	// console.log("__ROOTPATH:", __ROOTPATH)
	console.log("Server listening on port 3000..")
})
