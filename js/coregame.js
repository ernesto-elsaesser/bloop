
var bStarted, bPaused, bMenuDrawn, // Boolean: Flags to control the game
	width, height, // Integer: canvas dimensions
	borderwidth, // Integer: how wide is the border?
	menux, menuy, // Integer: menu position
	fish1, fish2, // class_fish: players, later in container
	fishcount, // Integer: number of fish, only used for fish id's right now
	thebox, // class_box: the special item box
	loser, // Integer: saves the fish id of the loser
	tick, // Double: Degree counter for moving background
	ms, // Integer: interval of the update event in milliseconds
	img, // Array of PNG images
	imgPaths,
	imgCount,
	bloopsound, slapsound; // sounds


function preloadImgs() {

	img[imgCount] = new Image();
	
	if(imgCount < img.length - 1) img[imgCount].onload = preloadImgs;
	else img[imgCount].onload = startLoop;
	  
	img[imgCount].src = imgPaths[imgCount]+ "?" + Math.random(); // no clue why ...
	imgCount++;
}

function init(){
	
	img = new Array(11);
	
	imgPaths = ['img/menu.png', // 0 - menu
		'img/bubbles1.png',    // 1 - background
		'img/bubbles2.png',    // 2 - background
		'img/eyeright.png',    // 3 - player
		'img/eyeleft.png',    // 4 - player
		'img/deadeyeright.png',	// 5 - player
		'img/deadeyeleft.png',    // 6 - player
		'img/chest.png',    // 7 - treasure chest
		'img/punch.png',    // 8 - tag
		'img/urgh.png',    // 9 - tag
		'img/shield.png'	// 10 - tag
			];
	
	imgCount = 0;

	bloopsound = new Audio();
	bloopsound.src = "audio/bloop1.ogg";
	bloopsound.volume = 0.5;
	slapsound = new Audio();
	slapsound.src = "audio/swoosh.ogg";
	
	var canv = document.getElementById('fishcanv');
	ctx = canv.getContext('2d');
	
	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	
	width = canv.width;
	height = canv.height;
	
	menux = (width-380)/2;
	menuy = (height-300)/2;
	
	// config
	borderwidth = 12;
	ms = 20;
	
	bStarted = false; // game starts only when ENTER is pressed
	bMenuDrawn = false; // -> menu has to be drawn
	bPaused = true; // -> menu will be drawn
	
	preloadImgs();
}

function startLoop() {
	self.setInterval("updateGame()",ms);
}

function startGame() {
	
	// init background rotation
	tick = 180.0;
	
	fishcount = 1;
	
	// red fish starts in the bottom left corner facing right
	fish1 = new class_fish("#f00", 80, height-50, true, ctx, document.getElementById("life1")); 
	// blue fish starts in the bottom right corner facing left
	fish2 = new class_fish("#00f", width-80, height-50, false, ctx, document.getElementById("life2"));
	
	// the box
	thebox = new class_box(ctx);
	setTimeout("thebox.bActive = true", 5000); // in 5 seconds the first box will spawn
	
	loser = 0;
	
	fish1.drawLives();
	fish2.drawLives();

	bStarted = true;
}

function updateGame() {
	
	if(bPaused) {
		if(!bMenuDrawn) drawMenu();
		return;
	}
	
	// updating
	fish1.update();
	fish2.update();
	thebox.update();
	
	// collision testing
	if(fish1.attack == 180) {  // angle of attack animation when it hits
		checkCollision(fish1, fish2);
		checkCollisionBox(fish1, thebox);
	}
	if(fish2.attack == 180) {
		checkCollision(fish2, fish1);
		checkCollisionBox(fish2, thebox);
	}
	
	// drawing
	drawBG();
	
	thebox.draw();
	fish1.draw();
	fish2.draw();
	
}

function endGame()
{
	bStarted = false;
	bPaused = true;
}

function checkCollision(fisha, fishb) {
	if(!fishb.bHit &&  fishb.y > fisha.y - fishb.height && fishb.y < fisha.y + fisha.height) { // height collision
//		if((fisha.bRight && fishb.bRight && fishb.x > fisha.x + fisha.bodywidth && fishb.x < fisha.x + fisha.width + fishb.width) || // width collision ><a> ><b>
//			(!fisha.bRight && fishb.bRight &&  fishb.x > fisha.x - 40 && fishb.x < fisha.x + 10) || // ><b> <a><
//			(fisha.bRight && !fishb.bRight &&  fishb.x > fisha.x - 10 && fishb.x < fisha.x + 40) || // ><a> <b><
//			(!fisha.bRight && !fishb.bRight &&  fishb.x > fisha.x - 80 && fishb.x < fisha.x - 30)) { // <b>< <a><
//			fishb.gotHit();
//		}
		
		switch (fisha.bRight << 1 | fishb.bRight) // height collision
		{
		case 0: // <b>< <a><
			if(fishb.x > fisha.x - fisha.width - fishb.width && fishb.x < fisha.x - fisha.width) fishb.gotHit();
			break;
		case 1: // ><b> <a><
			if(fishb.x > fisha.x - fisha.width && fishb.x < fisha.x - fisha.bodywidth + fishb.width) fishb.gotHit();
			break;
		case 2: // ><a> <b><
			if(fishb.x > fisha.x +fisha.bodywidth - fishb.width && fishb.x < fisha.x + fisha.width) fishb.gotHit();
			break;
		case 3: // ><a> ><b>
			if(fishb.x > fisha.x + fisha.bodywidth && fishb.x < fisha.x + fisha.width + fishb.width) fishb.gotHit();
			break;
		}
	}
}

function checkCollisionBox(fish, box) {
	if(box.y > fish.y - box.sidelength && box.y < fish.y + box.sidelength) { // height collision
		if((fish.bRight && box.x > fish.x + fish.bodywidth - box.sidelength && box.x < fish.x + fish.width) || // width collision
			(!fish.bRight && box.x > fish.x - fish.width - box.sidelength && box.x < fish.x - fish.bodywidth)) {
			box.gotHit();
			boxEvent(fish);
		}
	}
}

function boxEvent(fish)
{
	var event = Math.floor(Math.random() * 5);
	var enemy;
//	var enemyid;
//	do {
//		enemyid = 1 + Math.floor(Math.random() * fishcount);
//	} while (enemyid == fish.id)
		
	if(fish.id == 1) enemy = fish2;
	else enemy = fish1;
	
	// over time!!!
	ctx.fillStyle = "#0082ff";
	ctx.textAlign = "center";
	ctx.font = 'Bold 30px Sans-Serif';

	switch(event) {
	case 0:
		fish.resize(1);
		ctx.fillText("PLAYER " + fish.id + " GREW", width/2, height/2);
		break;
	case 1:
		enemy.resize(-1);
		ctx.fillText("PLAYER " + enemy.id + " SHRANK", width/2, height/2);
		break;
	case 2:
		fish.accelerate(1);
		break;
	case 3:
		enemy.accelerate(-1);
		break;
	case 4:
		fish.giveShield();
		break;
	}
}
