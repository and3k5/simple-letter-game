<template>
    <Teleport to="body">
        <canvas id="fx-canvas" ref="fxCanvas"></canvas>
    </Teleport>
    <div
        id="letterContainer"
        :class="{ wrong: wrongIndicator, correct: correctIndicator }"
    >
        <template v-if="letterMode != 'lower'">
            {{ letter?.toUpperCase() }}
        </template>
        <template v-if="letterMode != 'upper'">
            {{ letter?.toLowerCase() }}
        </template>
    </div>
    <input
        type="text"
        style="pointer-events: none; opacity: 0"
        ref="virtKeybElem"
        @focus="focusedVirtKeybElem"
    />
</template>

<style lang="css" scoped>
#letterContainer {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-size: 40vmin;
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
    noiceAudio,
} from "../resources";
import { confetti } from "@tsparticles/confetti";
import { type HookHelper } from "@/utils/hook-helper";

const props = defineProps<{
    locale: LocaleKey;
    letter: string;
    hook?: HookHelper | undefined;
    letterMode: string | null | undefined;
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
const virtKeybElem = ref<HTMLInputElement>();

watch(
    () => currentLetter.value,
    async (newValue) => {
        audioFile.value = undefined;
        const file = await newValue.getFile();
        audioFile.value = new Audio(file);
    },
);

async function loadLetterSound(letter: LetterItem) {
    const file = await letter.getFile();
    const cancel = new AbortController();
    return new Promise<HTMLAudioElement>((res, rej) => {
        const audio = new Audio();
        audio.addEventListener(
            "canplay",
            () => {
                cancel.abort();
                res(audio);
            },
            {
                once: true,
                signal: cancel.signal,
            },
        );

        audio.addEventListener(
            "error",
            (event) => {
                cancel.abort();
                if (event.error) {
                    rej(event.error);
                } else if (event.message) {
                    rej(new Error("Error: " + event.message));
                } else {
                    console.error(event);
                    rej(new Error("Unknown error"));
                }
            },
            {
                once: true,
                signal: cancel.signal,
            },
        );
        audio.src = file;
    });
}

watch(
    () => props.letter,
    async (letter) => {
        currentLetter.value = alphabet.getLetterItem(letter);
        try {
            const audio = await loadLetterSound(currentLetter.value);
            audioFile.value = audio;
            await audio.play();
        } catch (e) {
            if (e instanceof Error && e.name === "NotAllowedError") {
                // Do nothing. This is just because of autoplay policy
                console.debug("Autoplay not allowed, ignoring");
            } else {
                console.error(e);
                //throw e;
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

const emit = defineEmits<{
    (e: "guessed-letter"): void;
}>();

const fxState = useEffectState();

async function playAndWait(audio: HTMLAudioElement) {
    if (!audio.paused) {
        audio.currentTime = 0;
    } else {
        audio.play();
    }
    const duration = audio.duration * 1000;
    await wait(duration);
}

async function handleCorrectLetter() {
    props.hook?.set("handle correct letter");
    emit("guessed-letter");
    const waitPromise = playAndWait(correctAudio);
    correctIndicator.value = true;
    await waitPromise;

    switch (fxState.counter++ % 3) {
        case 0:
            {
                confetti({
                    particleCount: 200,
                    spread: 180,
                    origin: { y: 0.6 },
                });

                await playAndWait(partyAudio);
                await playAndWait(noiceAudio);
                await wait(500);
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

                await playAndWait(fartAudio);
                await playAndWait(noiceAudio);
                await wait(500);
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

    correctIndicator.value = false;

    await router.replace({
        name: "next",
        params: {
            locale: props.locale,
        },
        query: router.currentRoute.value.query,
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
    props.hook?.set("handle wrong letter");
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
        props.hook?.set("keydown:" + ev.key);
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
            } finally {
                effectLock.value = false;
            }
        } else if (alphabet.containsLetter(ev.key)) {
            //if (ev.repeat) return;
            if (wrongLock.value) return;
            wrongLock.value = true;
            try {
                await handleWrongLetter();
            } finally {
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

window.addEventListener(
    "focus",
    () => {
        virtKeybElem.value?.focus();
    },
    {
        passive: true,
        signal: unloadController.signal,
    },
);

window.addEventListener(
    "click",
    () => {
        virtKeybElem.value?.focus();
    },
    {
        passive: true,
        signal: unloadController.signal,
    },
);

function focusedVirtKeybElem() {
    console.log("Focused virtual keyboard element");
}

const fxCanvas = ref<HTMLCanvasElement>();

function resizeCanvas() {
    if (!fxCanvas.value) return;
    fxCanvas.value.width = window.innerWidth;
    fxCanvas.value.height = window.innerHeight;
}

props.hook?.set("created");

onMounted(() => {
    props.hook?.set("mounted");
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
