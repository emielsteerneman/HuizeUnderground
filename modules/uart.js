let l = console.log

let _ = require('lodash')
let serialport = require('serialport')

let port;
serialport.list((err, ports) => {
	_.each(ports, (port) => {
		if(port.manufacturer === "Silicon_Labs"){
			l(`Connecting to ${port.manufacturer} on port ${port.comName}`)
			port = new serialport(port.comName, {
				baudRate: 9600,
				parser: serialport.parsers.readline('\n')
			})
			port.on('data', data => {
				l(data)
			})
			port.on('error', err => {
				l(err)
			})
		}
	})
})