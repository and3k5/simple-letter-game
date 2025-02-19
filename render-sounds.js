const speak = require('espeak-ng').default;
const locales = require('./locales/index.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

(async function () {
    for (const [locale, {alphabet}] of Object.entries(locales)) {
        const alphabetArray = alphabet.split('');
        
        const resourcesDir = createDir(path.join(__dirname, 'resources'));
        const phrasesDir = createDir(path.join(resourcesDir, "phrases"));
        const localeDir = createDir(path.join(phrasesDir, locale));
        
        


        for (const letter of alphabetArray) {
            const audioArray = (await speak({
                arguments: ["-w", "generated", "-v", locale, letter],
            })).FS.readFile("generated");

            const hash = crypto.createHash('sha-1').update(letter).digest('hex');
            const audioPath = path.join(localeDir, `${hash}.wav`);
            fs.writeFileSync(audioPath, Buffer.from(audioArray));

            console.log(`Saved audio for ${letter} in ${localeDir}`);
        }
    }
})();
function createDir(localeDir) {

    if (!fs.existsSync(localeDir)) {
        fs.mkdirSync(localeDir);
    }
    return localeDir;
}

