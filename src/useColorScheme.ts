import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

function getColorScheme() {
    const localStorageValue = localStorage.getItem("color-scheme");
    if (localStorageValue) {
        if (localStorageValue === "dark" || localStorageValue === "light") {
            return {
                value: localStorageValue,
                source: "localStorage",
            };
        }
    }
    if (typeof window !== "undefined" && window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return {
                value: "dark",
                source: "browser",
            };
        }
    }
    return { value: "light", source: "browser" };
}

export const useColorScheme = defineStore("colorScheme", () => {
    const colorSchemeValue = ref(getColorScheme());

    watch(
        () => colorSchemeValue.value,
        (newScheme) => {
            if (newScheme.source !== "browser") {
                document.documentElement.setAttribute(
                    "data-theme",
                    newScheme.value,
                );
            }
        },
        { immediate: true },
    );

    const colorScheme = computed({
        get() {
            return colorSchemeValue.value.value;
        },
        set(v: "dark" | "light") {
            localStorage.setItem("color-scheme", v);
            colorSchemeValue.value = getColorScheme();
        },
    });

    return {
        colorScheme,
    };
});
