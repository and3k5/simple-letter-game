import wrongAudioFile from "./wrong.mp3?url";
export const wrongAudio = new Audio(wrongAudioFile);

import correctAudioFile from "./correct.mp3?url";
export const correctAudio = new Audio(correctAudioFile);

import partyAudioFile from "./party.mp3?url";
export const partyAudio = new Audio(partyAudioFile);

import fartAudioFile from "./fart.mp3?url";
export const fartAudio = new Audio(fartAudioFile);

import omnomAudioFile from "./omnomnomnom.mp3?url";
export function createOmNomAudio() {
    const omnomAudio = new Audio(omnomAudioFile);
    omnomAudio.loop = true;
    return omnomAudio;
}

export { default as catOpen } from "./cat_open.png?url";
export { default as catClosed } from "./cat_closed.png?url";
