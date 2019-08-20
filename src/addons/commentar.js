const fs = require('fs');
const path = require('path');

let tarGetFolder = '../specs/',
    allSpecFiles;

let myEnv = process.argv.pop();

if (!!myEnv && myEnv.length) {

    try {
        allSpecFiles = fs.readdirSync(tarGetFolder)
    }
    catch (e) {
        console.log(e);
    }

    for (let file in allSpecFiles) {
        let fileContent;

        try {
            fileContent = fs.readFileSync(path.resolve(tarGetFolder + '/' + allSpecFiles[file]), { encoding: "utf8" });
        }
        catch (e) {
            console.log(e);
        }
        let regEx = new RegExp(`\/\/Env:${myEnv}(.*?\\s?)*?\/\/EOT`, 'gm');

        let matches = fileContent.match(regEx);
        if (!!matches) {

            for (let match in matches) {
                let commentedCode = matches[match].replace(/\n/g, '\n//')

                fileContent = fileContent.replace(matches[match], commentedCode)
            }

            try {
                fs.writeFileSync(path.resolve(tarGetFolder + '/' + allSpecFiles[file]), fileContent, 'utf8');
                console.log("Commenting completed Successfully for " + myEnv + "Tests");
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}







