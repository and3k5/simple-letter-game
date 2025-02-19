

const letterContainer = document.getElementById('letterContainer');
const alphabet = 'abcdefghijklmnopqrstuvwxyzæøå';
const alphabetArray = alphabet.split('');
let currentLetter;

import { phraseloader } from './phraseloader.js';

let phraseplayer;
phraseloader("da", alphabet).then((data) => {
    phraseplayer = data;
});

function setup() {
    const alphabetLength = alphabetArray.length;
    currentLetter =
        alphabetArray[Math.floor(Math.random() * alphabetLength)];
    letterContainer.textContent =
        currentLetter.toUpperCase() + " " + currentLetter.toLowerCase();
    
    phraseplayer?.find(x => x.letter === currentLetter).audio.play();
}
document.querySelector('#startButton').addEventListener('click', setup);

window.addEventListener("keydown", (ev) => {
    if (
        ev.key === currentLetter.toLowerCase() ||
        ev.key === currentLetter.toUpperCase()
    ) {
        setup();
    }
});