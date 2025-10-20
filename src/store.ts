import { defineStore } from "pinia";
import { ref } from "vue";
import * as locales from "./locales";
import { LocaleKey } from "./locales/LocaleKey";
import { LetterItem } from "./locales/LetterItem";

export const useAlphabet = defineStore("alphabet", () => {
    const alphabetKey = ref<LocaleKey>();
    const alphabet = ref<(typeof locales)[LocaleKey]>();

    return {
        setAlphabet(key: LocaleKey) {
            if (alphabetKey.value === key) return;
            alphabetKey.value = key;
            console.debug("Set alphabet locale to " + key);
            alphabet.value = locales[key];
            console.debug("Loaded " + key);
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
        pullRandomLetterItem(): LetterItem {
            if (!alphabet.value) throw new Error("Alphabet is not loaded yet");
            const alphabetLength = alphabet.value.letters.length;
            if (alphabetLength == 0) {
                throw new Error("Alphabet has no letters");
            }
            const index = Math.floor(Math.random() * alphabetLength);
            const letterItem = alphabet.value.letters[index];
            if (!letterItem)
                throw new Error("Did not find a letter at index " + index);
            console.trace("Pulled letter: " + letterItem.letter);
            return letterItem;
        },
        pullRandomLetter(): LetterItem["letter"] {
            return this.pullRandomLetterItem().letter;
        },
        containsLetter(letter: string) {
            return alphabet.value.letters.some(
                (x) => x.letter.toLowerCase() === letter.toLowerCase(),
            );
        },
    };
});
