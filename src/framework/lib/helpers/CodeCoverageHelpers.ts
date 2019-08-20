import { browser, protractor, promise } from "protractor";
import * as fs from 'fs';
import * as path from 'path';

export class CodeCoverageHelpers {

    saveCoverage = (fileName = "codeCoverage", folderPath: string) => {
        return browser.driver.executeScript("function () { if (typeof window['__coverage__'] != 'undefined') { return Object.keys(window['__coverage__']); } }")
            .then((covKeys: {}) => {
                let allKeys = [], covObj = {};
                for (let objKey in covKeys)
                    allKeys.push(browser.driver.executeScript("function () { return window['__coverage__'][arguments[0]]; }, covKeys[objKey]"));
                return protractor.promise.all(allKeys)
                    .then(allVals => {
                        for (let key in covKeys)
                            covObj[covKeys[key]] = allVals[key];
                        if (!fs.existsSync(folderPath))
                            fs.mkdirSync(folderPath)
                        fs.writeFileSync(path.join(folderPath, fileName + ".json"), JSON.stringify(covObj));
                        return covObj;
                    })
            })
    }

    preserveCoverage = (fileName = "codeCoverage", folderPath: string) => {
        let filePath = path.join(folderPath, fileName + ".json");
        if (fs.existsSync(filePath))
            return browser.driver.executeScript("function () { return (typeof window['__coverage__'] != 'undefined') }")
                .then(covExist => {
                    if (covExist) {
                        let myStoredCoverage = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' })),
                            myCoverageKeys = Object.keys(myStoredCoverage), allKeys = [];

                        for (let key in myCoverageKeys)
                            allKeys.push(browser.driver.executeScript("function () { window['__coverage__'][arguments[0]] = arguments[1]; }, myCoverageKeys[key], myStoredCoverage[myCoverageKeys[key]]"));
                        return protractor.promise.all(allKeys);
                    }
                });
        else
            console.log("Coverage file not present");
    }
}