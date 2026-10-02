const game = document.getElementById("main_div");
const fruitElement = document.getElementById("fruit");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");


// ======================================
// GAME SETTINGS
// ======================================

const gridSize = 20;

let gameWidth;
let gameHeight;

let snake;
let fruit;

let direction;
let nextDirection;

let score;

let gameOver;

let gameLoop;


// ======================================
// START GAME
// ======================================

function startGame() {

    gameWidth = Math.floor(game.clientWidth / gridSize);
    gameHeight = Math.floor(game.clientHeight / gridSize);

    // Starting snake
    snake = [
        {
            x: Math.floor(gameWidth / 2),
            y: Math.floor(gameHeight / 2)
        },

        {
            x: Math.floor(gameWidth / 2) - 1,
            y: Math.floor(gameHeight / 2)
        },

        {
            x: Math.floor(gameWidth / 2) - 2,
            y: Math.floor(gameHeight / 2)
        }
    ];


    // Starting direction
    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;

    gameOver = false;

    scoreElement.innerText = "Score: " + score;


    // Create fruit
    createFruit();


    // Start movement
    clearInterval(gameLoop);

    gameLoop = setInterval(moveSnake, 120);
}


// ======================================
// MOVE SNAKE
// ======================================

function moveSnake() {

    if (gameOver) {
        return;
    }


    // Change direction
    direction = nextDirection;


    // Current head
    const head = snake[0];


    // New head position
    let newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };


    // ==================================
    // WRAP AROUND SCREEN
    // ==================================

    // Right side -> Left side
    if (newHead.x >= gameWidth) {
        newHead.x = 0;
    }

    // Left side -> Right side
    if (newHead.x < 0) {
        newHead.x = gameWidth - 1;
    }

    // Bottom -> Top
    if (newHead.y >= gameHeight) {
        newHead.y = 0;
    }

    // Top -> Bottom
    if (newHead.y < 0) {
        newHead.y = gameHeight - 1;
    }


    // ==================================
    // CHECK SELF COLLISION
    // ==================================

    if (snake.some(part =>
        part.x === newHead.x &&
        part.y === newHead.y
    )) {

        endGame();
        return;
    }


    // Add new head
    snake.unshift(newHead);


    // ==================================
    // CHECK FRUIT
    // ==================================

    if (
        newHead.x === fruit.x &&
        newHead.y === fruit.y
    ) {

        // Snake grows automatically
        score++;

        scoreElement.innerText = "Score: " + score;

        createFruit();

    } else {

        // Remove tail
        snake.pop();
    }


    // Draw snake
    drawSnake();
}


// ======================================
// DRAW SNAKE
// ======================================

function drawSnake() {

    // Remove old snake parts
    document.querySelectorAll(".snake_part").forEach(part => {
        part.remove();
    });


    snake.forEach((part, index) => {

        const element = document.createElement("div");

        element.classList.add("snake_part");


        // Head
        if (index === 0) {
            element.classList.add("snake_head");
        }


        element.style.left =
            (part.x * gridSize) + "px";

        element.style.top =
            (part.y * gridSize) + "px";


        game.appendChild(element);
    });
}


// ======================================
// CREATE RANDOM FRUIT
// ======================================

function createFruit() {

    let newFruit;

    do {

        newFruit = {
            x: Math.floor(Math.random() * gameWidth),
            y: Math.floor(Math.random() * gameHeight)
        };

    } while (
        snake.some(part =>
            part.x === newFruit.x &&
            part.y === newFruit.y
        )
    );


    fruit = newFruit;


    fruitElement.style.left =
        (fruit.x * gridSize) + "px";

    fruitElement.style.top =
        (fruit.y * gridSize) + "px";
}


// ======================================
// CHANGE DIRECTION
// ======================================

function changeDirection(newDirection) {

    /*
        Snake को तुरंत opposite direction
        में जाने से रोकते हैं।
    */

    if (
        newDirection.x === -direction.x &&
        newDirection.y === -direction.y
    ) {
        return;
    }


    nextDirection = newDirection;
}


// ======================================
// KEYBOARD CONTROLS
// ======================================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp") {

        changeDirection({
            x: 0,
            y: -1
        });

    }

    else if (event.key === "ArrowDown") {

        changeDirection({
            x: 0,
            y: 1
        });

    }

    else if (event.key === "ArrowLeft") {

        changeDirection({
            x: -1,
            y: 0
        });

    }

    else if (event.key === "ArrowRight") {

        changeDirection({
            x: 1,
            y: 0
        });

    }

});


// ======================================
// MOBILE SWIPE
// ======================================

let startX = 0;
let startY = 0;

let endX = 0;
let endY = 0;


// Finger touches screen
game.addEventListener("touchstart", function(event) {

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;

});


// Finger leaves screen
game.addEventListener("touchend", function(event) {

    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;


    const distanceX = endX - startX;
    const distanceY = endY - startY;


    // Minimum swipe distance
    const minimumSwipe = 30;


    // Ignore tiny movement
    if (
        Math.abs(distanceX) < minimumSwipe &&
        Math.abs(distanceY) < minimumSwipe
    ) {
        return;
    }


    // ==================================
    // HORIZONTAL SWIPE
    // ==================================

    if (Math.abs(distanceX) > Math.abs(distanceY)) {

        // Swipe Right
        if (distanceX > 0) {

            changeDirection({
                x: 1,
                y: 0
            });

        }

        // Swipe Left
        else {

            changeDirection({
                x: -1,
                y: 0
            });

        }

    }


    // ==================================
    // VERTICAL SWIPE
    // ==================================

    else {

        // Swipe Down
        if (distanceY > 0) {

            changeDirection({
                x: 0,
                y: 1
            });

        }

        // Swipe Up
        else {

            changeDirection({
                x: 0,
                y: -1
            });

        }

    }

});


// ======================================
// GAME OVER
// ======================================

function endGame() {

    gameOver = true;

    clearInterval(gameLoop);


    setTimeout(function() {

        alert(
            "GAME OVER!\n\nScore: " + score
        );

    }, 100);
}


// ======================================
// RESTART
// ======================================

restartButton.addEventListener("click", function() {

    startGame();

});


// ======================================
// START
// ======================================

startGame();