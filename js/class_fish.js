// classdef.js
//
// Functions:
// - swimRight
// - resize
// - accelerate
// - giveShield
// - drawCD
// - drawLives
// - draw
// - update
// - gotHit

function class_fish(col,xpos,ypos,right,ctx,span) // fish object that one player controls
{
	this.context = ctx;
	
	this.id = fishcount++; // unique id
	this.life = 3;
	this.lifespan = span;
	
	// color
	this.color = col;
	this.lifespan.style.color = this.color;
	this.gradient = this.context.createLinearGradient(0, 0, 0, 30); // from P(0|0) to Q(0|30)
	this.gradient.addColorStop(0, '#ddd'); // light gray
	this.gradient.addColorStop(0.5, this.color.replace(/0/g,'4')); // faded this color
	this.gradient.addColorStop(1, '#222'); // dark grey
	
	// position
	this.height = 30;
	this.width = 40;
	this.x = xpos; //float
	this.y = ypos; //float
	this.bodywidth = 30;
	
	// movement speeds
	this.speed = 0.5; // general speed
	this.xspeed = 0; // Integer: horizontal speed, positive or negative
	this.yspeed = 0; // Integer: upward speed if "jumping"
	
	// states
	this.bShield = false; // shield state
	this.bKeyDown = false; // key state
	this.bKeyUp = false; // key state
	this.bRight = right; // fish orientation
	this.bHit = false; // "punch" comic tag shown
	
	this.horz = 0; // {-1,0,1} -> left, neutral, right
	this.attack = 0; // attack angle in degrees
	this.cooldown = 0; // attack cooldown
	
	// functions
	this.swimRight = function(dir) // dir: true = right, false = left
	{	
		this.horz = -1 + 2 * dir;
			
		if(dir != this.bRight) {
				  if(this.attack) { // don't change direction in attack animation
				  	this.horz = 0;
				  	return;
				  }
				  else this.x += this.width * this.horz; // offset if direction changes
				  this.bRight = dir;
		}
		
	}
	
	this.resize = function(factor) {
		if(this.factor == 1 && this.height >= 48) return false; // too big?
		else if (this.factor == -1 && this.height <= 24) return false;
			
		this.height += 6 * factor;
		this.width += 8 * factor;
		this.bodywidth += 6 * factor;
		return true;
	};
	
	this.accelerate = function(factor) {		
		setTimeout("fish" + this.id + ".speed = 0.5" , 10000); // 10 seconds speed
		this.speed += 0.3 * factor;
		return true;
	};
	
	this.giveShield = function() {
		if(this.bShield) return false;
		this.bShield = true;
		setTimeout("fish" + this.id + ".bShield = false", 5000); // 5 seconds shield
		return true;
	}
	
	this.drawCD = function() {  // cooldown indicator underneath the fish
		var cd = "";
			
		for(var i = this.cooldown; i > 0; i-=10) cd += "\u2022"; // dot
		
		this.context.textAlign = "center";
		this.context.font = 'Bold 12px Sans-Serif';
		this.context.fillStyle = this.color;
		
		if(this.bRight)
			this.context.fillText(cd, this.x-(this.width/2), this.y+this.height+5);
		else
			this.context.fillText(cd, this.x+(this.width/2), this.y+this.height+5);	
	};
	
	this.drawLives = function() {
		this.lifespan.innerHTML = "";
		for(var i = 0; i < this.life; i++) this.lifespan.innerHTML += "&hearts;";
	};
	
	this.draw = function()
	{
		this.context.save(); // save context so that it can be restored after drawing

		this.context.transform(Math.cos(this.attack * (Math.PI/180)),0,0,1, this.x, this.y); // this line turns the this around its y-axis 
																					// depending on the attack angle
		this.context.fillStyle = this.gradient;
		
		this.context.beginPath();
		
		// the this is drawn geometrically so it can be spun around and resized geometrically
		
		if(this.bRight) 
		{
			this.context.moveTo(-this.width, 2);  // fhis tail geometry
			this.context.lineTo(-this.bodywidth+2, this.height/2);
			this.context.lineTo(-this.width, this.height-2);
			this.context.lineTo(-this.width, 2);
			this.context.fill(); // needed?
			this.context.moveTo(-this.bodywidth, (this.height/2)); // fish body geometry
			this.context.bezierCurveTo(-this.bodywidth+1,2, -1,2, 0,(this.height/2));
			this.context.bezierCurveTo(-1,this.height-2, -this.bodywidth+1,this.height-2, -this.bodywidth,(this.height/2));
		} 
		else 
		{
			this.context.moveTo(this.width, 2);
			this.context.lineTo(this.bodywidth-2, this.height/2);
			this.context.lineTo(this.width, this.height-2);
			this.context.lineTo(this.width, 2);
			this.context.fill(); // needed?
			this.context.moveTo(0, (this.height/2));
			this.context.bezierCurveTo(1,2, this.bodywidth-1,2, this.bodywidth,(this.height/2));
			this.context.bezierCurveTo(this.bodywidth-1,this.height-2, 1,this.height-2, 0,(this.height/2));
		}
		
		this.context.fill();
		
		var xoff = -this.width * this.bRight; // if facing right, we have an negative offset
		
		// eyes hit tags and shield
		if(this.life) {
			this.context.drawImage( img[4-this.bRight], xoff, 0, this.width, this.height); // open eye
			if(this.bShield) this.context.drawImage( img[10], xoff-5, -5, this.width+10, this.height+10);
			if(this.bHit) this.context.drawImage( img[8], xoff-10, -5, 60, 40); // punch tag
		}
		else {
			this.context.drawImage( img[6-this.bRight], xoff, 0, this.width, this.height); // dead eye
			if(this.bHit) this.context.drawImage( img[9], xoff-10, -5, 60, 40); // punch tag
		}
	    
	    this.context.restore(); // restore saved context
	    
		if(this.cooldown) this.drawCD();
	};

	this.update = function()
	{
		
		if(!this.life) // dead animation
		{
			this.y-=2;
			if(this.y < -30) endGame();
			
			this.x += Math.sin(this.y * (Math.PI/180));
			return;
		}
		
		// attack
		if (this.cooldown){
			
			if(this.attack) this.attack -= 20; // 20° animation runs smooth	
			
			this.drawCD();
			this.cooldown--;
		}
		
		// accelerate fish when keys pressed
		if(this.horz) {
			if(this.xspeed < 3 && this.xspeed > -3) this.xspeed += parseInt(9 + 3 * this.xspeed) * this.horz;
			if(this.xspeed > -10 && this.xspeed < 10) this.xspeed += this.horz;
		}
			
		// swim to side
		if (this.xspeed != 0) {
			this.x += this.xspeed * this.speed; // MOVE TO SIDE
					
			if(this.x < borderwidth) { // border check
				this.xspeed = 0;
				this.x = borderwidth;
			}
			else if(this.x > width-borderwidth) {
				this.xspeed = 0;
				this.x = width-borderwidth;
			}
			else { // decelerate
				if (this.xspeed < 0) this.xspeed++;
				else this.xspeed--;
			}
			
		}
		
		// swim up
		if(this.yspeed) {
			this.yspeed--;
			
			if(this.yspeed < 4) // third part of "jump": slower sinking
				this.y += (this.yspeed) * 0.1;
			else if(this.yspeed < 7) // second part of "jump": sinking
				this.y -= (this.yspeed-7) * 0.1;
			else // "jumping"
				this.y -= (this.yspeed-7) * (this.speed/3) * 2;
			
			if(this.y < borderwidth) {
				this.y = borderwidth;
				this.yspeed = 0;
			}
		}
		
		// sink passive
		this.y += this.speed * 2;
		// sink active
		if(this.bKeyDown && this.yspeed < 10) // down button pressed and not swimming up
			this.y += this.speed*4;
		
		if(this.y > height-borderwidth-this.height) this.y = height-borderwidth-this.height; // border check

	};
	
	this.gotHit = function() {
		if(this.bShield) return;
		this.life -= 1;
		this.drawLives();
		this.bHit = true;
		setTimeout("fish" + this.id + ".bHit = false", 500); // 0.5 seconds hit animation, workaround
		if(!this.life) {
			this.cooldown = 0;
			loser = this.id;
		}
	};
}
