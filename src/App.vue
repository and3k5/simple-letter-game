<template>
    <header class="nav-header">
        <h1>{{ $t("general.title") }}</h1>
        <RouterLink
            custom
            :to="{ name: 'intro', query: $route.query }"
            class="back-button"
            v-slot="{ href, navigate, isActive }"
        >
            <a
                class="back-button"
                :href="
                    isActive || route.name !== 'game'
                        ? 'javascript:void(0)'
                        : href
                "
                @click="navigate"
                :aria-disabled="isActive || route.name !== 'game'"
            >
                {{ $t("nav.exitGame") }}
            </a>
        </RouterLink>
    </header>
    <RouterView></RouterView>
</template>

<style scoped>
.nav-header {
    background-color: var(--topbar-bg);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--topbar-fg);
    box-shadow: 0 2px 4px var(--shadow-color);
}

h1 {
    margin: 0;
    font-size: 1.5rem;
}

.back-button {
    background-color: var(--topbar-fg);
    color: var(--topbar-bg);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
}

.back-button:disabled,
.back-button[aria-disabled="true"] {
    opacity: 0.35;
    pointer-events: none;
}

.back-button:hover {
    background-color: #f0f0f0;
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();
</script>
