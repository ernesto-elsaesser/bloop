// drawing.js
//
// Functions:
// - drawBG
// - drawMenu

function drawBG() {
	
	var rad = tick * (Math.PI/180); // radian from degrees
	
	//ctx.drawImage( img[1], 0, 0, width, height);
	ctx.clearRect(0,0, width, height);
	ctx.drawImage( img[1], Math.sin(rad) * 30, Math.cos(rad) * 30, width, height); // 2d circle movement
	ctx.drawImage( img[2], Math.cos(rad) * 15, Math.sin(rad) * 15, width, height);
	
	tick += 0.2;
	if(tick == 360.0) tick = 0.0; // against overflow
}

function drawMenu() {
	
    ctx.drawImage( img[0], menux, menuy); // center 400x300 image
	
	ctx.fillStyle = "#0082ff";
	ctx.textAlign = "center";
	
	
	
	if(!bStarted) {
		
		if (loser) {
			ctx.font = 'Bold 30px Sans-Serif';
			ctx.fillText("PLAYER " + loser + " LOST", width/2, menuy + 70);
		}
		else {
			ctx.font = 'Bold 30px Sans-Serif';
			ctx.fillText('CONTROLS', width/2, menuy + 70);
		}
		
		ctx.font = 'Bold 20px Sans-Serif';
		ctx.fillText('Press ENTER to play', width/2, menuy + 250);
	
	}
	else {
		ctx.font = 'Bold 40px Sans-Serif';
		ctx.fillText('PAUSE', width/2, menuy + 70);
		ctx.font = 'Bold 20px Sans-Serif';
		ctx.fillText('Press ENTER to continue', width/2, menuy + 250);
	}
	
	ctx.font = 'Bold 16px Sans-Serif';
	ctx.fillStyle = "#f55";
	ctx.fillText('Player 1:   W - A - S - D - SHIFT', width/2, menuy + 140);
	ctx.fillStyle = "#55f";
	ctx.fillText('Player 2:    I - J - K - L - SPACE', width/2, menuy + 170);
	
	bMenuDrawn = true;
}