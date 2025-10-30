<template>
    <header class="nav-header">
        <h1>{{ $t("general.title") }}</h1>
        <input type="checkbox" id="dark-mode-toggle" v-model="darkMode" />
        <label class="visual-dark-mode-toggle" for="dark-mode-toggle">
            <span class="dot">
                <img
                    src="/src/resources/sun.png"
                    alt="Sun icon"
                    class="sun-icon"
                    style="transform: scale(1.3)"
                />
                <img
                    src="/src/resources/moon.png"
                    alt="Moon icon"
                    class="moon-icon"
                />
            </span>
        </label>
        <RouterLink
            custom
            :to="createExitGameRoute($route)"
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

<style scoped lang="scss">
@use "sass:color";
@use "variables" as *;

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
    transition: background-color var(--transition-duration) ease;
}

.back-button:disabled,
.back-button[aria-disabled="true"] {
    opacity: 0.35;
    pointer-events: none;
}

.back-button:hover {
    background-color: light-dark(
        color.scale($light-fg, $lightness: 40%),
        color.scale($dark-fg, $lightness: -20%)
    );
    color: #000;
}

#dark-mode-toggle {
    display: none;
}

.visual-dark-mode-toggle {
    --dark-mode-toggle-width: 5em;
    --dark-mode-toggle-height: 2.23em;
    width: var(--dark-mode-toggle-width);
    height: var(--dark-mode-toggle-height);
    visibility: hidden;
    position: relative;
    margin-left: auto;
    margin-right: 15px;
}

.visual-dark-mode-toggle:before {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    content: "";
    visibility: visible;
    background-color: #777;
    border-radius: var(--dark-mode-toggle-height);
    width: 100%;
    height: 100%;
    cursor: pointer;
    box-shadow: inset 0px 0px 5px 0px black;
}

#dark-mode-toggle + .visual-dark-mode-toggle > .dot {
    --padding-size: calc(var(--dark-mode-toggle-height) * 0.1);
    display: block;
    position: absolute;
    top: var(--padding-size);
    left: var(--dark-mode-toggle-height);
    margin-left: calc(var(--dark-mode-toggle-height) * -0.9);
    content: "";
    visibility: visible;
    background-color: #eee;
    border-radius: 100px;
    width: calc(var(--dark-mode-toggle-height) * 0.8);
    height: calc(var(--dark-mode-toggle-height) * 0.8);
    box-sizing: border-box;
    cursor: pointer;
    transition: left var(--transition-duration) ease-out;
    box-shadow: inset 2px -2px 10px 0px rgba(0, 0, 0, 0.1);

    user-select: none;

    .sun-icon {
        opacity: 1;
        transition: opacity var(--transition-duration) ease-out;
    }

    .moon-icon {
        opacity: 0;
        transition: opacity var(--transition-duration) ease-in;
    }
}

#dark-mode-toggle:checked + .visual-dark-mode-toggle:before {
    background-color: #0a0;
}

#dark-mode-toggle:checked + .visual-dark-mode-toggle > .dot {
    left: 100%;

    .sun-icon {
        opacity: 0;
        transition: opacity var(--transition-duration) ease-in;
    }

    .moon-icon {
        opacity: 1;
        transition: opacity var(--transition-duration) ease-out;
    }
}

.visual-dark-mode-toggle > .dot img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useColorScheme } from "./useColorScheme";
import { computed } from "vue";
import { createExitGameRoute } from "./navigation/exitGame";
const route = useRoute();
const colorScheme = useColorScheme();

const darkMode = computed({
    get() {
        return colorScheme.colorScheme === "dark";
    },
    set(value: boolean) {
        colorScheme.colorScheme = value ? "dark" : "light";
    },
});
</script>
