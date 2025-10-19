const alphabet = "abcdefghijklmnopqrstuvwxyzæøå"

export const letters = alphabet.split('').map(letter => ({
    letter: letter,
    file: import(`./files/${letter}.mp3`),
}));