// drawing.js
//
// Events:
// - keyDown
// - keyUp

function keyDown(event) {
	
	if( !bPaused ) {
		switch (event.keyCode)
		{ 
		  case 13: // Enter
			bPaused = true;
			break;
			
		  // KEYS FISH1
		  case 16: // attack fish1: shift
			  if(fish1.life && !fish1.cooldown) {
				  fish1.attack = 360; // full circle
				  fish1.cooldown = 100;
				  slapsound.play();
			  }
			  break;
		  case 65: // left fish1: a
			  fish1.swimRight(false);
			  break;
		  case 87: // up fish1: w
			  if(fish1.yspeed < 20 && !fish1.bKeyUp) {
				  fish1.yspeed = 30;
				  fish1.bKeyUp = true;
				  bloopsound.play();
			  }
			  break;		
		  case 68: // right fish1: d
			  fish1.swimRight(true);
			  break;
		  case 83: // down fish1: s
			  fish1.bKeyDown = true;
			  break;
			  
		  // KEYS FISH2  
		  case 32: // attack fish2: space
				  if(fish2.life && !fish2.cooldown) {
					  fish2.attack = 360;// full circle
					  fish2.cooldown = 2000/ms;
					  slapsound.play();
				  }
				  break;  
		  case 74: // left fish2: j
			  fish2.swimRight(false);
			  break;
		  case 73: // up fish2: i
			  if(fish2.yspeed < 20 && !fish2.bKeyUp) {
				  fish2.yspeed = 30;
			  	  fish2.bKeyUp = true;
			  	  bloopsound.play();
		  	  }
			  break;		
		  case 76: // right fish2: l
			  fish2.swimRight(true);
			  break;
		  case 75: // down fish2: k
			  fish2.bKeyDown = true;
			  break;
		}
	}
	else if( event.keyCode == 13) {
	    if(!bStarted) startGame();
		bPaused = false;
		bMenuDrawn = false;
	}
}

function keyUp(event) {
	
	switch (event.keyCode)
	{ 
	  case 65: // fish1 left: a
		  if(fish1.horz == -1) fish1.horz = 0;
		  break;	
	  case 68: // fish1 right: d
		  if(fish1.horz == 1) fish1.horz = 0;
		  break;
	  case 83: // fish1 down: s
		  fish1.bKeyDown = false;
		  break;
	  case 87: // fish1 up: w
		  fish1.bKeyUp = false;
		  break;	
		  
	  case 74: // fish2 left: j
		  if(fish2.horz == -1) fish2.horz = 0;
		  break;
	  case 73: // fish2 up: i
		  fish2.bKeyUp = false;
		  break;		
	  case 76: // fish2 right: l
		  if(fish2.horz == 1) fish2.horz = 0;
		  break;
	  case 75: // fish2 down: k
		  fish2.bKeyDown = false;
		  break;
	}

}

