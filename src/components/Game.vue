<template>
    <Teleport to="body">
        <canvas id="fx-canvas" ref="fxCanvas"></canvas>
    </Teleport>
    <div id="letterContainer">
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
import { useAlphabet } from "@/store";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
    wrongAudio,
    partyAudio,
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

function handleCorrectLetter() {
    let waitTime = 1000;
    switch (Math.round(Math.random() * 2)) {
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
            }
            break;
        case 1:
            {
                confetti({
                    particleCount: 400,
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
                    }
                }
                waitTime = 2200;
                requestAnimationFrame(drawImage);

                // Crossfade/pan the sound as the cat is moving towards the screen

                // onBeforeUnmount(() => {
                //     clearInterval(animationInterval);
                //     clearInterval(panAnimation);
                // });
            }
            break;
    }

    setTimeout(() => {
        router.replace({
            name: "next",
            params: {
                locale: props.locale,
            },
        });
    }, waitTime);
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

function handleWrongLetter() {
    if (!wrongAudio.paused) {
        wrongAudio.currentTime = 0;
    } else {
        wrongAudio.play();
    }
}

window.addEventListener(
    "keydown",
    (ev) => {
        if (
            currentLetter.value &&
            (ev.key === currentLetter.value.letter.toLowerCase() ||
                ev.key === currentLetter.value.letter.toUpperCase())
        ) {
            handleCorrectLetter();
        } else if (alphabet.containsLetter(ev.key)) {
            handleWrongLetter();
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
