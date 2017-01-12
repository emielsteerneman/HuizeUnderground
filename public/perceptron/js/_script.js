l = console.log

let artist = null
let trainer = null
let tStart = tickCounter = totalPerformance = 0
let isTraining = false

let ctxBottom, ctx0, ctx1, ctxTop, canvasBottom, canvas0, canvas1, canvasTop
let canvasIds = ['canvasBottom', 'canvas0', 'canvas1', 'canvasTop']
let ctxs = []

let init = () => {
	l('init()')
	// Cookies
	// let settings = readCookie('settings')
	// if(settings){
		// if(settings.randomFactor) 	 $('#randomFactor').val(settings.randomFactor)
		// if(settings.learningFactor)  $('#learningFactor').val(settings.learningFactor)
		// if(settings.nIterations)	 $('#nIterations').val(settings.nIterations)
		// if(settings.trainIterations) $('#trainIterations').val(settings.trainIterations)
	// }

	// Init config
	conf.CANVAS_WIDTH = window.innerWidth
	conf.CANVAS_HEIGHT = window.innerHeight
	conf.OFFSET_X = conf.CANVAS_WIDTH / 2
	conf.OFFSET_Y = conf.CANVAS_HEIGHT / 2

	// Init canvasses
	_.each(canvasIds, (canvasId, i) => {
		let canvas = document.getElementById(canvasId)
		canvas.width = conf.CANVAS_WIDTH
		canvas.height = conf.CANVAS_HEIGHT
		ctxs[i] = canvas.getContext('2d')
	})
	ctxBottom = ctxs[0]; ctx0 = ctxs[1]; ctx1 = ctxs[2]; ctxTop	= ctxs[2];
	
	ctx1.globalAlpha = 0.05
	
	// Init event listeners
	$(document).on('keydown', keyDown)
	$('#canvasTop').click(canvasClicked)
	$('#exportSet').click(exportSet);
	$('#clearSet').click(clearSet);
	$('#clearCanvas').click(resetCanvas);
	$('#randomDataset').click(randomDataset);
	$('#train').click(train);
	$('#configAddPoint').click(configAddPoint);
	
	// Init Artist
	artist = new Artist({ctxBottom, ctx0, ctx1, ctxTop})
	artist.drawCartesian(ctx0)
	
	// Init trainer
	trainer = new Trainer(artist)
	
	_.each(trainer.datasets, (set, i) => {
		$('#buttons').append(`<div class='btn dataset' data-set=${i}>set ${i}</div> `)
	})
	
	$('#buttons').on('click', '.dataset', function(evt){
		trainer.dataset = trainer.datasets[$(this).data('set')]
		isTraining = false
		resetCanvas()
	})
	
	// tStart = performance.now()
	// tick()
}

// let tick = () => {
	// setTimeout(tick, 1000/conf.FPS)
	// t0 = performance.now()
	
	// Draw 
	
	// Prepare for next tick
	// tickCounter++
	
	// Performance
	// t1 = performance.now()
	// totalPerformance += (t1 - t0)
	// $("#text").text(tickCounter + " - " + ((tickCounter/(performance.now() - tStart))*1000).toFixed(1) + " fps - " + (totalPerformance/tickCounter).toFixed(2) + " ms")
// }

function canvasClicked(evt){
	coords = getCursorPosition($('#canvasTop')[0], evt)
	
	_x =  coords.x - conf.OFFSET_X
	_y = -coords.y + conf.OFFSET_Y
	
	_x /= conf.SCALE_FACTOR
	_y /= conf.SCALE_FACTOR
	
	trainer.addData(_x, _y, !evt.shiftKey)
}

