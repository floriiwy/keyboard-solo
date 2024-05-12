const wordContainer = document.querySelector('.word');
const correctCountContainer = document.querySelector('.correct-count');
const wrongCountContainer = document.querySelector('.wrong-count');
const wordMistakesContainer = document.querySelector('.word-mistakes');
const timeContainer = document.querySelector('#timer');

const words = ['elephant', 'tiger', 'lion', 'giraffe', 'zebra', 'monkey', 'penguin', 'dolphin', 'whale', 'shark', 'octopus', 'butterfly', 'dragonfly', 'firefly', 'hummingbird', 'caterpillar', 'chameleon', 'crocodile', 'kangaroo', 'koala'];


let currentWordIndex;
let currentWord;
let currentLetterIndex;

let correctCount;
let wrongCount;
let wordMistakes;

let startTime;
let endTime;

let timerInterval;

const maxCorrectCount = 5;
const maxWrongCount = 5;

function updateStats() {
    correctCountContainer.innerText = correctCount;
    wrongCountContainer.innerText = wrongCount;
    wordMistakesContainer.innerText = wordMistakes;
}

function updateWord() {
    const wordLetters = Array.from(currentWord).map((letter, index) => {
        const span = document.createElement('span');
        span.innerText = letter;
        if (index < currentLetterIndex) {
            span.classList.add('c');
        } else if (index === currentLetterIndex) {
            span.classList.add('w');
        }
        return span;
    });
    wordContainer.innerHTML = '';
    wordLetters.forEach((letter) => {
        wordContainer.appendChild(letter);
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function format(val) {
    if (val < 10) {
        return `0${val}`;
    }
    return val;
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = format(Math.floor(elapsedTime / 60));
    const seconds = format(elapsedTime % 60);
    timeContainer.innerText = `${minutes}:${seconds}`;
}

function endGame() {
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeyDown);
    endTime = Date.now();
    const resultMessage = correctCount === maxCorrectCount ? 'Поздравляю!' : 'Попробуйте ещё раз :/';
    alert(`${resultMessage} Время: ${timeContainer.innerText}`);
    initializeGame();
}

function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === currentWord[currentLetterIndex]) {
        currentLetterIndex++;
        if (currentLetterIndex === 1 && startTime === null) {
            startTimer();
        }
        if (currentLetterIndex === currentWord.length) {
            if (wordMistakes === 0) {
                correctCount++;
            } else {
                wrongCount++;
            }
            updateStats();
            if (correctCount === maxCorrectCount || wrongCount === maxWrongCount) {
                endGame();
            } else {
                generateNewWord();
            }
        }
        updateWord();
    } else {
        wordMistakes++;
        updateStats();
        const wordLetters = wordContainer.querySelectorAll('span');
        const currentLetterSpan = wordLetters[currentLetterIndex];
        currentLetterSpan.classList.add('word_incorrect');
        setTimeout(function() {
            currentLetterSpan.classList.remove('word_incorrect');
        }, 500);
    }
}


function generateNewWord() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[currentWordIndex];
    currentLetterIndex = 0;
    wordMistakes = 0;
    updateStats();
    updateWord();
}

function initializeGame() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[currentWordIndex];
    currentLetterIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    wordMistakes = 0;
    startTime = null;
    endTime = null;
    timerInterval = null;
    updateStats();
    updateWord();
    timeContainer.innerText = '00:00';
    document.addEventListener('keydown', handleKeyDown);
}

initializeGame();