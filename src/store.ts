import { defineStore } from "pinia";
import { ref } from "vue";
import * as locales from "./locales";
import { LocaleKey } from "./locales/LocaleKey";
import { LetterItem } from "./locales/LetterItem";
import { ModeKey } from "./game-modes/ModeKey";
import { ModeType } from "./game-modes/ModeType";
import { createMode as createRandomMode } from "./game-modes/random";
import { createMode as createAlphabeticalMode } from "./game-modes/alphabetical";
import { Locale } from "./locales/Locale";

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
        getNextLetter(
            previousLetter: string | undefined,
        ): LetterItem["letter"] {
            if (!alphabet.value) throw new Error("Alphabet is not loaded yet");
            const letterItem = mode.value.getNextLetterItem(
                alphabet.value,
                previousLetter,
            );
            return letterItem.letter;
        },
        containsLetter(letter: string) {
            return alphabet.value.letters.some(
                (x) => x.letter.toLowerCase() === letter.toLowerCase(),
            );
        },
    };
});
