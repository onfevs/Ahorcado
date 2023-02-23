const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const keyboardContainer = document.getElementById('keyboard-container');
const newGameButton = document.getElementById('new-game');

const words = ['javascript', 'html', 'css', 'node', 'python', 'ruby', 'java', 'php', 'react', 'angular'];
const maxLives = 8;

let word = '';
let letters = [];
let guessedLetters = [];
let wrongAttempts = 0;


function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function drawGallows() {
    context.beginPath();
    context.moveTo(150, 750);
    context.lineTo(150, 100);
    context.lineTo(500, 100);
    context.lineTo(500, 200);
    context.stroke();
}

function drawHead() {
    context.beginPath();
    context.arc(500, 250, 50, 0, Math.PI * 2);
    context.stroke();
}

function drawBody() {
    context.beginPath();
    context.moveTo(500, 300);
    context.lineTo(500, 500);
    context.stroke();
}

function drawLeftArm() {
    context.beginPath();
    context.moveTo(500, 350);
    context.lineTo(450, 400);
    context.stroke();
}

function drawRightArm() {
    context.beginPath();
    context.moveTo(500, 350);
    context.lineTo(550, 400);
    context.stroke();
}

function drawLeftLeg() {
    context.beginPath();
    context.moveTo(500, 500);
    context.lineTo(450, 600);
    context.stroke();
}

function drawRightLeg() {
    context.beginPath();
    context.moveTo(500, 500);
    context.lineTo(550, 600);
    context.stroke();
}

function drawKeyboard() {
    keyboardContainer.innerHTML = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const rows = [
        alphabet.slice(0, 10),
        alphabet.slice(10, 19),
        alphabet.slice(19, 26)
    ];

    rows.forEach(row => {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');
        keyboardContainer.appendChild(rowContainer);
        row.forEach(letter => {
            const key = document.createElement('div');
            key.classList.add('key');
            key.textContent = letter.toUpperCase();
            key.addEventListener('click', () => {
                if (letters.includes(letter)) {
                    key.classList.add('disabled', 'correct');
                    key.removeEventListener('click', () => { });
                    guessedLetters.push(letter);
                    checkGameState();
                } else {
                    key.classList.add('disabled', 'wrong');
                    wrongAttempts++;
                    drawHangman();
                }
            });
            rowContainer.appendChild(key);
        });
    });

    const disabledKeys = document.querySelectorAll('.disabled');
    disabledKeys.forEach(key => {
        key.removeEventListener('click', () => { });
    });
}

function checkGameState() {
    const isGameWon = letters.every(letter => guessedLetters.includes(letter));
    if (isGameWon) {
        winGame();
        disableKeys();
    } else if (wrongAttempts >= 6) {
        loseGame();
        disableKeys();
    }
}

function disableKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.removeEventListener('click', () => { });
        key.classList.add('disabled');
    });
}

function initializeGame() {
    word = getRandomWord();
    letters = word.split('');
    guessedLetters = [];
    wrongAttempts = 0;
    remainingLives = maxLives;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawKeyboard();
    drawGallows();
    drawWord();
    updateLives();
}

function drawHangman() {
    switch (wrongAttempts) {
        case 1:
            drawHead();
            break;
        case 2:
            drawBody();
            break;
        case 3:
            drawLeftArm();
            break;
        case 4:
            drawRightArm();
            break;
        case 5:
            drawLeftLeg();
            break;
        case 6:
            drawRightLeg();
            loseGame();
            break;
        default:
            break;
    }
}

function drawWord() {
    const wordContainer = document.createElement('div');
    wordContainer.classList.add('word-container');
    letters.forEach(letter => {
        const letterContainer = document.createElement('div');
        letterContainer.classList.add('letter-container');
        if (guessedLetters.includes(letter)) {
            letterContainer.textContent = letter.toUpperCase();
        }

        wordContainer.appendChild(letterContainer);
    });
    document.body.insertBefore(wordContainer, canvas);
}

function checkGameState() {
    const isGameWon = letters.every(letter => guessedLetters.includes(letter));
    if (isGameWon) {
        winGame();
    }
}

function winGame() {
    const message = "Felicidades, ganaste! La palabra era \"" + word + "\".";

    context.clearRect(0, 0, canvas.width, canvas.height);
    alert(message);
    initializeGame();
}

function loseGame() {
    const message = "Perdiste. La palabra era \"" + word + "\".";
    alert(message);
    initializeGame();
}

function checkLetter(letter) {
    const letters = document.querySelectorAll(".letters .letter");
    let found = false;
    letters.forEach((el) => {
        if (el.innerHTML === letter) {
            el.classList.add("found");
            found = true;
        }
    });

    if (!found) {
        lives--;
        updateLives();
    }
}

function updateLives() {
    const livesElement = document.querySelector('.lives');
    livesElement.innerHTML = '';
    for (let i = 0; i < maxLives - wrongAttempts; i++) {
        const heart = document.createElement('i');
        heart.classList.add('fas', 'fa-heart');
        livesElement.appendChild(heart);
    }
}


newGameButton.addEventListener('click', () => {
    initializeGame();
});

initializeGame();            
