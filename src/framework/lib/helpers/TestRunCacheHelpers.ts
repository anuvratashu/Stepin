'use strict';
import { browser, element, by, By, ElementArrayFinder, ElementFinder } from "protractor";
var fs = require('fs');
var fs_extra = require('fs-extra');
const fileExists = require('file-exists');
var jsonfile = require('jsonfile');

//Description : Json Cache file for run time test data/info storage

export class TestRunCacheHelpers// implements IRuntimeServices
{
    private cacheFile = "";
    private readonly NO_KEY_FOUND = "NO_SUCH_KEY";

    constructor() {
        this.cacheFile = browser.params.baseDir + '/testRunCache.json';

    }

    private validateCache() {
        //let testRunCachePath = browser.params.runInfo.testRunDirectory;
        if (this.cacheFile === "") {
            console.log("validateCahe():::no testruncache file !!!!!");
            return;
        }

        if (!fs.existsSync(this.cacheFile)) {
            console.log("Run time Services ::: Test run cache directory is unavailable ! Creating the same...");
            fs_extra.ensureDir(this.cacheFile, err => {
                if (err)
                    console.log('Error while creating test-run cache directory -- ' + err) // => null
                else {
                    console.log('Test run output directory created !');
                }
            });
            browser.sleep(4000);
        }

        fileExists(this.cacheFile, (err, exists) => { // OUTPUTS: true or false

            if (exists) {
                console.log("Test run cache is present already in :" + this.cacheFile);
                return;
            }

            var runTimeCache = {
                //description :"Run-time test input cache" 
                //"browser :" + browser.browserName
                //"version :" + browser.browserVersion
                runMetadata: [
                    { description: "Run time cache for a test run" },
                    { browser: browser.browserName },
                    { version: browser.browserVersion },
                ],

                appData: [

                ],
            };

            var json = JSON.stringify(runTimeCache);
            fs.writeFileSync(this.cacheFile, json, 'utf8', (err, dt) => {
                if (err) {
                    console.log("ERROR ::: Writing to testRunCache :" + err);
                }
                else {
                    fileExists(this.cacheFile, (err, exists) => console.log("Runtime Services::createTestRunCache::Does test run cache exist ? :" + exists)) // OUTPUTS: true or false
                    console.log("Created test run cache with base contents !");
                }

            });
        });
    }

    //Description: Read the json content from run cache
    //Author : Yusuf
    //Date : from 17-May-2017 to 19-May-017

