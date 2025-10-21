<template>
    <Teleport to="body">
        <canvas id="fx-canvas" ref="fxCanvas"></canvas>
    </Teleport>
    <div id="letterContainer" :class="{ 'wrong': wrongIndicator, 'correct': correctIndicator }">
        {{ letter?.toUpperCase() }} {{ letter?.toLowerCase() }}
    </div>
</template>

<style lang="css" scoped>
#letterContainer {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-size: 50svh;
    font-family: sans-serif;
}

.wrong {
    color: rgb(199, 36, 36);
}

.correct {
    color: rgb(34, 202, 70);
}

#fx-canvas {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    left: 0;
    pointer-events: none;
}
</style>

<script setup lang="ts">
import { LetterItem } from "@/locales/LetterItem";
import { LocaleKey } from "@/locales/LocaleKey";
import { useAlphabet, useEffectState } from "@/store";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
    wrongAudio,
    partyAudio,
    correctAudio,
    fartAudio,
    createOmNomAudio,
    catOpen,
    catClosed,
} from "../resources";
import { confetti } from "@tsparticles/confetti";

const props = defineProps<{
    locale: LocaleKey;
    letter: string;
}>();

const alphabet = useAlphabet();

watch(
    () => props.locale,
    (localeKey) => {
        alphabet.setAlphabet(localeKey);
    },
    {
        immediate: true,
    },
);

const currentLetter = ref<LetterItem>();
const router = useRouter();
const audioFile = ref<HTMLAudioElement>();
const correctIndicator = ref(false);
const wrongIndicator = ref(false);

watch(
    () => currentLetter.value,
    async (newValue) => {
        audioFile.value = undefined;
        const file = await newValue.getFile();
        audioFile.value = new Audio(file);
    },
);

watch(
    () => props.letter,
    async (letter) => {
        currentLetter.value = alphabet.getLetterItem(letter);

        const file = await currentLetter.value.getFile();
        const audio = new Audio(file);
        audioFile.value = audio;
        try {
            await audio.play();
        } catch (e) {
            if (e instanceof Error && e.name === "NotAllowedError") {
                // Do nothing. This is just because of autoplay policy
            } else {
                throw e;
            }
        }
    },
    {
        immediate: true,
    },
);

const unloadController = new AbortController();

onBeforeUnmount(() => {
    unloadController.abort();
});

const images = [catOpen, catClosed].map((x) => {
    const img = new Image();
    img.src = x;
    return img;
});

async function wait(n: number) {
    return new Promise((resolve) => setTimeout(resolve, n));
}

const fxState = useEffectState();

