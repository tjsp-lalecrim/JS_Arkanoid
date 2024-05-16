const canvas = document.getElementById("arkanoidCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 0;
let dy = 0;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // Initial position centered

const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const brickMultipliers = [1, 2, 3, 4, 5]; // Multiplier for each row
let score = 0;
let gameStarted = false;
let gameOver = false;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, multiplier: brickMultipliers[r] };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById("resetButton").addEventListener("click", resetGame);

function keyDownHandler(e) {
    if (!gameStarted) {
        gameStarted = true;
        dx = 2;
        dy = -2;
    }
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    x > brick.x &&
                    x < brick.x + brickWidth &&
                    y > brick.y &&
                    y < brick.y + brickHeight
                ) {
                    dy = -dy;
                    brick.status = 0;
                    score += brick.multiplier; // Increment score by multiplier
                    if (score === brickRowCount * brickColumnCount * (brickRowCount + 1) / 2) {
                        displayMessage("Congratulations! You win!", true);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            displayMessage("Game Over", false);
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

function displayMessage(message, win) {
    gameOver = true;
    ctx.font = "30px Arial";
    ctx.fillStyle = win ? "green" : "red";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 0;
    dy = 0;
    paddleX = (canvas.width - paddleWidth) / 2; // Center paddle
    gameStarted = false;
    gameOver = false;
    bricks.forEach(row => row.forEach(brick => brick.status = 1));
}

setInterval(draw, 10);