    private getValue(key: string, owningArray?: string): string {

        //let testRunCache = browser.params.runInfo.testRunDirectory;
        let returnValue = "";
        if (this.cacheFile === "") {
            console.log("getValue::::no testruncache file !!!!!");
            return "";
        }

        this.validateCache();

        //fileExists(testOutDir+'/testRunCache.json', (err, exists) => console.log("Does test run cache exist ? :"+exists)) // OUTPUTS: true or false
        return fs.readFileSync(this.cacheFile, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log("ERROR ::: Reading testRunCache :" + err);
            }
            else {
                console.log("Beginning the read operation..." + data);
                var runTimeCache = JSON.parse(data); //now it's an object
                for (var i in runTimeCache.appData) {
                    console.log("INSIDE THE READ:" + runTimeCache.appData[0]["In_Config_1"]);
                    if (runTimeCache.appData[i][key] != undefined) {
                        returnValue = runTimeCache.appData[i][key];
                        console.log("Key Value:" + runTimeCache.appData[i][key]);
                        return returnValue;
                    }
                }


            }
        });
        //return returnValue;
    }

    //Description: Write the json content into run cache
    //Author : Yusuf
    //Date : from 17-May-2017 to 19-May-017

    private writeToCache() {

        if (this.cacheFile === "") {
            console.log("writeToCache():::no testruncache file !!!!!");
            return "";
        }

        //this.validateCache();

        fs.readFileSync(this.cacheFile, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log("ERROR ::: Reading testRunCache :" + err);
            }
            else {
                console.log("PRINTING ACTUAL FILE CONTENTS:data:::" + data);
                let runTimeCache = JSON.parse(data); //now it's an object
                console.log("OBJ PRINTING:" + runTimeCache);

                var num = 9 * 2;
                runTimeCache.appData.push({ newUserID: +num, roles: "Create,Update" });
                runTimeCache.appData.push({ alternateKeyValue: +num + 20 });
                runTimeCache.appData.push({ someDynamicDateValue: "1" });


                //runTimeData.default = [{newUserID:"1",roles:"Create,Update"}];
                console.log("RUN COUNT:" + runTimeCache.runMetadata.length);
                console.log("APP COUNT:" + runTimeCache.appData.length);
                //console.log("THRU OBJ KEYS:"+Object.keys(runTimeCache.description)[0]); // NOT WORKING
                //console.log("THRU OBJ KEYS-1:"+Object.keys(runTimeCache.appData)[0]["newUserID"]); // NOT WORKING
                console.log("testRunCache:::In_Config_1:" + runTimeCache.appData[0]["In_Config_1"]);
                console.log("testRunCache:::In_Config_2:" + runTimeCache.appData[1]["In_Config_2"]);
                console.log("testRunCache:::In_Config_3:" + runTimeCache.appData[2]["In_Config_3"]);

                console.log("New User ID:" + runTimeCache.appData[3]["newUserID"]);
                console.log("AlternateKeyValue:" + runTimeCache.appData[4]["alternateKeyValue"]);
                console.log("someDynamicDateValue:" + runTimeCache.appData[5]["someDynamicDateValue"]);

                console.log("Description:" + runTimeCache.runMetadata[0]["description"]);
                console.log("Browser From Run Time Cache:" + runTimeCache.runMetadata[1]["browser"]);
                console.log("Browser Version From Run Time Cache:" + runTimeCache.runMetadata[2]["version"]);

                /*runTimeCache.appData.forEach(element => {
                                // console.log("INSIDE forEach:"+element["appData"]["newUserID"]); //NOT WORKING
                                // console.log("INSIDE forEach-1:"+element["appData"]["alternateKeyValue"]); //NOT WORKING
                                //if(element["appData"] != undefined)
                                //  console.log("INSIDE forEach:"+element["appData"]); //NOT WORKING
                                
                        console.log("INSIDE forEach:"+element); //NOT WORKING
                });*/

                var json = JSON.stringify(runTimeCache);
                fs.writeFileSync(browser.params.runInfo.testRunDirectory + '/testRunCache.json', json, 'utf8', (err, dt) => {
                    if (err) {
                        console.log("ERROR ::: Writing to testRunCache :" + err);
                    }
                    else {
                        browser.sleep(5000)
                        console.log("Updated the test run cache.");
                    }
                })//.then(()=>browser.sleep(5000));

                /* fs.writeFile(browser.params.runInfo.testRunDirectory+'/testRunCache.json',json,'utf8').then((err,dt) => {
                      if(err){
                                  console.log("ERROR ::: Writing to testRunCache :"+err);
                      }
                      else{
                              console.log("Updated the test run cache.");
                      }
                 }).then(()=>browser.sleep(5000));*/


            }
        });
    }

    /*************************************************APP DATA SECTION****************************************************************************** */
    //Description: Read the json run cache for a set of keys
    //Author : Yusuf
    //Date : from 17-May-2017 to 23-May-017, 27-May-2017, 01-Jun-2017, 06-Jun-2017

    readFrom(key: string[], array?: any, array1?: any): string[] {
        let runTimeCache = jsonfile.readFileSync(this.cacheFile);
        let returnValue: string[] = [];

        for (var j in key) {
            for (var i in runTimeCache.appData) {
                if (runTimeCache.appData[i][key[j]] != undefined) {
                    returnValue[j] = runTimeCache.appData[i][key[j]];
                    console.log("Test run cache - App data block ::: value retrieved:" + runTimeCache.appData[i][key[j]] + " for the key:" + key[j]);
                    break;
                }
            }
        }
        if (returnValue.length === 0) {
            console.log("Test run cache - App data block ::: no single key could be found :");
            for (var k in key) {
                returnValue[k] = this.NO_KEY_FOUND;
            }
        }

        for (var k in returnValue) {
            console.log("App data bock - Retrieval ::: Key:" + key[k] + " Value:" + returnValue[k]);
        }
        return returnValue;
    }


    //Description: Read the json run cache to retrive a single key value
    //Author : Yusuf
    //Date : 27-May-2017, 01-Jun-2017, 06-Jun-2017

    readKey(key: string): string {
        let runTimeCache = jsonfile.readFileSync(this.cacheFile);
        let returnValue: string = "";
        for (var i in runTimeCache.appData) {
            if (runTimeCache.appData[i][key] != undefined) {
                returnValue = runTimeCache.appData[i][key];
                console.log("Test run cache - App data block ::: value retrieved:" + runTimeCache.appData[i][key] + " for the key:" + key);
                break;
            }
        }
        if (returnValue === "") {
            returnValue = this.NO_KEY_FOUND;
            console.log("Test run cache - App data block ::: no such key is found ! Key :" + key);
        }
        return returnValue;
    }



    //Description: Write the json content into run cache
    //Author : Yusuf
    //Date : from 17-May-2017 to 23-May-017, 01-Jun-2017

    writeTo(key_Val: object[]) {
        let runTimeCache = jsonfile.readFileSync(this.cacheFile);
        for (var l in key_Val) {
            let keyPart = Object.keys(key_Val[l])[l];

            for (var i in runTimeCache.appData) {
                if (runTimeCache.appData[i][keyPart] != undefined) {
                    runTimeCache.appData.splice(parseInt(i), 1);
                    break;
                }
            }
            runTimeCache.appData.push(key_Val[l]);
        }
        jsonfile.writeFileSync(this.cacheFile, runTimeCache);
    }

    /************************************************************END OF APP DATA************************************************************************** */

    /********************************************************** *RUN DATA SECTION****************************************************************** */
    //Description: Read the json run cache for a set of keys from runData section
    //Author : Yusuf
    //Date : 31-May-2017, 06-Jun-2017

    readRunBlock(key: string[]): string[] {
        let runTimeCache = jsonfile.readFileSync(this.cacheFile);
        let returnValue: string[] = [];

        for (var j in key) {
            for (var i in runTimeCache.runData) {
                if (runTimeCache.runData[i][key[j]] != undefined) {
                    returnValue[j] = runTimeCache.runData[i][key[j]];
                    console.log("Test run cache - Run block ::: value retrieved:" + runTimeCache.runData[i][key[j]] + " for the key:" + key[j]);
                    break;
                }
            }
        }
        if (returnValue.length === 0) {
            console.log("Test run cache - Run block ::: no single key could be found :");
            for (var k in key) {
                //console.log(key[k]);
                returnValue[k] = this.NO_KEY_FOUND;
            }
        }

        for (var k in key) {
            console.log("Retrieval - Run block ::: Key:" + key[k] + " Value:" + returnValue[k]);
        }
        return returnValue;
    }


    //Description: Read the json run cache to retrive a single key value
    //Author : Yusuf
    //Date : from 31-May-2017

    readRunBlockKey(key: string): string {
        let runTimeCache = jsonfile.readFileSync(this.cacheFile);
        let returnValue: string = "";
        for (var i in runTimeCache.runData) {
            if (runTimeCache.runData[i][key] != undefined) {
                returnValue = runTimeCache.runData[i][key];
                console.log("Test run cache - Run block ::: value retrieved:" + runTimeCache.runData[i][key] + " for the key:" + key);
                break;
            }
        }
        if (returnValue === "") {
            console.log("Test run cache - Run block ::: no such key is found ! Key :" + key);
            returnValue = this.NO_KEY_FOUND;
        }
        return returnValue;
    }
}
/**************************************************************************************************************************************************** */

