import {leftPad} from './helpers';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
document.addEventListener('keydown', keyPush);

// SETTINGS
const tick = 10;
const speed = 10;
const scorePerPoint = 1;
const debug = false;

// GLOBAL VARIABLES
let gameLoop;
let posX;
let posY;
let velX;
let velY;
let tailLen = 20;
let tail = [];
let fruitX;
let fruitY;
let score;
let scoreString = '000000';
let scoreMultiplier;
let paused = true;
let gameOver;
let highscore = parseInt(localStorage.highscore) || 0;
let highscoreString = leftPad(localStorage.highscore || scoreString, 6, '0');

// SCREENS DEFINITION
const gameOverScreen = document.getElementById('game-over-screen');

// CONTROLS DEFINITION
const newGameButton = document.getElementById('new-game-button');
const pauseGameButton = document.getElementById('pause-game-button')

// CONTROLS ACTIONS
newGameButton.onclick = newGame;
pauseGameButton.onclick = togglePauseGame;

// SCORE LABELS DEFINITION
const currentScoreLabel = document.getElementById('current-score');
const highscoreLabel = document.getElementById('current-highscore');
const finalScoreLabel = document.getElementById('final-score');
const newHighscoreLabel = document.getElementById('new-highscore-label');

// INIT SCORE LABELS
currentScoreLabel.innerText = scoreString;
highscoreLabel.innerText = highscoreString;

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  posX += velX * tick;
  posY += velY * tick;
  checkIfInCanvas()
  checkSnakeCollision();
  tail.unshift({x: posX, y: posY});
  tail.splice(tailLen);
  context.fillStyle = "white";
  for (var i = 0; i < tail.length; i++) {
    context.fillRect(tail[i].x, tail[i].y, tick, tick);
  }
  context.fillRect(fruitX, fruitY, 10, 10);
  checkFruitCollision();
}

function newGame() {
  if (debug) {
    console.log('#### NEW GAME ####');
  }
  // I know there are better ways to do it
  clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    if (!paused && !gameOver) {
      update();
    }
  }, 1000 / speed);

  gameOverScreen.style.display = 'none';
  newHighscoreLabel.style.display = 'none';
  posX = 0;
  posY = 0;
  velX = 1;
  velY = 0;
  score = 0;
  scoreString = '000000'
  scoreMultiplier = 0;
  tailLen = 20;
  tail = [];
  gameOver = false;
  currentScoreLabel.innerText = scoreString;
  newFruit();
  if (paused) {
    togglePauseGame();
  }
}

function togglePauseGame() {
  if (!gameOver) {
    if (debug) {
      console.log('#### GAME PAUSED ####', !paused);
    }
    paused = !paused;
    if (paused) {
      pauseGameButton.innerText = 'Unpause Game';
    } else {
      pauseGameButton.innerText = 'Pause Game';
    }
  }
}

function endGame() {
  showEndGameScreen();
  gameOver = true;  
}

function showEndGameScreen() {
  paused = true;
  finalScoreLabel.innerText = scoreString;
  gameOverScreen.style.display = 'block';
  if (score > highscore) {
    newHighscoreLabel.style.display = 'block';
    localStorage.setItem('highscore', score)
  }
}

function checkIfInCanvas() {
  if (posX >= canvas.width) {
    posX = 0;
  } else if (posX < 0) {
    posX = canvas.width;
  }
  if (posY >= canvas.height) {
    posY = 0;
  } else if (posY < 0) {
    posY = canvas.height;
  }
}

function checkSnakeCollision() {
  for (var i = 1; i < tail.length; i++) {
    if (posX >= tail[i].x && posX < tail[i].x + tick && posY >= tail[i].y && posY < tail[i].y + tick) {
      if (debug) {
        console.log('#### SNAKE COLISION OCCURED ####');
      }
      endGame();
    }
  }
}

function checkFruitCollision() {
  if (posX >= fruitX && posX < fruitX + tick && posY >= fruitY && posY < fruitY + tick) {
    if (debug) {
      console.log('#### FRUIT COLISION OCCURED ####');
    }
    tailLen++;
    addPoints();
    newFruit();
  }
}

function addPoints() {
  score += scorePerPoint;
  scoreString = leftPad(score.toString(), 6, '0');
  currentScoreLabel.innerText = scoreString;
  if (score > highscore) {
    highscoreLabel.innerText = scoreString;
  }

}

function newFruit() {
  if (debug) {
    console.log('#### NEW FRUIT ####');
  }
  fruitX = Math.floor(Math.random() * canvas.width / tick) * tick;
  fruitY = Math.floor(Math.random() * canvas.height / tick) * tick;
}

function keyPush(event) {
  if (debug) {
    console.log(event.keyCode);
  }
  switch (event.keyCode) {
    case 37:
      if (velX === 0) {
        velX = -1;
        velY = 0;
      }
      break;
    case 38:
      if (velY === 0) {
        velX = 0;
        velY = -1;
      }
      break;
    case 39:
      if (velX === 0) {
        velX = 1;
        velY = 0;
      }
      break;
    case 40:
      if (velY === 0) {
        velX = 0;
        velY = 1;
      }
      break;
    case 78: // N - for new game
      newGame();
      break;
    case 80: // P - for pause
      togglePauseGame();
      break;

    default:
      break;
  }
}