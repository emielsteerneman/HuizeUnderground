class Artist {
	constructor(ctxs = {}){
		this.ctxs = ctxs
	}
	
	drawCartesian(ctx, strokeColor = "#fff"){
		let ox = conf.OFFSET_X; 
		let oy = conf.OFFSET_Y;
		let step = conf.SCALE_FACTOR
		let w = conf.CANVAS_WIDTH
		let h = conf.CANVAS_HEIGHT
		
		let steps_w = Math.ceil((w / 2) / step)
		let steps_h = Math.ceil((h / 2) / step)
		
		ctx.strokeStyle = strokeColor
		
		ctx.beginPath()
		ctx.moveTo(2*ox, oy)
		ctx.lineTo(0   , oy)
		ctx.moveTo(ox  , 2*oy)
		ctx.lineTo(ox  , 0)
		ctx.closePath();
		ctx.stroke()
		
		let x = -steps_w * step + ox
		while(x < w){
			ctx.beginPath()
			ctx.moveTo(x, oy + 6)
			ctx.lineTo(x, oy -6)
			ctx.closePath()
			ctx.stroke()
			x += step
		}
		
		let y = -steps_h * step + oy
		while(y < h){
			ctx.beginPath()
			ctx.moveTo(ox + 6, y)
			ctx.lineTo(ox - 6, y)
			ctx.closePath()
			ctx.stroke()
			y += step
		}
		
	}
	
	drawPlus(x, y, ctx){
		let lineSize = 6 / conf.SCALE_FACTOR
		this.drawLine(x-lineSize, y, x+lineSize, y, '#0f0', ctx)
		this.drawLine(x, y-lineSize, x, y+lineSize, '#0f0', ctx)
	}
	
	drawMinus(x, y, ctx){
		let lineSize = 6 / conf.SCALE_FACTOR
		this.drawLine(x-lineSize, y, x+lineSize, y, '#f00', ctx)
	}
	
	drawLine(x1, y1, x2, y2, strokeColor = "#fff", ctx){
		x1 *= conf.SCALE_FACTOR
		y1 *= conf.SCALE_FACTOR
		x2 *= conf.SCALE_FACTOR
		y2 *= conf.SCALE_FACTOR
		
		let ox = conf.OFFSET_X;
		let oy = conf.OFFSET_Y;
		
		ctx.beginPath()
		ctx.moveTo(x1 + ox, -y1 + oy)
		ctx.lineTo(x2 + ox, -y2 + oy)
		ctx.closePath();
		
		ctx.strokeStyle = strokeColor
		ctx.stroke()
	}
	
	clearCanvas(ctx){
		ctx.clearRect(0, 0, conf.CANVAS_WIDTH, conf.CANVAS_HEIGHT)
	}
}