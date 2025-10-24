import { LetterItem } from "@/locales/LetterItem";
import { Locale } from "@/locales/Locale";
import {
    RouteLocationAsRelativeGeneric,
    RouteLocationNormalizedLoadedGeneric,
    RouteLocationRaw,
    useRoute,
} from "vue-router";

export function createMode(): WordMode {
    return {
        key: "word",
        patchQuery(route, to, from, alphabet) {
            const oldIndex = to.query.currentIndex;

            if (Array.isArray(oldIndex)) {
                throw new Error("Invalid current index (array)");
            }

            if (route == null) throw new Error("Route is not available");

            const customWord = to.query.customWord as string | undefined;
            if (!customWord || customWord.length === 0) {
                throw new Error("No custom word provided");
            }

            if (Array.isArray(oldIndex)) {
                throw new Error("Invalid current index (array)");
            }

            const currentIndexNumber =
                oldIndex == null ? -1 : parseInt(oldIndex, 10);

            const newIndex = (currentIndexNumber + 1) % customWord.length;
            const letterString = customWord[newIndex];
            const letterItem = alphabet.letters.find(
                (x) => x.letter.toLowerCase() === letterString.toLowerCase(),
            );
            const letter = letterItem!;

            route.params.letter = letter.letter;
            route.query.currentIndex = (currentIndexNumber + 1).toString();

            return route;
        },
    };
}

export interface WordMode {
    key: "word";
    patchQuery(
        route: RouteLocationAsRelativeGeneric,
        to: RouteLocationNormalizedLoadedGeneric,
        from: RouteLocationNormalizedLoadedGeneric,
        alphabet: Locale,
    ): RouteLocationAsRelativeGeneric;
}
