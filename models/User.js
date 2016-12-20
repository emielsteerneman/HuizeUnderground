let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
	 name 		: {type : String, required : true, trim : true, match : /[a-zA-Z ]+/}
	,username 	: {type : String, required : true, trim : true, match : /[a-zA-Z]+/, index: {unique: true, dropDups: true}}
	,password 	: String
	,created 	: {type : Date, default : Date.now}
	,last_login : {type : Date, default : Date.now}
})

userSchema.statics.create = function(name, username, password, cb){
	console.log(`userSchema: creating user: '${name}', username : '${username}', password : '${password}'`)
	
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt)
	
	let user = new User()
	user.name 		= name
	user.username 	= username
	user.password 	= hash
	
	user.save(cb)
}

userSchema.methods.verify = function(password, cb){
	bcrypt.compare(password, this.password, cb)
}

let User = mongoose.model('User', userSchema)

module.exports = User