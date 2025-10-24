import {
    createRouter,
    createWebHashHistory,
    RouteLocationRaw,
} from "vue-router";
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
                    return alphabet.patchRoute(
                        {
                            name: "game",
                            params: {
                                locale: to.params.locale,
                                mode: to.params.mode,
                            },
                            query: to.query,
                        },
                        to,
                        from,
                    );
                },
            },
            {
                path: "/:locale/:mode/next",
                name: "next",
                redirect(to, from) {
                    const alphabet = useAlphabet();
                    alphabet.setAlphabet(to.params.locale as LocaleKey);
                    alphabet.setMode(to.params.mode as ModeKey);
                    const route = alphabet.patchRoute(
                        {
                            name: "game",
                            params: {
                                locale: to.params.locale,
                                mode: to.params.mode,
                            },
                            query: to.query,
                        },
                        to,
                        from,
                    );
                    return route;
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
                        currentIndex: route.query.currentIndex
                            ? parseInt(route.query.currentIndex as string, 10)
                            : undefined,
                    };
                },
            },
        ],
    });
}
