import * as fs from 'fs';
import * as path from 'path';
let AdmZip = require('adm-zip');
let glob = require("glob");

export class FileSystemHelpers {
    /** 
     * Removes the secified directory
     * @returns {void}
    */
    removeDir(path: string) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(file => {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) // recurse
                    this.removeDir(curPath);
                else  // delete file
                    fs.unlinkSync(curPath);
            });
            fs.rmdirSync(path);
        }
    }

    listFiles(filePath, zippedFile?: boolean) {
        let myPath = path.resolve(filePath);
        if (zippedFile) {
            let zip = new AdmZip(filePath), entries: string[] = [];
            zip.getEntries().forEach(function (zipEntry) {
                if (zipEntry.entryName != "undefined")
                    entries.push(zipEntry.entryName)
            });
            return entries;
        }
        return fs.readdirSync(myPath);
    }

    filesSearch = (pathPattern: string) => {
        let myPath = path.resolve(pathPattern),
            filesArray = glob.sync(myPath);
        if (typeof filesArray !== 'undefined' && filesArray.length > 0) {
            return <Array<string>>filesArray;
        }
    }
}