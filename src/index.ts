import { createApp } from "vue";
import { createRouterInstance } from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useAlphabet } from "./store";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
useAlphabet();

const router = createRouterInstance();
app.use(router);

app.mount("#app");
