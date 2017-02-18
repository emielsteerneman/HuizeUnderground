let l = console.log

let express 	= require('express')
let fs			= require('fs-extra')
let path		= require('path')
let _			= require('lodash')

let app = express()
app.on('mount', parent => {
	app.set('views', parent.get('views'))
	app.locals.basedir = parent.locals.basedir
})


app.get('/', (req, res, next) => {
	let basepath = path.join(app.locals.basedir, 'public', 'kerstdiner', 'pictures')
	fs.readdir(basepath, (err, photos) => {
		photos = _.filter(photos, photo => photo.slice(0, 3) !== 'tn_')
		res.render('kerstdiner/index', {
			photos : photos
		})
	})
})

module.exports = {
	app
}