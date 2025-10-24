import { LetterItem } from "@/locales/LetterItem";
import { Locale } from "@/locales/Locale";
import {
    RouteLocationAsRelativeGeneric,
    RouteLocationNormalizedLoadedGeneric,
    RouteLocationRaw,
} from "vue-router";

export function createMode(): AlphabeticalMode {
    return {
        key: "alphabetical",
        patchQuery(route, to, from, alphabet) {
            const previousLetter = from.params.letter as string | undefined;
            const oldIndex =
                previousLetter == null
                    ? -1
                    : alphabet.letters.findIndex(
                          (x) =>
                              x.letter.toLowerCase() ===
                              previousLetter.toLowerCase(),
                      );
            const newIndex = (oldIndex + 1) % alphabet.letters.length;
            const letter = alphabet.letters[newIndex];
            console.log(
                "Letter changed from " +
                    previousLetter +
                    " to " +
                    letter.letter,
            );
            route.params.letter = letter.letter;

            return route;
        },
    };
}

export interface AlphabeticalMode {
    key: "alphabetical";
    patchQuery(
        route: RouteLocationAsRelativeGeneric,
        to: RouteLocationNormalizedLoadedGeneric,
        from: RouteLocationNormalizedLoadedGeneric,
        alphabet: Locale,
    ): RouteLocationAsRelativeGeneric;
}
