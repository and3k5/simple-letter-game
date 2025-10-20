<template>
    <div id="introContainer">
        <RouterLink
            :to="{ name: 'start-game', params: { locale: 'da' } }"
            custom
            v-slot="{ href, navigate }"
        >
            <a id="startButton" :href="href" @click="navigate">Start</a>
        </RouterLink>
    </div>
</template>

<style scoped>
#introContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 50svh;
    font-family: sans-serif;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

#startButton {
    padding: 50px;
    font-size: 200px;
    border: none;
    background: #00ff00;
    color: #000;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
}
</style>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
