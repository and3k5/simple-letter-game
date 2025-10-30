import { defineStore } from "pinia";
import { ref } from "vue";
import * as locales from "./locales";
import { LocaleKey } from "./locales/LocaleKey";
import { LetterItem } from "./locales/LetterItem";
import { ModeKey } from "./game-modes/ModeKey";
import { ModeType } from "./game-modes/ModeType";
import { createMode as createRandomMode } from "./game-modes/random";
import { createMode as createAlphabeticalMode } from "./game-modes/alphabetical";
import { createMode as createWordMode } from "./game-modes/word";
import { Locale } from "./locales/Locale";
import {
    RouteLocationAsRelativeGeneric,
    RouteLocationNormalizedLoadedGeneric,
    RouteLocationRaw,
} from "vue-router";

export const useAlphabet = defineStore("alphabet", () => {
    const alphabetKey = ref<LocaleKey>();
    const alphabet = ref<Locale>();
    const mode = ref<ModeType>();

    return {
        setAlphabet(key: LocaleKey) {
            if (alphabetKey.value === key) return;
            alphabetKey.value = key;
            console.debug("Set alphabet locale to " + key);
            alphabet.value = locales[key];
            console.debug("Loaded " + key);
        },
        setMode(key: ModeKey) {
            if (key === "random") {
                mode.value = createRandomMode();
            } else if (key === "alphabetical") {
                mode.value = createAlphabeticalMode();
            } else if (key === "word") {
                mode.value = createWordMode();
            } else {
                throw new Error("Unknown type: " + key);
            }
        },
        getLetterItem(letter: LetterItem["letter"]) {
            if (alphabet.value == null) {
                throw new Error("Alphabet not loaded");
            }
            const match = alphabet.value.letters.find(
                (x) => x.letter === letter,
            );
            if (!match) {
                throw new Error("Did not find data for letter");
            }
            return match;
        },
        patchRoute(
            query: RouteLocationAsRelativeGeneric,
            to: RouteLocationNormalizedLoadedGeneric,
            from: RouteLocationNormalizedLoadedGeneric,
        ) {
            if (!mode.value) throw new Error("Mode is not loaded yet");
            if (!alphabet.value) throw new Error("Alphabet is not loaded yet");

            return mode.value.patchQuery(query, to, from, alphabet.value);
        },
        containsLetter(letter: string) {
            return alphabet.value.letters.some(
                (x) => x.letter.toLowerCase() === letter.toLowerCase(),
            );
        },
    };
});

export const useEffectState = defineStore("effectState", () => {
    const counter = ref(0);

    return {
        counter,
    };
});

function parseVolume(localStorageValue: string | null) {
    if (localStorageValue != null) {
        const floatValue = parseFloat(localStorageValue);
        if (!isNaN(floatValue)) {
            return floatValue;
        }
    }
    return undefined;
}

export const useVolume = defineStore("volume", () => {
    const volume = ref<number>(
        parseVolume(localStorage.getItem("volume")) ?? 1,
    );

    window.addEventListener("storage", (ev) => {
        if (ev.key === "volume") {
            volume.value = parseVolume(ev.newValue) ?? 1;
        }
    });
    return {
        volume,
    };
});
