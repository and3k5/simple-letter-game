import { createRouter, createWebHashHistory } from "vue-router";
import Intro from "./components/Intro.vue";
import Game from "./components/Game.vue";
import { useAlphabet } from "./store";
import { LocaleKey } from "./locales/LocaleKey";
import { ModeKey } from "./game-modes/ModeKey";

export function createRouterInstance() {
    return createRouter({
        history: createWebHashHistory(),
        routes: [
            {
                path: "/",
                name: "intro",
                component: Intro,
                props(route) {
                    return {
                        letterMode: route.query.letterMode as
                            | string
                            | undefined,
                    };
                },
            },
            {
                path: "/:locale/:mode/start",
                name: "start-game",
                redirect(to, from) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    alphabet.setMode(to.params.mode as ModeKey);
                    return {
                        name: "game",
                        params: {
                            locale: to.params.locale,
                            mode: to.params.mode,
                            letter: alphabet.getNextLetter(
                                from.params.letter as string | undefined,
                            ),
                        },
                        query: to.query,
                    };
                },
            },
            {
                path: "/:locale/:mode/next",
                name: "next",
                redirect(to, from) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    alphabet.setMode(to.params.mode as ModeKey);
                    return {
                        name: "game",
                        params: {
                            locale: to.params.locale,
                            mode: to.params.mode,
                            letter: alphabet.getNextLetter(
                                from.params.letter as string | undefined,
                            ),
                        },
                        query: to.query,
                    };
                },
            },
            {
                path: "/:locale/:mode/game/:letter",
                name: "game",
                component: Game,
                beforeEnter(to, from, next) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    alphabet.setMode(to.params.mode as ModeKey);
                    next();
                },
                props(route) {
                    return {
                        locale: route.params.locale,
                        mode: route.params.mode,
                        letter: route.params.letter,
                        letterMode: route.query.letterMode as
                            | string
                            | undefined,
                    };
                },
            },
        ],
    });
}
