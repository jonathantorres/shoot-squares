var ShootSquares = {};

ShootSquares.Main = new function() {

	var canvas;
	var stage;
	var gametitle;
	var gameinstructions;
	var square;
	var squares;
	var numOfSquaresX;
	var numOfSquaresY;
	var triangle;
	var moveLeft;
	var moveRight;
	var bullet;
	var bullets;
	var scoreText;
	var lifeText;
	var gameScore;
	var playerLife;

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
		numOfSquaresX = 79;
		numOfSquaresY = 2;
		moveLeft = false;
		moveRight = false;
		squares = new Array();
		bullets = new Array();
		gameScore = 0;
		playerLife = 100;
		
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
		//create the score info
		scoreText = new Text('Score: ' + gameScore + 'pts', '10px Arial', '#999');
		scoreText.textAlign = 'left';
		scoreText.x = 5;
		scoreText.y = canvas.height - 5;
		stage.addChild(scoreText);
		
		//create the life info
		lifeText = new Text('Life: ' + playerLife + '%', '10px Arial', '#999');
		lifeText.textAlign = 'left';
		lifeText.x = canvas.width - 55;
		lifeText.y = canvas.height - 5;
		stage.addChild(lifeText);
		
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
		
		//create squares
		for (var x = 0; x < numOfSquaresX; x++) {
			for (var y = 0; y < numOfSquaresY; y++) {
				square = new Shape();
				square.graphics.beginFill('#F00');
				square.graphics.drawRect(-2.5, -2.5, 5, 5);
				square.graphics.endFill();
				square.x = (x * 7) + 2;
				square.y = (y * 7) + 2.5;
				square.isAnimated = false;
				square.name = 'brick: ' + x + ' : ' + y;
				squares.push(square);
				stage.addChild(square);
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
		
		/* Collisions: squares with Bullets */
		if (bullets.length != 0) {
			for (var bullet = 0; bullet < bullets.length; bullet++) {
				for (var square = 0; square < squares.length; square++) {
					var aBullet = bullets[bullet];
					var aSquare = squares[square];
					var dx = aSquare.x - aBullet.x;
					var dy = aSquare.y - aBullet.y;
					var distance = Math.sqrt(dx * dx + dy * dy);
					
					if (distance < 2.5 + 2.5) {
						stage.removeChild(aBullet);
						bullets.splice(bullet, 1);
						
						if (!aSquare.isAnimated) {
							aSquare.isAnimated = true;
						} else {
							stage.removeChild(aSquare);
							squares.splice(square, 1);
							
							gameScore += 5;
							scoreText.text = 'Score: ' + gameScore + 'pts';
						} 
						
						stage.update();
						return;
					}
				}
			}
		}
		
		/* Collisions: squares with triangle */
		if (squares.length != 0) {
			for (var singleSquare = 0; singleSquare < squares.length; singleSquare++) {
				var theSquare = squares[singleSquare];
				var dx = theSquare.x - triangle.x;
				var dy = theSquare.y - triangle.y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < 2.5) {
					//console.log('hit triangle');
					stage.removeChild(theSquare);
					squares.splice(singleSquare, 1);
					
					playerLife -= 5;
					lifeText.text = 'Life: ' + playerLife + '%';
					
					stage.update();
					return;
				}
			}
		}
		
		/* Animate those squares that have been shot down */
		if (squares.length != 0) {
			for (var animSquare = 0; animSquare < squares.length; animSquare++) {
				var animatedSquare = squares[animSquare];
				
				if (animatedSquare.isAnimated) {
					animatedSquare.y += 5;
					
					if (animatedSquare.y > canvas.height) {
						stage.removeChild(animatedSquare);
						squares.splice(animSquare, 1);
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