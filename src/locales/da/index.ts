const alphabet = "abcdefghijklmnopqrstuvwxyzæøå";

export const letters = alphabet.split("").map((letter) => ({
    letter: letter,
    getFile() {
        return import(`./files/${letter}.mp3`).then((x) => x.default);
    },
}));
