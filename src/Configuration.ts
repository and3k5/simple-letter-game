import { RouteLocationNormalizedGeneric } from "vue-router";

type LetterModeValue = "upper" | "lower" | "" | undefined | null;
type AnimationValue = "off" | "on" | "" | undefined | null;

export interface Configuration {
    letterMode: LetterModeValue;
    animations: "off" | "on" | "" | null | undefined;
}

function parseLetterMode(str: string): LetterModeValue {
    switch (str) {
        case "upper":
        case "lower":
        case "":
        case null:
        case undefined:
            return str;
        default:
            throw new Error("Invalid value for letterMode");
    }
}

function parseAnimationMode(str: string): AnimationValue {
    switch (str) {
        case "on":
        case "off":
        case "":
        case undefined:
        case null:
            return str;
        default:
            throw new Error("Invalid value for animations");
    }
}

export function configurationFromRoute(
    route: RouteLocationNormalizedGeneric,
): Configuration {
    return {
        letterMode: parseLetterMode(
            route.query.letterMode as string | undefined,
        ),
        animations: parseAnimationMode(
            route.query.animations as string | undefined,
        ),
    };
}
