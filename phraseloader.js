import speak from 'espeak-ng';

export async function phraseloader(locale, alphabet) {
    const alphabetArray = alphabet.split('');
    const result = [];
    for (const letter of alphabetArray) {
        const encoder = new TextEncoder();
        const data = encoder.encode(letter);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const audio = new Audio("resources/phrases/" + locale + "/" + hashHex + ".wav");
        console.log("loaded audio for " + letter);

        result.push({
            audio,
            letter,
        });
    }

    return result;
}