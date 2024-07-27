// game.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
let direction = "RIGHT";
let newDirection = "RIGHT";
let apple = { x: 5 * gridSize, y: 5 * gridSize };
let score = 0;
let highScore = 0;
let gameInterval;
let gamePaused = false;
let gameOverScreen = document.getElementById("gameOverScreen");
let finalScore = document.getElementById("finalScore");
let restartGameButton = document.getElementById("restartGameButton");
let toggleButton = document.getElementById("toggleButton");
let isMinimized = false;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  snake.forEach((segment) =>
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize)
  );

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, gridSize, gridSize);
}

// Move snake and handle game logic
function moveSnake() {
  let head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= gridSize;
      break;
    case "DOWN":
      head.y += gridSize;
      break;
    case "LEFT":
      head.x -= gridSize;
      break;
    case "RIGHT":
      head.x += gridSize;
      break;
  }

  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    apple = {
      x: Math.floor(Math.random() * tileCount) * gridSize,
      y: Math.floor(Math.random() * tileCount) * gridSize
    };
  } else {
    snake.pop();
  }

  // Check for collisions
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some(
      (segment, index) =>
        index !== 0 && segment.x === head.x && segment.y === head.y
    )
  ) {
    gameOver();
  }
}

// End the game
function gameOver() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScore").innerText = "High Score: " + highScore;
  }
  finalScore.innerText = "Final Score: " + score;
  gameOverScreen.style.display = "block";
}

// Update game state and redraw
function update() {
  if (!gamePaused) {
    moveSnake();
    draw();
  }
}

// Start the game
function startGame() {
  gameOverScreen.style.display = "none";
  gameInterval = setInterval(update, 100);
}

// Pause or resume the game
function pauseGame() {
  gamePaused = !gamePaused;
}

// Restart the game
function restartGame() {
  gameOver();
  score = 0;
  snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
  direction = "RIGHT";
  apple = { x: 5 * gridSize, y: 5 * gridSize };
  startGame();
}

// Toggle minimize/maximize of the game container
function toggleMinimize() {
  const gameContainer = document.getElementById("gameContainer");
  isMinimized = !isMinimized;
  if (isMinimized) {
    gameContainer.style.width = "100px";
    gameContainer.style.height = "100px";
    gameContainer.style.overflow = "hidden";
    toggleButton.innerText = "Maximize";
  } else {
    gameContainer.style.width = "80vw";
    gameContainer.style.height = "80vh";
    gameContainer.style.overflow = "auto";
    toggleButton.innerText = "Minimize";
  }
}

// Event listeners
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("restartButton").addEventListener("click", restartGame);
restartGameButton.addEventListener("click", restartGame);

toggleButton.addEventListener("click", toggleMinimize);

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
      if (direction !== "DOWN") newDirection = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") newDirection = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") newDirection = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") newDirection = "RIGHT";
      break;
  }
  direction = newDirection;
});
