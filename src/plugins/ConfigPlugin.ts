import { ProtractorPlugin } from 'protractor/built/plugins';
import { browser } from 'protractor';
import * as path from 'path';
import * as fs from 'fs';
import * as system from 'util';
import * as child_process from 'child_process';
import * as fileExists from 'file-exists';
import * as jasmineReporter from 'jasmine-reporters';
import * as SanitizeFilename from 'sanitize-filename';
import { TrosPlugin } from './TrosPlugin';
import { IEnvDetails } from 'kognifai-login';
import io from 'socket.io-client';
import { RealtimeReporter } from './RealtimeReporter';
declare const allure: any;

let snLogger = require('simple-node-logger').createSimpleFileLogger('./logs/protractor.log'),
    exec = child_process.exec;

/** Overrides the standard output and error streams to add writing to logs */
let stdOutOverload = (infoCB: Function, errCB: Function): void => {

    /** Formats the string for the logs by removing colorcodes and adding specified spacing */
    let orgStdOut = process.stdout.write,
        orgStdErr = process.stderr.write,
        format = (str: string, spaces: number): string => {
            str = str.replace(/\\[\d{1,2}m/g, '');
            let lines = (str || '').split('\n');
            let arr = [];
            for (var i = 0; i < spaces; i++) {
                arr.push(' ');
            }
            return lines.join('\n' + arr.join(''));
        };

    process.stdout.write = function () {
        orgStdOut.apply(this, arguments);
        return infoCB(format(arguments[0], 19));
    }
    process.stderr.write = function () {
        orgStdOut.apply(this, arguments);
        return errCB(format(arguments[0], 19));
    }
};

let configPlugin: ProtractorPlugin = {

    onPrepare: () => {
        snLogger.info('\n\n================================= Execution Started ======================= ' + new Date().toDateString() + '==================================\n\n');

        stdOutOverload(snLogger.info, snLogger.error);

        exec("RD /S /Q allure-results", function (error, stdout, stderr) {
            system.puts(stdout)
        });

        let testOutDir = browser.params.baseDir;

        browser.getCapabilities().then(cap => {
            if (cap.get('platformName') !== "Android" || cap.get('platformName') !== "ios")
                browser.manage().window().maximize();

            jasmine.getEnv().addReporter(new jasmineReporter.JUnitXmlReporter({
                consolidateAll: true,
                useDotNotation: false,
                savePath: path.join(browser.params.baseDir, 'reports/', cap.get("browserName"), '/jUnit')
            }));

            var AllureReporter = require('jasmine-allure-reporter');
            jasmine.getEnv().addReporter(new AllureReporter({
                resultsDir: cap.get("browserName") + '/allure-results'
            }));
        })
        browser.manage().timeouts().implicitlyWait(5000);

        // var AllureReporter = require('jasmine-allure-reporter');
        // jasmine.getEnv().addReporter(new AllureReporter({
        //     resultsDir: 'allure-results'
        // }));

        // jasmine.getEnv().addReporter(new jasmineReporter.JUnitXmlReporter({
        //     consolidateAll: true,
        //     useDotNotation: false,
        //     savePath: path.join(browser.params.baseDir, 'reports/jUnit')
        // }));

        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: true }));

        // //region videoReporter
        // var VideoReporter = require('protractor-video-reporter-custom');
        // jasmine.getEnv().addReporter(new VideoReporter({
        //     baseDirectory: path.join(browser.params.baseDir, '../allure-results/videos/')
        // }));

        // //Adding videos to allure description
        // jasmine.getEnv().addReporter({
        //     specDone: function (result) {
        //         if (result.status == 'passed' || result.status == 'failed') {
        //             //if (result.failedExpectations.length > 0)//To see videos only in case of failure
        //             allure.description('<p>Execution Preview:</p><video width="320" height="180" controls><source src="videos/' + SanitizeFilename(result.fullName + '.mp4') + '" type="video/mp4">Your browser does not support the video tag.</video>');
        //         }
        //     }
        // });

        jasmine.getEnv().addReporter(new RealtimeReporter(new URL("http://localhost:3000/")));

        //endregion

        // var runTimeCache = {
        //     runMetadata: [
        //         { description: "Run time cache for a test run" }
        //     ],
        //     appData: [],
        // };

        // var json = JSON.stringify(runTimeCache);
        // fs.writeFile(testOutDir + '/testRunCache.json', json, 'utf8', (err) => {
        //     if (err) {
        //         console.log("ERROR ::: Writing to testRunCache :" + err);
        //     }
        //     else {
        //         fileExists(testOutDir + '/testRunCache.json', (err, exists) => console.log("Does test run cache exist ? :" + exists)) // OUTPUTS: true or false
        //         console.log("Created test run cache with base contents !");
        //     }

        // });

        beforeAll(() => {
            //Setting up environment for logging in
            let tenant1: IEnvDetails = {
                host: { aad: true, url: "https://vitenant1.kognifailabs.com" },
                defaultUser: { userId: "automationtestuser@vitenant1.onmicrosoft.com", password: "Yobo47091" }
            }
            let login = require('kognifai-login').login;
            let envIsSet = false;
            process.argv.slice(3).some(arg => {
                let name = arg.split('=')[0], value = arg.split('=')[1];
                name = name.replace('--', '');
                if (name === 'setenv') {
                    login.setEnvironment(value);
                    envIsSet = true;
                    return true;
                }
                return false;
            })
            if (!envIsSet)
                login.setEnvironment("DOVES")
        })
    }
};

module.exports = configPlugin;
