const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12, paddleHeight = 80;
const ballSize = 14;
let leftScore = 0, rightScore = 0;

// Paddles
const leftPaddle = {
    x: 0,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 3 // AI speed
};

// Ball
const ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    size: ballSize,
    speed: 5,
    dx: 5,
    dy: 2
};

// Draw everything
function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color='#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.fillText(text, x, y);
}

function drawNet() {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for(let i = 0; i < canvas.height; i += 28) {
        ctx.moveTo(canvas.width/2, i);
        ctx.lineTo(canvas.width/2, i + 14);
    }
    ctx.stroke();
}

function resetBall() {
    ball.x = canvas.width/2 - ball.size/2;
    ball.y = canvas.height/2 - ball.size/2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * 6;
}

// Collision detection
function collide(paddle, ball) {
    return ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y;
}

// Main update
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Left paddle collision
    if (collide(leftPaddle, ball)) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        // Add some spin
        let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
        collidePoint = collidePoint / (leftPaddle.height/2);
        ball.dy = collidePoint * 5;
    }

    // Right paddle collision
    if (collide(rightPaddle, ball)) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        // Add some spin
        let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
        collidePoint = collidePoint / (rightPaddle.height/2);
        ball.dy = collidePoint * 5;
    }

    // Score
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        leftScore++;
        resetBall();
    }

    // AI movement (simple follow)
    let target = ball.y - (rightPaddle.height/2 - ball.size/2);
    if (rightPaddle.y < target) {
        rightPaddle.y += rightPaddle.dy;
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= rightPaddle.dy;
    }
    // Clamp AI paddle
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

// Draw everything
function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#232347');
    drawNet();
    // Draw paddles and ball
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    drawRect(ball.x, ball.y, ball.size, ball.size);
    // Draw scores
    drawText(leftScore, canvas.width/4, 50);
    drawText(rightScore, 3*canvas.width/4, 50);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for left paddle
canvas.addEventListener('mousemove', (evt) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height/2;
    // Clamp paddle
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
});

resetBall();
gameLoop();