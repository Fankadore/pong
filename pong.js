"use strict";

const canvas = document.querySelector('#game-window');
const ctx = canvas.getContext('2d');
const WIDTH = 400;
const HEIGHT = 300;

let ballWidth = 10;
let ballHeight = 10;
let ballX = (WIDTH / 2) - (ballWidth / 2);
let ballY = (HEIGHT / 2) - (ballHeight / 2);
let ballVelX = Math.floor((Math.random() * 2));
if (ballVelX === 0) {
    ballVelX = -1;
}
let ballVelY = Math.floor((Math.random() * 1));
if (ballVelY === 0) {
    ballVelY = -1;
}
let ballSpeedX = 2;
let ballSpeedY = 2;

let paddleWidth = 10;

let paddle1Height = HEIGHT / 4;
let paddle1X = 30;
let paddle1Y = (HEIGHT * 3) / 8;
let paddle1Speed = 2;

let paddle2Height = paddle1Height;
let paddle2X = WIDTH - paddle1X;
let paddle2Y = paddle1Y;
let paddle2Speed = paddle1Speed;

let pressingW = false;
let pressingS = false;
let pressingUp = false;
let pressingDown = false;

const FRAMERATE = 1000/60;
let score1 = 0;
let score2 = 0;

window.addEventListener('keydown', (e) => {
    //console.log(e.keyCode);
    if (e.keyCode === 87) {         // W
        pressingW = true;
    }
    else if (e.keyCode === 83) {    // S
        pressingS = true;
    }
    else if (e.keyCode === 38) {    // Up Arrow
        pressingUp = true;
    }
    else if (e.keyCode === 40) {    // Down Arrow
        pressingDown = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode === 87) {         // W
        pressingW = false;
    }
    else if (e.keyCode === 83) {    // S
        pressingS = false;
    }
    else if (e.keyCode === 38) {    // Up Arrow
        pressingUp = false;
    }
    else if (e.keyCode === 40) {    // Down Arrow
        pressingDown = false;
    }
});

function resetStage() {
    // Reset Ball
    ballX = WIDTH / 2;
    ballY = (HEIGHT * 3) / 8;
    ballVelX = Math.floor((Math.random() * 2));
    if (ballVelX === 0) {
        ballVelX = -1;
    }
    ballVelY = Math.floor((Math.random() * 2));
    if (ballVelY === 0) {
        ballVelY = -1;
    }
    ballSpeedX = 2;
    ballSpeedY = 2;

    // Reset Paddle 1
    paddle1X = 30;
    paddle1Y = (HEIGHT * 3) / 8;
    paddle1Speed = 2;

    // Reset Paddle 2
    paddle2X = WIDTH - paddle1X;
    paddle2Y = paddle1Y;
    paddle2Speed = paddle1Speed;
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillRect(paddle1X, paddle1Y, paddleWidth, paddle1Height);
    ctx.fillRect(paddle2X, paddle2Y, paddleWidth, paddle2Height);
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
    ctx.fillText(`${score1} - ${score2}`, WIDTH / 2, 10); 
}

function update() {
    // Paddle 1
    if (pressingW) {
        paddle1Y -= paddle1Speed;
        if (paddle1Y < 0) {
            paddle1Y = 0;
        }
    }
    else if (pressingS) {
        paddle1Y += paddle1Speed;
        if (paddle1Y > HEIGHT - paddle1Height) {
            paddle1Y = HEIGHT - paddle1Height;
        }
    }
    
    // Paddle 2
    if (pressingUp) {
        paddle2Y -= paddle2Speed;
        if (paddle2Y < 0) {
            paddle2Y = 0;
        }
    }
    else if (pressingDown) {
        paddle2Y += paddle2Speed;
        if (paddle2Y > HEIGHT - paddle2Height) {
            paddle2Y = HEIGHT - paddle2Height;
        }
    }

    // Check the ball always moves sideways
    if (ballVelX === 0) {
        ballVelX = 1;
    }

    // Move the ball
    ballX += (ballVelX * ballSpeedX);
    ballY += (ballVelY * ballSpeedY);

    // Bounce the ball against the top or bottom edge
    if (ballY < 0) {
        ballVelY *= -1;
        ballSpeedY += 0.1;
    }
    else if (ballY > HEIGHT - ballHeight) {
        ballVelY *= -1;
        ballSpeedY += 0.1;
    }

    // Bounce the ball against the paddles
    if (ballX + (ballWidth / 2) > paddle1X && ballX + (ballWidth / 2) < paddle1X + paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddle1Height) {
        ballVelX *= -1;
        ballSpeedX += 0.1;
    }
    else if (ballX + (ballWidth / 2) > paddle2X && ballX + (ballWidth / 2) < paddle2X + paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddle2Height) {
        ballVelX *= -1;
        ballSpeedX += 0.1;
    }

    // Player scores when the ball touchs the left or right edge
    if (ballX < 0) {
        score2++;
        if (score2 >= 3) {
            // Player 2 Wins
        }
        resetStage();
    }
    else if (ballX > WIDTH - ballWidth) {
        score1++;
        if (score1 >= 3) {
            // Player 1 Wins
        }
        resetStage();
    }

    draw();
}

canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

setInterval(update, FRAMERATE);