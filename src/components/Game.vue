<template>
    <div id="letterContainer">
        {{ letter?.toUpperCase() }} {{ letter?.toLowerCase() }}
    </div>
</template>

<style lang="css" scoped>
#letterContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
import { wrongAudio } from "../resources";

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

window.addEventListener(
    "keydown",
    (ev) => {
        if (
            currentLetter.value &&
            (ev.key === currentLetter.value.letter.toLowerCase() ||
                ev.key === currentLetter.value.letter.toUpperCase())
        ) {
            router.replace({
                name: "next",
                params: {
                    locale: props.locale,
                },
            });
        } else if (alphabet.containsLetter(ev.key)) {
            if (!wrongAudio.paused) {
                wrongAudio.currentTime = 0;
            } else {
                wrongAudio.play();
            }
        } else if (ev.code === "Space") {
            if (!audioFile.value)
                throw new Error("Tried to play audio that was not loaded");

            if (!audioFile.value.paused) {
                audioFile.value.currentTime = 0;
            } else {
                audioFile.value.play();
            }
        }
    },
    {
        passive: true,
        signal: unloadController.signal,
    },
);
</script>
