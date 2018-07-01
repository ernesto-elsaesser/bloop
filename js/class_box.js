// class_box.js
//
// Functions:
// - draw
// - update
// - gotHit


function class_box(ctx) // the treasure chest that contains special items
{	
	this.sidelength = 30;
	this.context = ctx;
	
	//position
	this.x = (borderwidth+this.sidelength) + Math.floor(Math.random()*(width-(borderwidth+(2*this.sidelength))+1));
	this.y = -this.sidelength;
	this.lastx = 0;
	this.lasty = 0;

	this.bActive = false;
	this.bHit = false;
	
	this.reset = function() {
		this.lastx = this.x;
		this.lasty = this.y;
		this.x = (borderwidth+this.sidelength) + Math.floor(Math.random()*(width-(borderwidth+(2*this.sidelength))+1));
		this.y = -this.sidelength;
		this.bActive = false;
		setTimeout("thebox.bActive = true", 10000); // next box will spawn in 10 seconds
	};
		
	this.draw = function() {
		if(this.bHit) this.context.drawImage(img[8], this.lastx-15, this.lasty-8, 60, 40);
		else if(this.bActive) this.context.drawImage(img[7], this.x, this.y, this.sidelength, this.sidelength);
	};
	
	this.update = function() {
		
		if(!this.bActive) return;
		
		this.y++;
		this.x += Math.sin(this.y * (Math.PI/180)) / 4;
		
		if(this.y > 400) this.reset();
	};
		
	this.gotHit = function() {
		this.bActive = false;
		this.bHit = true;
		this.reset();
		setTimeout("thebox.bHit = false", 1000); // 1 second hit animation
		setTimeout("thebox.bActive = true", 10000); // in 10 seconds the next box will spawn
	};
}