<template>
    <div id="introContainer">
        <div class="settings-row">
            <div class="row-item letter-col">
                <input
                    type="radio"
                    name="letterMode"
                    id="letterMode_off"
                    class="btn-merge-checkbox"
                    value=""
                    :checked="letterMode == null || letterMode == ''"
                    @change="setLetterMode('')"
                />
                <label class="btn" for="letterMode_off" tabindex="0">Aa</label>
                <input
                    type="radio"
                    name="letterMode"
                    id="letterMode_upper"
                    class="btn-merge-checkbox"
                    value="upper"
                    :checked="letterMode == 'upper'"
                    @change="setLetterMode('upper')"
                />
                <label class="btn" for="letterMode_upper" tabindex="0">A</label>
                <input
                    type="radio"
                    name="letterMode"
                    id="letterMode_lower"
                    class="btn-merge-checkbox"
                    value="lower"
                    :checked="letterMode == 'lower'"
                    @change="setLetterMode('lower')"
                />
                <label class="btn" for="letterMode_lower" tabindex="0">a</label>
            </div>

            <input
                type="checkbox"
                id="animations"
                class="btn-merge-checkbox"
                :checked="animations !== 'off'"
                @change="setAnimations(animations !== 'off' ? 'off' : '')"
            />
            <label
                class="row-item btn"
                style="margin-left: auto"
                for="animations"
                tabindex="0"
                >{{ $t("options.animations") }}</label
            >
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
            <a href="javascript:void(0)" class="btn" @click="startCustom()">{{
                $t("nav.startCustom")
            }}</a>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "sass:color";

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

$btn-color-light: #00ff00;
$btn-color-dark: #00ff00;

.btn {
    padding: 50px;
    font-size: 5vmin;
    border: none;
    background: light-dark($btn-color-light, $btn-color-dark);
    color: #000;
    border-radius: 25px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
}

.start-buttons-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 15px;
}

.settings-row {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-items: center;
    align-items: center;
}

.letter-col {
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.settings-row > .row-item {
    flex: 1;
    padding: 20px;
    font-size: 4vmin;
    width: 120px;
}

.settings-row .btn {
    flex: 1;
    padding: 20px;
    font-size: 4vmin;
    width: 120px;
}

.btn-merge-checkbox {
    display: none;
}

.btn-merge-checkbox:not(:checked) + .btn {
    background: light-dark(
        color.scale($btn-color-light, $lightness: 55%),
        color.scale($btn-color-dark, $lightness: -55%)
    );
}
</style>

<script setup lang="ts">
import { Configuration } from "@/Configuration";
import { useI18n } from "vue-i18n";
import { RouterLink, useRouter } from "vue-router";

defineProps<Configuration>();

const router = useRouter();

function setLetterMode(mode: string) {
    router.replace({
        query: {
            ...router.currentRoute.value.query,
            letterMode: mode || undefined,
        },
    });
}

function setAnimations(mode: string) {
    router.replace({
        query: {
            ...router.currentRoute.value.query,
            animations: mode || undefined,
        },
    });
}

const i18n = useI18n();

function startCustom() {
    const word = prompt(i18n.t("prompts.enterCustomWord") as string);
    if (!word) {
        return;
    }
    router.push({
        name: "start-game",
        params: { locale: "da", mode: "word" },
        query: {
            ...router.currentRoute.value.query,
            customWord: word,
        },
    });
}
</script>
