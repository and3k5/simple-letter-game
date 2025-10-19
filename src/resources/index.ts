async function loadAudio(file: string) {
    const module = await import(`./${file}.mp3`);
    return new Audio(module.default);
}
export const wrongAudio = loadAudio('wrong');