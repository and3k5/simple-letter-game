import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { mount } from "@vue/test-utils";
import Game from "../Game.vue";
import { useAlphabet } from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import { createHookHelper } from "@/utils/hook-helper";
import { userEvent } from "vitest/browser";

vi.mock("@/store", () => ({
    useAlphabet: vi.fn(),
    useEffectState: vi.fn().mockReturnValue({ counter: 0 }),
}));

vi.mock("@tsparticles/confetti", () => ({
    confetti: vi.fn(),
}));

describe("Game.vue", () => {
    let router;

    beforeEach(() => {
        vi.clearAllMocks();
        router = createRouter({
            history: createWebHistory(),
            routes: [
                { name: "next", path: "/:locale/next", redirect: undefined },
            ],
        });

        const mockAlphabet = {
            setAlphabet: vi.fn(),
            getLetterItem: vi.fn().mockReturnValue({
                letter: "A",
                getFile: vi.fn().mockResolvedValue("test.mp3"),
            }),
            containsLetter: vi.fn().mockReturnValue(true),
        };
        (useAlphabet as unknown as Mock).mockReturnValue(mockAlphabet);
    });

    it("displays the letter in upper and lower case", () => {
        const wrapper = mount(Game, {
            props: {
                locale: "da",
                letter: "A",
            },
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.text()).toContain("A a");
    });

    it("sets correct indicator when correct key is pressed", async () => {
        const spyObj = { guessedLetter() {} };
        const guessedLetterMock = vi
            .spyOn(spyObj, "guessedLetter")
            .mockImplementation(() => {});

        const hook = createHookHelper();
        const hookSpy = vi.spyOn(hook, "set");

        const wrapper = mount(Game, {
            props: {
                locale: "da",
                letter: "A",
                hook: hook,
                "onGuessed-letter": function () {
                    spyObj.guessedLetter();
                },
            },
            global: {
                plugins: [router],
            },
        });

        expect(hookSpy).toBeCalledWith("created");
        expect(hookSpy).toBeCalledWith("mounted");

        const letterContainer = wrapper.get("#letterContainer");

        await userEvent.keyboard("A");
        console.log(hook.getHistory());
        expect(hookSpy).toBeCalledWith("keydown:A");
        expect(hookSpy).toBeCalledWith("handle correct letter");
        expect(guessedLetterMock).toBeCalled();
        expect(letterContainer.classes()).toContain("correct");
    });

    it("sets wrong indicator when wrong key is pressed", async () => {
        const hook = createHookHelper();
        const hookSpy = vi.spyOn(hook, "set");

        const wrapper = mount(Game, {
            props: {
                locale: "da",
                letter: "A",
                hook: hook,
            },
            global: {
                plugins: [router],
            },
        });

        expect(hookSpy).toBeCalledWith("created");
        expect(hookSpy).toBeCalledWith("mounted");

        const letterContainer = wrapper.get("#letterContainer");

        await userEvent.keyboard("B");
        console.log(hook.getHistory());
        expect(hookSpy).toBeCalledWith("keydown:B");
        expect(hookSpy).toBeCalledWith("handle wrong letter");
        expect(letterContainer.classes()).toContain("wrong");
    });

    // it("plays audio when mounted", async () => {
    //     const audioPlayMock = vi
    //         .spyOn(window.Audio.prototype, "play")
    //         .mockImplementation(() => {});

    //     mount(Game, {
    //         props: {
    //             locale: "da",
    //             letter: "A",
    //         },
    //         global: {
    //             plugins: [router],
    //         },
    //     });

    //     expect(audioPlayMock).toHaveBeenCalled();
    // });

    // it("repeats sound on space key press", async () => {
    //     const wrapper = mount(Game, {
    //         props: {
    //             locale: "da",
    //             letter: "A",
    //         },
    //         global: {
    //             plugins: [router],
    //         },
    //     });

    //     const audioPlayMock = vi
    //         .spyOn(window.Audio.prototype, "play")
    //         .mockImplementation(() => {});
    //     await userEvent.keyboard("{Space}");
    //     await userEvent.keyboard("{/Space}");
    //     expect(audioPlayMock).toHaveBeenCalled();
    // });
});
