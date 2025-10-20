import { createApp } from "vue";
import { createRouterInstance } from "./router";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import { useAlphabet } from "./store";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
useAlphabet();

const router = createRouterInstance();
app.use(router);

const i18n = createI18n({
    locale: navigator.language,
    fallbackLocale: "en",
    messages: {
        en: {
            general: {
                title: "Simple letter game",
            },
            nav: {
                exitGame: "Exit game",
                startRandom: "Random",
                startAlphabetical: "Alphabetic",
            },
        },
        da: {
            general: {
                title: "Simpelt bogstav spil",
            },
            nav: {
                exitGame: "Afslut spil",
                startRandom: "Tilfældig",
                startAlphabetical: "Alfabetisk",
            },
        },
    },
});
app.use(i18n);

app.mount("#app");