async function handleCorrectLetter() {
    if (!correctAudio.paused) {
        correctAudio.currentTime = 0;
    } else {
        correctAudio.play();
    }
    const durationCorrect = correctAudio.duration * 1000;
    const waitPromise = wait(durationCorrect);
    correctIndicator.value = true;
    await waitPromise;
    correctIndicator.value = false;
    switch ((fxState.counter += 1) % 3) {
        case 0:
            {
                confetti({
                    particleCount: 200,
                    spread: 180,
                    origin: { y: 0.6 },
                });

                if (!partyAudio.paused) {
                    partyAudio.currentTime = 0;
                } else {
                    partyAudio.play();
                }
                const duration = partyAudio.duration * 1000;
                await wait(duration);
            }
            break;
        case 1:
            {
                confetti({
                    particleCount: 200,
                    spread: 90,
                    angle: 0,
                    startVelocity: 105,
                    origin: { x: 0 },
                    shapes: ["emoji"],
                    shapeOptions: {
                        emoji: {
                            value: ["💨", "💩", "🧻"],
                        },
                    },
                });

                if (!fartAudio.paused) {
                    fartAudio.currentTime = 0;
                } else {
                    fartAudio.play();
                }
                const duration = fartAudio.duration * 1000;
                await wait(duration);
            }
            break;
        case 2:
            {
                const omnomAudio = createOmNomAudio();
                if (!omnomAudio.paused) {
                    omnomAudio.currentTime = 0;
                } else {
                    omnomAudio.play();
                }

                // Render alternating images across the screen of fxCanvas
                const ctx = fxCanvas.value.getContext("2d");

                const imagesWidth = Math.max(...images.map((x) => x.width));

                const mostLeft = 0 - imagesWidth;
                const mostRight = fxCanvas.value.width + 20;
                let x = mostLeft;

                const audioContext = new AudioContext();
                const audioPanNode = audioContext.createStereoPanner();
                const source =
                    audioContext.createMediaElementSource(omnomAudio);
                source.connect(audioPanNode);
                audioPanNode.connect(audioContext.destination);
                audioPanNode.pan.value = -1;

                const ctrl = new AbortController();
                const runPromise = new Promise<void>((resolve) => {
                    ctrl.signal.addEventListener("abort", () => {
                        resolve();
                    });
                });

                function drawImage(n: number) {
                    const currentImageIndex =
                        Math.ceil(n / 100) % images.length;
                    if (!fxCanvas.value) {
                        throw new Error("Could not draw on canvas");
                    }
                    ctx.clearRect(
                        0,
                        0,
                        fxCanvas.value.width,
                        fxCanvas.value.height,
                    );
                    const img = images[currentImageIndex];
                    ctx.drawImage(img, x, fxCanvas.value.height - img.height);
                    x += 15; // Move the image to the right
                    const progress = (x - mostLeft) / (mostRight - mostLeft);
                    audioPanNode.pan.value = progress * 2 - 1;
                    if (x < mostRight) {
                        requestAnimationFrame(drawImage);
                    } else {
                        omnomAudio.pause();
                        ctrl.abort();
                    }
                }

                requestAnimationFrame(drawImage);
                await runPromise;
            }
            break;
    }

    await router.replace({
        name: "next",
        params: {
            locale: props.locale,
        },
    });
}

function repeatSound() {
    if (!audioFile.value)
        throw new Error("Tried to play audio that was not loaded");

    if (!audioFile.value.paused) {
        audioFile.value.currentTime = 0;
    } else {
        audioFile.value.play();
    }
}

async function handleWrongLetter() {
    if (!wrongAudio.paused) {
        wrongAudio.currentTime = 0;
    } else {
        wrongAudio.play();
    }

    const duration = wrongAudio.duration * 1000;
    const waitingPromise = wait(duration);

    wrongIndicator.value = true;
    await wait(100);
    wrongIndicator.value = false;
    await wait(100);
    wrongIndicator.value = true;
    await wait(100);
    wrongIndicator.value = false;

    await waitingPromise;
}

const effectLock = ref(false);
const wrongLock = ref(false);

window.addEventListener(
    "keydown",
    async (ev) => {
        if (
            currentLetter.value &&
            (ev.key === currentLetter.value.letter.toLowerCase() ||
                ev.key === currentLetter.value.letter.toUpperCase())
        ) {
            if (ev.repeat) return;
            if (effectLock.value) return;
            effectLock.value = true;
            try {
                await handleCorrectLetter();
            }
            finally {
                effectLock.value = false;
            }
        } else if (alphabet.containsLetter(ev.key)) {
            //if (ev.repeat) return;
            if (wrongLock.value) return;
            wrongLock.value = true;
            try {
                await handleWrongLetter();
            }
            finally {
                wrongLock.value = false;
            }
        } else if (ev.code === "Space") {
            repeatSound();
        }
    },
    {
        passive: true,
        signal: unloadController.signal,
    },
);

const fxCanvas = ref<HTMLCanvasElement>();

function resizeCanvas() {
    if (!fxCanvas.value) return;
    fxCanvas.value.width = window.innerWidth;
    fxCanvas.value.height = window.innerHeight;
}

onMounted(() => {
    resizeCanvas();
});

window.addEventListener(
    "resize",
    () => {
        resizeCanvas();
    },
    {
        signal: unloadController.signal,
    },
);
</script>
