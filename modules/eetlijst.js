let l = console.log
let request = require('request')

let EAT = 'EAT', COOK = 'COOK', NOP = 'NOP', NONE = 'NONE'

let getStatus = (callback) => {
	request.get('http://www.eetlijst.nl/===-===', (err, res, body) => {
		body = body.replace(/[ \r\n]/g, "")
		let regex = /<inputtype="submit"name="persoon(\d)"value="([a-zA-Z ]+)"><\/td><td>(?:<imgsrc="(eet|kook|nop)\.gif">)?((?:<imgsrc="eet.gif">)*)<\/td>/g
		
		let m, results = [];
		let mapping = {
			 'eet' : EAT
			,'kook': COOK
			,'nop' : NOP
		}
		
		while(m = regex.exec(body)){
			// l(`${m[1]} | ${m[2]} | ${m[3] || 'none'} | ${m[4].length/18}`)
			results[m[1]] = {
				'number': m[1],
				'who' 	: m[2],
				'what'	: mapping[m[3]] || NONE,
				'with': m[4].length / 18
			}
		}
		callback(results)
	})
}

let setStatus = (what, callback = () => {}) => {
	let mapping = { EAT : 'wat/1' , COOK : 'wat1' , NOP : 'wat0' }
	let form = {
		'login' : '===',
		'pass' : '===',
		'persoon' : 0,
		[mapping[what]] : 'what'
	}
	
	request.post({
		url : 'http://www.eetlijst.nl/mobiel.php', form
	}, (err, res, body) => callback(err, res, body))
}

setStatus(EAT)

module.exports = {
	 'getStatus' : getStatus
	,'setStatus' : setStatus
	,EAT
	,COOK
	,NOP
	,NONE
}
