<template>
    <div id="letterContainer" ref="letterContainer">
        <button id="startButton" type="button" @click="setup()">Start</button>
    </div>
</template>

<style scoped>
#letterContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 50svh;
    font-family: sans-serif;
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

#letterContainer button {
    padding:50px;
    font-size: 200px;
    border: none;
    background: #00ff00;
    color: #000;
    border-radius: 50px;
    cursor: pointer;
}
        
</style>

<script setup lang="ts">
import { ref } from "vue";
import * as locales from "./locales";
import { wrongAudio } from "./resources";

const letterContainer = ref<HTMLDivElement>();
const alphabet = locales.da.letters;
const currentLetter = ref<(typeof locales)["da"]["letters"][number]>();;


async function setup() {
    if (!letterContainer.value) throw new Error("letterContainer not set");
    const alphabetLength = alphabet.length;
    currentLetter.value =
        alphabet[Math.floor(Math.random() * alphabetLength)];
    letterContainer.value.textContent =
        currentLetter.value.letter.toUpperCase() + " " + currentLetter.value.letter.toLowerCase();
    
    const file = (await currentLetter.value.file).default;
    const audio = new Audio(file);
    audio.play();
}

window.addEventListener("keydown", (ev) => {
    if (
        currentLetter.value &&
        (ev.key === currentLetter.value.letter.toLowerCase() ||
        ev.key === currentLetter.value.letter.toUpperCase())
    ) {
        setup();
    }else if (alphabet.some(x => x.letter.toLowerCase() === ev.key.toLowerCase())) {
        wrongAudio.play();
    }
});
</script>