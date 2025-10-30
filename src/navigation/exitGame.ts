import { RouteLocationNormalizedLoadedGeneric } from "vue-router";

export function createExitGameRoute(
    route: RouteLocationNormalizedLoadedGeneric,
) {
    return { name: "intro", query: exitQuery(route.query) };
}

function exitQuery(query: Record<string, string | string[] | undefined>) {
    const newQuery: Record<string, string | string[] | undefined> = {
        ...query,
    };
    delete newQuery.letterMode;
    delete newQuery.currentIndex;
    delete newQuery.customWord;
    return newQuery;
}
