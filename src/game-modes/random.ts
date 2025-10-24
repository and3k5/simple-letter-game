import { LetterItem } from "@/locales/LetterItem";
import { Locale } from "@/locales/Locale";
import {
    RouteLocationAsRelativeGeneric,
    RouteLocationNormalizedLoadedGeneric,
    RouteLocationRaw,
} from "vue-router";
export function createMode(): RandomMode {
    return {
        key: "random",
        patchQuery(route, to, from, alphabet) {
            const alphabetLength = alphabet.letters.length;
            if (alphabetLength == 0) {
                throw new Error("Alphabet has no letters");
            }
            const index = Math.floor(Math.random() * alphabetLength);
            const letterItem = alphabet.letters[index];
            if (!letterItem)
                throw new Error("Did not find a letter at index " + index);
            console.trace("Pulled letter: " + letterItem.letter);
            const letter = letterItem;

            route.params.letter = letter.letter;
            return route;
        },
    };
}

export interface RandomMode {
    key: "random";
    patchQuery(
        route: RouteLocationAsRelativeGeneric,
        to: RouteLocationNormalizedLoadedGeneric,
        from: RouteLocationNormalizedLoadedGeneric,
        alphabet: Locale,
    ): RouteLocationAsRelativeGeneric;
}
