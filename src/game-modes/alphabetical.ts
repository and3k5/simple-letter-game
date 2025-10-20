import { LetterItem } from "@/locales/LetterItem";
import { Locale } from "@/locales/Locale";

export function createMode(): AlphabeticalMode {
    return {
        key: "alphabetical",
        getNextLetterItem(alphabet, previousLetter) {
            const oldIndex =
                previousLetter == null
                    ? -1
                    : alphabet.letters.findIndex(
                          (x) =>
                              x.letter.toLowerCase() ===
                              previousLetter.toLowerCase(),
                      );
            const newIndex = (oldIndex + 1) % alphabet.letters.length;
            return alphabet.letters[newIndex];
        },
    };
}

export interface AlphabeticalMode {
    key: "alphabetical";
    getNextLetterItem(
        alphabet: Locale,
        previousLetter: string | undefined,
    ): LetterItem;
}
