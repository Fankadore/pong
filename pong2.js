/** Object-oriented Pong **/
/** Ruaidhri MacKenzie - 2018 **/

// Classes
class Ball {
	constructor(x, y) {
		this.width = 10;
		this.height = 10;
		this.x = x - (this.width / 2);
		this.y = y - (this.height / 2);
		this.velX = 0;
		this.velY = 0;
	}
	
	setInMotion() {
		do {
			this.velX = (Math.floor(Math.random() * 3) - 1) * 2;
		}
		while (this.velX === 0);

		do {
			this.velY = ((Math.random() * 3) - 1) * 2;
		}
		while (this.velY > -0.5 && this.velY < 0.5);
	}

	update() {
		this.x += this.velX;
		this.y += this.velY;
	}
	
	getPack() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}
}

class Paddle {
	constructor(x, y) {
		this.width = 10;
		this.height = 75;
		this.x = x - (this.width / 2);
		this.y = y - (this.height / 2);
		this.speed = 2;
		this.pressingUp = false;
		this.pressingDown = false;
	}

	update() {
		if (this.pressingUp) {
			this.y -= this.speed;
		}
		else if (this.pressingDown) {
			this.y += this.speed;
		}
	}
	
	getPack() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}
}

class Stage {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.score = [0, 0];
		this.message = 'PONG!';
		this.paused = true;
		this.ball = new Ball(this.width / 2, this.height / 2);
		this.paddles = [
			new Paddle(30, this.height / 2),
			new Paddle(this.width - 30, this.height / 2)
		];

		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);

		window.addEventListener('keydown', (e) => {
			//console.log(e.keyCode);
			if (e.keyCode === 87) {				// W
				this.paddles[0].pressingUp = true;
			}
			else if (e.keyCode === 83) {	// S
				this.paddles[0].pressingDown = true;
			}
			else if (e.keyCode === 38) {	// Up Arrow
				this.paddles[1].pressingUp = true;
			}
			else if (e.keyCode === 40) {	// Down Arrow
				this.paddles[1].pressingDown = true;
			}
			else if (e.keyCode === 32) {	// Space Bar
				if (stage.paused) {
					this.paused = false;
					this.message = "";
				}
				else {
					this.paused = true;
					this.message = "Paused";
				}
			}
		});
		window.addEventListener('keyup', (e) => {
			if (e.keyCode === 87) {				// W
				this.paddles[0].pressingUp = false;
			}
			else if (e.keyCode === 83) {	// S
				this.paddles[0].pressingDown = false;
			}
			else if (e.keyCode === 38) {	// Up Arrow
				this.paddles[1].pressingUp = false;
			}
			else if (e.keyCode === 40) {	// Down Arrow
				this.paddles[1].pressingDown = false;
			}
		});

		this.reset();
		this.gameLoop = window.setInterval(this.update.bind(this), 1000 / 60);
	}

	reset() {
		this.paddles.forEach((paddle) => {
			paddle.y = (this.height / 2) - (paddle.height / 2);
		});
		this.ball.x = (this.width / 2) - (this.ball.width / 2);
		this.ball.y = (this.height / 2) - (this.ball.height / 2);
		this.ball.setInMotion();
	}

	scorePoint(playerId) {
		this.score[playerId]++;
		
		// Check for win
		if (this.score[playerId] >= 3) {
			this.paused = true;
			this.message = `Player ${playerId + 1} Wins!`;
			this.score = [0, 0];
		}
		
		this.reset();
	}

	checkCollisions() {
		this.paddles.forEach((paddle) => {
			// Check paddles in bounds
			if (paddle.y < 0) {
				paddle.y = 0;
			}
			else if (paddle.y + paddle.height > this.height) {
				paddle.y = this.height - paddle.height;
			}
			// Ball bounces off paddles
			if (this.ball.y + this.ball.height >= paddle.y && this.ball.y < paddle.y + paddle.height) {
				if ((this.ball.x > paddle.x && this.ball.x <= paddle.x + paddle.width) || (this.ball.x < paddle.x && this.ball.x + this.ball.width >= paddle.x)) {
					this.ball.velX *= -1;
					if (this.ball.velX < 12) {
						this.ball.velX *= 1.05;
					}
				}
			}
		});

		// Ball bounces off top and bottom edges
		if (this.ball.y <= 0 || this.ball.y + this.ball.height > this.height) {
			this.ball.velY *= -1;
		}
	
		// Player 1 scores when ball touches right edge
		if (this.ball.x + this.ball.width > this.width) {
			this.scorePoint(0);
		}
	
		// Player 2 scores when ball touches left edge
		if (this.ball.x <= 0) {
			this.scorePoint(1);
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = '#ffffff';
		this.ctx.textAlign = 'center';

		if (this.paused) {
			if (!this.canvas.classList.contains("paused")) {
				this.canvas.classList.add("paused");
			}

			// Display Menu Text
			this.ctx.font = '40px Arial';
			this.ctx.fillText(this.message, this.width / 2, (this.height / 2) - 50);
			this.ctx.font = '30px Arial';
			this.ctx.fillText("Press Space to Start", this.width / 2, (this.height / 2) + 10);
			this.ctx.font = '18px Arial';
			this.ctx.fillText("Pong by Ruaidhri MacKenzie", this.width / 2, (this.height / 2) + 80);
		}
		else {
			if (this.canvas.classList.contains("paused")) {
				this.canvas.classList.remove("paused");
			}

			// Display Score
			this.ctx.fillStyle = '#000000';
			this.ctx.font = "30px Arial";
			this.ctx.fillText(this.score.join(' - '), this.width / 2, 30);

			// Draw Ball
			let ballData = this.ball.getPack();
			this.ctx.fillRect(ballData.x, ballData.y, ballData.width, ballData.height);

			// Draw Paddles
			this.paddles.forEach((paddle) => {
				let paddleData = paddle.getPack();
				this.ctx.fillRect(paddleData.x, paddleData.y, paddleData.width, paddleData.height);
			});
		}
	}

	update() {
		if (!this.paused) {
			this.ball.update();
			this.paddles.forEach((paddle) => {
				paddle.update();
			});
			this.checkCollisions();
		}
		this.draw();
	}
}

// Initilize
const stage = new Stage(400, 300);
