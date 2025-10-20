import { createRouter, createWebHashHistory } from "vue-router";
import Intro from "./components/Intro.vue";
import Game from "./components/Game.vue";
import { useAlphabet } from "./store";
import { LocaleKey } from "./locales/LocaleKey";

export function createRouterInstance() {
    return createRouter({
        history: createWebHashHistory(),
        routes: [
            {
                path: "/",
                name: "intro",
                component: Intro,
            },
            {
                path: "/:locale/start",
                name: "start-game",
                redirect(to) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    return {
                        name: "game",
                        params: {
                            locale: to.params.locale,
                            letter: alphabet.pullRandomLetter(),
                        },
                    };
                },
            },
            {
                path: "/:locale/next",
                name: "next",
                redirect(to) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    return {
                        name: "game",
                        params: {
                            locale: to.params.locale,
                            letter: alphabet.pullRandomLetter(),
                        },
                    };
                },
            },
            {
                path: "/:locale/game/:letter",
                name: "game",
                component: Game,
                props(route) {
                    return {
                        locale: route.params.locale,
                        letter: route.params.letter,
                    };
                },
            },
        ],
    });
}
