<template>
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
</style>

<script setup lang="ts">
import { LetterItem } from "@/locales/LetterItem";
import { LocaleKey } from "@/locales/LocaleKey";
import { useAlphabet } from "@/store";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { wrongAudio, partyAudio, fartAudio } from "../resources";
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

function handleCorrectLetter() {
    switch (Math.round(Math.random() * 1)) {
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
    }

    setTimeout(() => {
        router.replace({
            name: "next",
            params: {
                locale: props.locale,
            },
        });
    }, 1000);
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
</script>
