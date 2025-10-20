import { LetterItem } from "@/locales/LetterItem";
import { Locale } from "@/locales/Locale";
export function createMode(): RandomMode {
    return {
        key: "random",
        getNextLetterItem(alphabet) {
            const alphabetLength = alphabet.letters.length;
            if (alphabetLength == 0) {
                throw new Error("Alphabet has no letters");
            }
            const index = Math.floor(Math.random() * alphabetLength);
            const letterItem = alphabet.letters[index];
            if (!letterItem)
                throw new Error("Did not find a letter at index " + index);
            console.trace("Pulled letter: " + letterItem.letter);
            return letterItem;
        },
    };
}

export interface RandomMode {
    key: "random";
    getNextLetterItem(alphabet: Locale): LetterItem;
}
