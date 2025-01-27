window.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("menu");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  let score = 0;
  let gameOver = false;
  let obstacles = [];
  let backgroundX = 0; // Background position
  let obstacleSpeed, obstacleFrequency;

  let ball = {
    x: 50,
    y: 100,
    dy: 0,
    xGround: 82,
    gravity: 0.5,
    jumpPower: -10,
    ground: 130,
    isJumping: false,
  };

  function startGame(difficulty) {
    if (difficulty === "mudah") {
      obstacleSpeed = 3;
      obstacleFrequency = 0.01;
    } else if (difficulty === "sedang") {
      obstacleSpeed = 5;
      obstacleFrequency = 0.02;
    } else if (difficulty === "susah") {
      obstacleSpeed = 7;
      obstacleFrequency = 0.03;
    }

    menu.style.display = "none";
    canvas.style.display = "block";
    scoreDisplay.style.display = "block";

    gameLoop();
  }

  function drawBackground() {
    const stripeWidth = 50;
    const stripeHeight = ball.ground;
    const numStripes = Math.ceil(canvas.width / stripeWidth) + 1;

    for (let i = 0; i < numStripes; i++) {
      const x = backgroundX + i * stripeWidth;
      ctx.fillStyle = i % 2 === 0 ? "#87ceeb" : "#b0e0e6";
      ctx.fillRect(x, 0, stripeWidth, stripeHeight);
    }

    backgroundX -= obstacleSpeed;

    if (backgroundX <= -stripeWidth) {
      backgroundX += stripeWidth;
    }
  }

  function drawBall() {
    const dino = new Image();
    dino.src = "../img/trex.png";
    ctx.beginPath();
    ctx.drawImage(dino, ball.x, ball.y, 50, 50);
    ctx.fill();
    ctx.closePath();
  }

  function drawObstacles() {
    ctx.fillStyle = "#228B22";
    obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      obstacle.x -= obstacleSpeed;
    });
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
  }

  function generateObstacles() {
    if (Math.random() < obstacleFrequency) {
      const obstacleHeight = Math.random() * (40 - 20) + 20;
      const lastObstacle = obstacles[obstacles.length - 1];
      const minimumSpacing = 200;
  
      const xPosition = lastObstacle
        ? Math.max(canvas.width, lastObstacle.x + lastObstacle.width + minimumSpacing)
        : canvas.width;
  
      obstacles.push({
        x: xPosition,
        y: ball.ground - obstacleHeight,
        width: 20,
        height: obstacleHeight,
      });
    }
  }
  

  function checkCollision() {
    obstacles.forEach((obstacle) => {
      if (
        ball.x + 40 > obstacle.x &&
        ball.x + 40 < obstacle.x + obstacle.width &&
        ball.y + 40 > obstacle.y
      ) {
        gameOver = true;
        alert(`Game Over! Your score: ${score}`);
        location.reload();
      }
    });
  }

  function updateGame() {
    if (gameOver) return;

    ball.dy += ball.gravity;
    ball.y += ball.dy;

    if (ball.y >= ball.xGround) {
      ball.y = ball.xGround;
      ball.dy = 0;
      ball.isJumping = false;
    }

    checkCollision();
    setTimeout(generateObstacles,3000);

    score++;
    scoreDisplay.innerText = `Score: ${score}`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, ball.ground, canvas.width, canvas.height - ball.ground);

    drawBall();
    drawObstacles();
  }

  function jump(shortJump) {
    if (!ball.isJumping && ball.y === ball.xGround) {
      ball.dy = shortJump ? -12 : ball.jumpPower;
      ball.isJumping = true;
    }
  }

  function gameLoop() {
    updateGame();
    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }

  let timer = 0;
  let interval = null;

  this.addEventListener("keydown", function (e) {
    if (e.code == "Space" && !interval) {
      interval = window.setInterval(() => {
        timer++;
      });
    }
  });

  this.addEventListener("keyup", function (e) {
    if (e.code == "Space" && interval) {
      window.clearInterval(interval);
      interval = null;
      if (timer <= 4) {
        jump(false);
      } else if (timer >= 0) {
        jump(true);
      }
      timer = 0;
    }
  });
  
this.addEventListener("keydown", function (e) {
    if (e.code == "Space" && !interval) {
      interval = window.setInterval(() => {
        timer++;
      });
    }
  });

  this.addEventListener("keyup", function (e) {
    if (e.code == "Space" && interval) {
      window.clearInterval(interval);
      interval = null;
      if (timer <= 4) {
        jump(false);
      } else if (timer >= 0) {
        jump(true);
      }
      timer = 0;
    }
  });
  
this.addEventListener("touchstart", function () {
  if (!interval) {
    interval = window.setInterval(() => {
      timer++;
    });
  }
});

this.addEventListener("touchend", function () {
  if (interval) {
    window.clearInterval(interval);
    interval = null;
    if (timer <= 4) {
      jump(false);
    } else {
      jump(true);
    }
    timer = 0;
  }
});

  document
    .getElementById("mudah")
    .addEventListener("click", () => startGame("mudah"));
  document
    .getElementById("sedang")
    .addEventListener("click", () => startGame("sedang"));
  document
    .getElementById("susah")
    .addEventListener("click", () => startGame("susah"));
});
