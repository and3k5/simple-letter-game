<template>
    <header class="nav-header">
        <h1>{{ $t("general.title") }}</h1>
        <RouterLink v-if="route.name === 'game'" to="/" class="back-button">
            {{ $t("nav.exitGame") }}
        </RouterLink>
    </header>
    <RouterView></RouterView>
</template>

<style scoped>
.nav-header {
    background-color: #4caf50;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    margin: 0;
    font-size: 1.5rem;
}

.back-button {
    background-color: #fff;
    color: #4caf50;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
}

.back-button:hover {
    background-color: #f0f0f0;
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();
</script>
