<template>
    <div id="introContainer">
        <RouterLink
            :to="{
                name: 'start-game',
                params: { locale: 'da', mode: 'random' },
            }"
            custom
            v-slot="{ href, navigate }"
        >
            <a id="startButton" :href="href" @click="navigate">{{
                $t("nav.startRandom")
            }}</a>
        </RouterLink>
        <RouterLink
            :to="{
                name: 'start-game',
                params: { locale: 'da', mode: 'alphabetical' },
            }"
            custom
            v-slot="{ href, navigate }"
        >
            <a id="startButton" :href="href" @click="navigate">{{
                $t("nav.startAlphabetical")
            }}</a>
        </RouterLink>
    </div>
</template>

<style scoped>
#introContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    padding: 15px;
}

#startButton {
    padding: 50px;
    font-size: 70px;
    border: none;
    background: #00ff00;
    color: #000;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
}
</style>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
