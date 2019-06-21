/** Procedural Pong **/
/** Ruaidhri MacKenzie - 2018 **/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Structures
const stage = {
	width: 400,
	height: 300,
	score1: 0,
	score2: 0,
	message: 'PONG!',
	paused: true
};

const ball = {
	width: 10,
	height: 10,
	x: 0,
	y: 0,
	velX: 0,
	velY: 0
};

function Paddle() {
	this.width = 10;
	this.height = 75;
	this.x = 0;
	this.y = 0;
	this.speed = 2;
	this.pressingUp = false;
	this.pressingDown = false;
}

const paddles = [
	new Paddle(),
	new Paddle()
];

// Sub-routines
function resetStage() {
	// Reset positions
	ball.x = stage.width / 2;
	ball.y = stage.height / 2;
	paddles[0].x = 30;
	paddles[0].y = (stage.height / 2) - (paddles[0].height / 2);
	paddles[1].x = stage.width - 30;
	paddles[1].y = (stage.height / 2) - (paddles[1].height / 2);

	// Set ball in motion
	do {
		ball.velX = (Math.floor(Math.random() * 3) - 1) * 2;
	}
	while (ball.velX === 0);

	do {
		ball.velY = ((Math.random() * 3) - 1) * 2;
	}
	while (ball.velY > -0.5 && ball.velY < 0.5);
}

function updatePositions() {
	// Update paddles
	paddles.forEach((paddle) => {
		// Check inputs
		if (paddle.pressingUp) {
			paddle.y -= paddle.speed;
		}
		else if (paddle.pressingDown) {
			paddle.y += paddle.speed;
		}

		// Check paddles in bounds
		if (paddle.y < 0) {
			paddle.y = 0;
		}
		else if (paddle.y + paddle.height > stage.height) {
			paddle.y = stage.height - paddle.height;
		}
	});

	// Update ball
	ball.x += ball.velX;
	ball.y += ball.velY;
	
	// Ball bounces off paddles
	paddles.forEach((paddle) => {
		if (ball.y + ball.height >= paddle.y && ball.y < paddle.y + paddle.height) {
			if ((ball.x > paddle.x && ball.x <= paddle.x + paddle.width) || (ball.x < paddle.x && ball.x + ball.width >= paddle.x)) {
				ball.velX *= -1;
				if (ball.velX < 12) {
					ball.velX *= 1.05;
				}
			}
		}
	});

	// Ball bounces off top and bottom edges
	if (ball.y <= 0 || ball.y + ball.height > stage.height) {
		ball.velY *= -1;
	}

	// Player 1 scores when ball touches right edge
	if (ball.x + ball.width > stage.width) {
		stage.score1++;
		if (stage.score1 >= 3) {
			stage.paused = true;
			stage.message = "Player 1 Wins!";
			stage.score1 = 0;
			stage.score2 = 0;
		}
		resetStage();
	}

	// Player 2 scores when ball touches left edge
	if (ball.x < 0) {
		stage.score2++;
		if (stage.score2 >= 3) {
			stage.paused = true;
			stage.message = "Player 2 Wins!";
			stage.score1 = 0;
			stage.score2 = 0;
		}
		resetStage();
	}
}

function draw() {
	ctx.clearRect(0, 0, stage.width, stage.height);
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';

	if (stage.paused) {
		if (!canvas.classList.contains("paused")) {
			canvas.classList.add("paused");
		}
		ctx.font = '40px Arial';
		ctx.fillText(stage.message, stage.width / 2, (stage.height / 2) - 50);
		ctx.font = '30px Arial';
		ctx.fillText("Press Space to Start", stage.width / 2, (stage.height / 2) + 10);
		ctx.font = '18px Arial';
		ctx.fillText("Pong by Ruaidhri MacKenzie", stage.width / 2, (stage.height / 2) + 80);
	}
	else {
		if (canvas.classList.contains("paused")) {
			canvas.classList.remove("paused");
		}
		ctx.fillStyle = '#000000';
		ctx.font = "30px Arial";
		ctx.fillText(`${stage.score1} - ${stage.score2}`, stage.width / 2, 30);

		// Draw Paddles
		paddles.forEach((paddle) => {
			ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
		});

		// Draw Ball
		ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
	}
}

function update() {
	if (!stage.paused) {
		updatePositions();
	}

	draw();
}

// Main Routine
canvas.setAttribute('width', stage.width);
canvas.setAttribute('height', stage.height);

resetStage();

window.addEventListener('keydown', (e) => {
	//console.log(e.keyCode);
	if (e.keyCode === 87) {				// W
		paddles[0].pressingUp = true;
	}
	else if (e.keyCode === 83) {	// S
		paddles[0].pressingDown = true;
	}
	else if (e.keyCode === 38) {	// Up Arrow
		paddles[1].pressingUp = true;
	}
	else if (e.keyCode === 40) {	// Down Arrow
		paddles[1].pressingDown = true;
	}
	else if (e.keyCode === 32) {	// Space Bar
		stage.paused = !stage.paused;
		if (stage.paused) {
			stage.message = "Paused";
		}
		else {
			stage.message = "";
		}
	}
});
window.addEventListener('keyup', (e) => {
	if (e.keyCode === 87) {				// W
		paddles[0].pressingUp = false;
	}
	else if (e.keyCode === 83) {	// S
		paddles[0].pressingDown = false;
	}
	else if (e.keyCode === 38) {	// Up Arrow
		paddles[1].pressingUp = false;
	}
	else if (e.keyCode === 40) {	// Down Arrow
		paddles[1].pressingDown = false;
	}
});

window.setInterval(update, 1000 / 60);