function train(){
	if(!isTraining){
		let statsPanel = $('#statsPanel')
		let training
		
		isTraining = true
		
		let randomFactor = $('#randomFactor').val()
		let learningFactor = $('#learningFactor').val()
		let nIterations	= $('#nIterations').val()
		let trainIterations = $('#trainIterations').val()
		let stopWhenDone = $('#stopWhenDone').is(':checked')

		let perceptronRule = $('#perceptronRule').is(':checked')
		let deltaRule = $('#deltaRule').is(':checked')
		
		// createCookie('settings', JSON.stringify({randomFactor, learningFactor, nIterations, trainIterations}))
		
		var trainingResults = {
			'1' : {	'iterations' : Infinity, 'errors' : Infinity, 'reachedAt' : Infinity},
			'2' : {	'iterations' : Infinity, 'errors' : Infinity, 'reachedAt' : Infinity}
		};
		
		(function loop(i){
			if(!isTraining)
				return
			i--
			
			let trainings = [{}]
			
			if(perceptronRule){
				training = trainer.train(randomFactor, learningFactor, nIterations, stopWhenDone, Trainer.PerceptronRule)
				
				let t = trainingResults[1]
				if(training.errors < t.errors 
				|| training.errors == t.errors && training.reachedAt < t.reachedAt)
					trainingResults[1] = training
				trainings.push(trainingResults[1])
			}
			if(deltaRule){
				training = trainer.train(randomFactor, learningFactor, nIterations, stopWhenDone, Trainer.DeltaRule)
				
				let t = trainingResults[2]
				if(training.errors < t.errors 
				|| training.errors == t.errors && training.reachedAt < t.reachedAt)
					trainingResults[2] = training
				trainings.push(trainingResults[2])
			}
		
			let params = ['type', 'errors', 'reachedAt', 'iterations', 'weights']
			let string = '<b>Iterations left</b> - ' + i + '<br>'
			
			string +='<table><tr>'
			_.each(trainings, r => {
				string += '<tr>'
				_.each(params, p => string += '<td> ' + (typeof r[p] === "undefined" ? p : r[p]) + '</td>')
				string += '</tr>'
			})
			string += '</tr></table>'
			
			statsPanel.html(string)
						
			if(0 < i && isTraining){
				setTimeout(() => loop(i), 0)
			}else{
				isTraining = false
			}
		})(trainIterations)
	}
}

function configAddPoint(evt){
	let x = $('#addX').val()
	let y = $('#addY').val()
	
	if(typeof x === 'undefined' || typeof y === 'undefined')
		return
	
	let c = $('#addClass').is(':checked')
	trainer.addData(Number.parseFloat(x), Number.parseFloat(y), c)
	l('add point')
}

function keyDown(evt){
	if(evt.key == "Enter" && !isTraining){
		train()
	}
	if(evt.keyCode === 67){	// c
		if(evt.shiftKey){
			clearSet()
		}else{
			resetCanvas()
		}
	}
	if(evt.key === 'r')
		randomDataset()
	if(evt.key === 'z'){
		trainer.dataset.pop()
		resetCanvas()
	}
}
function getCursorPosition(canvas, evt){
	rect = canvas.getBoundingClientRect();
	x = evt.clientX - rect.left;
	y = evt.clientY - rect.top;
	return {x, y}
}
function exportSet(){
	console.log(JSON.stringify(trainer.dataset))
}
function clearSet(){
	isTraining = false
	trainer.dataset = []
	resetCanvas()
}
function resetCanvas(){
	isTraining = false
	artist.clearCanvas(ctx0)
	artist.clearCanvas(ctx1)
	artist.drawCartesian(ctx0)
	trainer.redraw()
}

function randomDataset(){
	clearSet()
	
	let rand = (randFactor) => Math.random() * randFactor - randFactor/2
	
	let w = conf.CANVAS_WIDTH / conf.SCALE_FACTOR
	let h = conf.CANVAS_HEIGHT / conf.SCALE_FACTOR
	
	for(let i = 0; i < 1000; i++){
		trainer.addData(rand(w), rand(h), rand(1) > 0)
	}
}

$(document).ready(function(){
	console.log('document ready')
	init()
})

function createCookie(name,val) {
	l('createCookie', val)
	document.cookie = (name + "=" + val + "; path=/");
	console.log(document.cookie)
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
