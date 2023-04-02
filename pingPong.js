const canvas = document.getElementById("pingPongCanvas");
const ctx = canvas.getContext("2d");

// Game objects
const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 8;

let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Paddle movement
let player1MoveUp = false;
let player1MoveDown = false;
let player2MoveUp = false;
let player2MoveDown = false;

let player1Score = 0;
let player2Score = 0;
const winningScore = 7; // You can adjust this value as needed
let gameEnded = false;

// Key event listeners
document.addEventListener("keydown", (e) => handleKeyPress(e, true));
document.addEventListener("keyup", (e) => handleKeyPress(e, false));

function handleKeyPress(e, isKeyDown) {
    switch (e.key) {
        case "w":
        case "W":
            player1MoveUp = isKeyDown;
            break;
        case "s":
        case "S":
            player1MoveDown = isKeyDown;
            break;
        case "ArrowUp":
            player2MoveUp = isKeyDown;
            break;
        case "ArrowDown":
            player2MoveDown = isKeyDown;
            break;
    }
}

function gameLoop() {
    if (!gameEnded) {
        update();
        draw();
    } else {
        showWinnerAndResetButton();
    }
    requestAnimationFrame(gameLoop);
}

// Update game objects
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check for collisions with walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Check for collisions with paddles or scoring
    if (
        (ballX - ballRadius <= paddleWidth &&
            ballY >= player1Y &&
            ballY <= player1Y + paddleHeight) ||
        (ballX + ballRadius >= canvas.width - paddleWidth &&
            ballY >= player2Y &&
            ballY <= player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    } else if (ballX < 0 || ballX > canvas.width) {
        // Update scores
        if (ballX < 0) {
            player2Score++;
        } else {
            player1Score++;
        }

        // Check for a winner
        if (player1Score >= winningScore || player2Score >= winningScore) {
            gameEnded = true;
            return;
        }

        // Reset ball position
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    // Update paddles' positions based on pressed keys
    if (player1MoveUp) {
        player1Y -= 5;
    }
    if (player1MoveDown) {
        player1Y += 5;
    }
    if (player2MoveUp) {
        player2Y -= 5;
    }
    if (player2MoveDown) {
        player2Y += 5;
    }

    // Limit paddles' positions
    player1Y = Math.max(0, Math.min(canvas.height - paddleHeight, player1Y));
    player2Y = Math.max(0, Math.min(canvas.height - paddleHeight, player2Y));
}

// Draw game objects
function draw() {
    // Draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(
        canvas.width - paddleWidth,
        player2Y,
        paddleWidth,
        paddleHeight
    );

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0f0";
    ctx.fill();

    // Draw dashed line in the middle
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw scores
    drawScores();
}

function showWinnerAndResetButton() {
    const winner = player1Score >= winningScore ? "Player 1" : "Player 2";
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText(`Winner: ${winner}`, canvas.width / 2 - 75, 50);

    ctx.fillStyle = "#0f0";
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 20, 100, 40);
    ctx.fillStyle = "black";
    ctx.font = "18px sans-serif";
    ctx.fillText("Play Again", canvas.width / 2 - 40, canvas.height / 2 + 5);
}

canvas.addEventListener("click", (e) => {
    if (gameEnded) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (
            x >= canvas.width / 2 - 50 &&
            x <= canvas.width / 2 + 50 &&
            y >= canvas.height / 2 - 20 &&
            y <= canvas.height / 2 + 20
        ) {
            gameEnded = false;
            player1Score = 0;
            player2Score = 0;
        }
    }
});

function drawScores() {
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText(`Player 1: ${player1Score}`, 20, 30);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 140, 30);
}

gameLoop();
