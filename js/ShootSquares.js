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
	var gameState;
	var playerLife;
	var gameOverText;
	var restartGameText;
	var finalScoreText;

	this.init = function() {
		canvas = document.getElementById('main');
		stage = new Stage(canvas);
		
		//settings for stage
		stage.mouseEventsEnabled = true;
		Ticker.useRAF = true;
		Ticker.setFPS(30);
		Ticker.addListener(stage);
		
		gameState = 'menu'
		
		$(window).resize(onResizeWindow);
		stage.tick = onStageTick;
		
		startMenu();
		
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
			gametitle = null;
			gameinstructions = null;
			stage.update();
			
			startGame();
			$(document).unbind('keyup.starmenu');
		}
	}
	
	function startGame() {
		//some game settings
		numOfSquaresX = 79;
		numOfSquaresY = 2;
		moveLeft = false;
		moveRight = false;
		squares = new Array();
		bullets = new Array();
		gameScore = 0;
		playerLife = 100;
		
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
		triangle.width = 20;
		triangle.height = 50;
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
				square.width = 5;
				square.height = 5;
				square.isAnimated = false;
				square.name = 'brick: ' + x + ' : ' + y;
				squares.push(square);
				stage.addChild(square);
			}
		}
		
		//change state
		gameState = 'play';
		
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
	
	function gameOver() {
		stage.removeChild(triangle, scoreText, lifeText);
		
		/* remove any remaining squares */
		if (squares.length != 0) {
			for (var i = squares.length; i >= 0; i--) {
				stage.removeChild(squares[i]);
				squares.splice(i, 1);
			}
		}
		
		/* remove any remaining bullets */
		if (bullets.length != 0) {
			for (var j = bullets.length; j >= 0; j--) {
				stage.removeChild(bullets[j]);
				bullets.splice(j, 1);
			}
		}
		
		gameState = 'menu';
		
		//clean up objects and events
		triangle = null;
		scoreText = null;
		lifeText = null;
		squares = null;
		bullets = null;
		$(document).unbind('keydown.triangle', keyDownTriangle);
		$(document).unbind('keyup.triangle', keyUpTriangle);
		
		gameOverText = new Text('Game Over!','20px Arial', '#FFF');
		gameOverText.textAlign = 'center';
		gameOverText.x = canvas.width * 0.5;
		gameOverText.y = canvas.height * 0.5 - 20;
		
		finalScoreText = new Text('Your score: ' + gameScore + 'pts', '14px Arial', '#FFF');
		finalScoreText.textAlign = 'center';
		finalScoreText.x = canvas.width * 0.5;
		finalScoreText.y = canvas.height * 0.5 + 3;
		
		restartGameText = new Text('Press spacebar to restart the game', '10px Arial', '#999');
		restartGameText.textAlign = 'center';
		restartGameText.x = canvas.width * 0.5;
		restartGameText.y = canvas.height * 0.5 + 20;
		
		stage.addChild(gameOverText, finalScoreText, restartGameText);
		
		$(document).bind('keyup.restart', restartGame);
		
		stage.update();
	}
	
	function restartGame(e) {
		if (e.keyCode == 32) {
			stage.removeChild(gameOverText, finalScoreText, restartGameText);
			gameOverText = null;
			finalScoreText = null;
			restartGameText = null;
			stage.update();
			
			startGame();
			$(document).unbind('keyup.restart', restartGame);
		}
	}
	
	function onStageTick(e) {
		if (gameState == 'play') {
			/* Life reaches 0% or squares are exploded, the game ends */
			if (playerLife == 0 || squares.length == 0) {
				gameOver();
				return;
			}
			
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
			
			/* Collisions: squares with the triangle */
			if (squares.length != 0) {
				for (var singleSquare = 0; singleSquare < squares.length; singleSquare++) {
					var theSquare = squares[singleSquare];
					
					if (theSquare.y - (theSquare.height * 0.5) > triangle.y) {
						if (theSquare.x <= triangle.x + (triangle.width * 0.5) && theSquare.x >= triangle.x - (triangle.width * 0.5)) {
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