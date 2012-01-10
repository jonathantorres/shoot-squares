var ShootSquares = {};

ShootSquares.Main = new function() {

	var canvas;
	var stage;
	var gametitle;
	var gameinstructions;
	var brick;
	var bricks;
	var numOfBricksX;
	var numOfBricksY;
	var triangle;
	var moveLeft;
	var moveRight;
	var bullet;
	var bullets;

	this.init = function() {
		canvas = document.getElementById('main');
		stage = new Stage(canvas);
		
		//settings for stage
		stage.mouseEventsEnabled = true;
		Ticker.useRAF = true;
		Ticker.setFPS(30);
		Ticker.addListener(stage);
		
		//startMenu();
		
		//other game settings
		numOfBricksX = 79;
		numOfBricksY = 2;
		moveLeft = false;
		moveRight = false;
		bricks = new Array();
		bullets = new Array();
		
		$(window).resize(onResizeWindow);
		stage.tick = onStageTick;
		
		startGame();
		
		stage.update();
	}
	
	function startMenu() {
		//start menu
		gametitle = new Text('Shoot Squares Game','20px Arial', '#FFF');
		gametitle.textAlign = 'center';
		gametitle.x = canvas.width * 0.5;
		gametitle.y = canvas.height * 0.5;
		
		gameinstructions = new Text('Press spacebar to get started', '10px Arial', '#999');
		gameinstructions.textAlign = 'center';
		gameinstructions.x = canvas.width * 0.5;
		gameinstructions.y =  canvas.height * 0.5 + 20;
		
		stage.addChild(gametitle);
		stage.addChild(gameinstructions);
		
		$(document).bind('keyup.starmenu', onDocumentKeyUp);
	}
	
	function onDocumentKeyUp(e) {
		if (e.keyCode == 32) {
			stage.removeChild(gametitle, gameinstructions);
			stage.update();
			
			startGame();
			$(document).unbind('keyup.starmenu');
		}
	}
	
	function startGame() {
		//create triangle
		triangle = new Shape();
		triangle.graphics.beginFill('#FFF');
		triangle.graphics.moveTo(0, 0);
		triangle.graphics.lineTo(10, 50);
		triangle.graphics.lineTo(-10, 50);
		triangle.graphics.lineTo(0, 0);
		triangle.x = canvas.width * 0.5;
		triangle.y = canvas.height - 50;
		stage.addChild(triangle);
		
		//create bricks
		for (var x = 0; x < numOfBricksX; x++) {
			for (var y = 0; y < numOfBricksY; y++) {
				brick = new Shape();
				brick.graphics.beginFill('#F00');
				brick.graphics.drawRect(-2.5, -2.5, 5, 5);
				brick.graphics.endFill();
				brick.x = (x * 7) + 2;
				brick.y = (y * 7) + 2.5;
				brick.isAnimated = false;
				brick.name = 'brick: ' + x + ' : ' + y;
				bricks.push(brick);
				stage.addChild(brick);
			}
		}
		
		//keyboard events
		$(document).bind('keydown.triangle', keyDownTriangle);
		$(document).bind('keyup.triangle', keyUpTriangle);
		
		stage.update();
	}
	
	function keyUpTriangle(e) {
		//stop moving left
		if (e.keyCode == 37) {
			moveLeft = false;
		} 
		
		//stop moving right
		else if (e.keyCode == 39) {
			moveRight = false;
		}
		
		//shoot!
		if (e.keyCode == 32) {
			//console.log('shoot!');
			bullet = new Shape();
			bullet.graphics.beginFill('#FFF');
			bullet.graphics.drawRect(-2.5, -2.5, 5, 5);
			bullet.graphics.endFill();
			bullet.x = triangle.x;
			bullet.y = triangle.y;
			bullets.push(bullet);
			stage.addChild(bullet);
			
			stage.update();
		}
	}
	
	function keyDownTriangle(e) {
		//move left
		if (e.keyCode == 37) {
			moveLeft = true;
		}
		
		//move right
		else if (e.keyCode == 39) {
			moveRight = true;
		}
	}
	
	function onStageTick(e) {
		/* Handle triangle movement */
		if (moveRight) {
			if (triangle.x >= canvas.width -5) {
				triangle.x = canvas.width -5;
			} else {
				triangle.x += 5;
			}
			
		} else if (moveLeft) {
			if (triangle.x <= 5) {
				triangle.x = 5;
			} else {
				triangle.x -= 5;
			}
		}
		
		/* Handle the shooting animation */
		if (bullets.length != 0) {
			for (var i = 0; i < bullets.length; i++) {
				var currentBullet = bullets[i];
				currentBullet.y -= 5;
				
				if (currentBullet.y < 0) {
					stage.removeChild(currentBullet);
					bullets.splice(i, 1);
				}
			}
		}
		
		/* Collisions: bricks with Bullets */
		if (bullets.length != 0) {
			for (var bullet = 0; bullet < bullets.length; bullet++) {
				for (var brick = 0; brick < bricks.length; brick++) {
					var aBullet = bullets[bullet];
					var aBrick = bricks[brick];
					var dx = aBrick.x - aBullet.x;
					var dy = aBrick.y - aBullet.y;
					var distance = Math.sqrt(dx * dx + dy * dy);
					
					if (distance < 2.5 + 2.5) {
						stage.removeChild(aBullet);
						bullets.splice(bullet, 1);
						
						if (!aBrick.isAnimated) {
							aBrick.isAnimated = true;
						} else {
							stage.removeChild(aBrick);
							bricks.splice(brick, 1);
						} 
						
						stage.update();
						return;
					}
				}
			}
		}
		
		/* Collisions: bricks with triangle */
		if (bricks.length != 0) {
			for (var singleBrick = 0; singleBrick < bricks.length; singleBrick++) {
				var theBrick = bricks[singleBrick];
				var dx = theBrick.x - triangle.x;
				var dy = theBrick.y - triangle.y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < 2.5) {
					//console.log('hit triangle');
					stage.removeChild(theBrick);
					bricks.splice(singleBrick, 1);
					
					stage.update();
					return;
				}
			}
		}
		
		/* Animate those bricks that have been shot down */
		if (bricks.length != 0) {
			for (var animBrick = 0; animBrick < bricks.length; animBrick++) {
				var animatedBrick = bricks[animBrick];
				
				if (animatedBrick.isAnimated) {
					animatedBrick.y += 5;
					
					if (animatedBrick.y > canvas.height) {
						stage.removeChild(animatedBrick);
						bricks.splice(animBrick, 1);
					}
				}
			}
		}
		
		stage.update();
	}
	
	function onResizeWindow(e) {
		//
	}
}

/* 
 * Start Project
 */
$(document).ready(function() {
	if (Modernizr.canvas) {
		ShootSquares.Main.init();
	}
});