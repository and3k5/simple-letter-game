<template>
    <div id="introContainer">
        <div class="settings-row">
            <input
                type="radio"
                name="letterMode"
                id="letterMode_off"
                class="btn-merge-checkbox"
                value=""
                :checked="letterMode == null || letterMode == ''"
                @change="setLetterMode('')"
            />
            <label class="btn" for="letterMode_off"> A a </label>
            <input
                type="radio"
                name="letterMode"
                id="letterMode_upper"
                class="btn-merge-checkbox"
                value="upper"
                :checked="letterMode == 'upper'"
                @change="setLetterMode('upper')"
            />
            <label class="btn" for="letterMode_upper"> A </label>
            <input
                type="radio"
                name="letterMode"
                id="letterMode_lower"
                class="btn-merge-checkbox"
                value="lower"
                :checked="letterMode == 'lower'"
                @change="setLetterMode('lower')"
            />
            <label class="btn" for="letterMode_lower"> a </label>
        </div>

        <div class="start-buttons-row">
            <RouterLink
                :to="{
                    name: 'start-game',
                    params: { locale: 'da', mode: 'random' },
                    query: $route.query,
                }"
                custom
                v-slot="{ href, navigate }"
            >
                <a
                    id="startButton"
                    class="btn"
                    :href="href"
                    @click="navigate"
                    >{{ $t("nav.startRandom") }}</a
                >
            </RouterLink>
            <RouterLink
                :to="{
                    name: 'start-game',
                    params: { locale: 'da', mode: 'alphabetical' },
                    query: $route.query,
                }"
                custom
                v-slot="{ href, navigate }"
            >
                <a
                    id="startButton"
                    class="btn"
                    :href="href"
                    @click="navigate"
                    >{{ $t("nav.startAlphabetical") }}</a
                >
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
#introContainer {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 15px;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    padding: 15px;
}

.btn {
    padding: 50px;
    font-size: 5vmin;
    border: none;
    background: #00ff00;
    color: #000;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.start-buttons-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.settings-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    justify-items: center;
}

.settings-row .btn {
    padding: 20px;
    font-size: 4vmin;
    width: min-content;
    aspect-ratio: 1/1;
}

.btn-merge-checkbox {
    display: none;
}

.btn-merge-checkbox:not(:checked) + .btn {
    background: #007700;
}
</style>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

defineProps<{
    letterMode: string | null | undefined;
}>();

const router = useRouter();

function setLetterMode(mode: string) {
    router.replace({
        query: {
            ...router.currentRoute.value.query,
            letterMode: mode || undefined,
        },
    });
}
</script>
