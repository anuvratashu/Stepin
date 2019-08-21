import { browser, ProtractorBrowser, Config } from 'protractor';
var path = require('path');
var glob = require("glob");

let driverPath = 'node_modules/protractor/node_modules/webdriver-manager/selenium/',
    seleniumServerPath = glob.sync(path.join(__dirname, '..', `${driverPath}selenium-server-standalone-*`))[0],
    gekoDriverPath = glob.sync(`${driverPath}geckodriver*`)[0],
    ieDriverPath = glob.sync(`${driverPath}IEDriverServer*`)[0],
    microsoftWebDriver = glob.sync(`${driverPath}MicrosoftWebDriver*`)[0];

let driverArgs = [
    `-Dwebdriver.gecko.driver=${gekoDriverPath}`
    , `-Dwebdriver.ie.driver=${ieDriverPath}`
    , `-Dwebdriver.edge.driver=${microsoftWebDriver}`
], capabilitiesMap = {
    chrome: {
        browserName: 'chrome',
        chromeOptions: {
            args: [/* '--no-sandbox',  */'disable-infobars', '--test-type=browser'],
            prefs: {
                credentials_enable_service: false,
                profile: {
                    default_content_settings: {
                        popups: 0
                    },
                    default_content_setting_values: {
                        automatic_downloads: 1
                    }
                },
                download: {
                    directory_upgrade: true,
                    default_directory: __dirname + "\\downloads"
                }
            },
            // perfLoggingPrefs: {
            //     enableNetwork: true,
            //     enablePage: false/* ,
            //     enableTimeline: false */
            //   }

        },
        loggingPrefs: {
            driver: 'SEVERE',
            server: 'SEVERE',
            browser: 'ALL',
            performance: 'ALL'
        }
    },/* 
    firefox: {
        browserName: "firefox",
        marionette: true,
    }, */
    android: {
        platformName: 'Android',
        browserName: 'chrome',
        //platformVersion: '4.4.2',
        //deviceName: 'Pixel 2 XL',
        deviceName: 'emulator-5554',
        udid: 'emulator-5554',
        nativeWebScreenshot: true,
        androidScreenshotPath: 'target/screenshots'
    }, /* ,
    ie: {
        browserName: 'internet explorer'
    },
    edge: {
        'browserName': 'MicrosoftEdge'
    } */
};

export let config: Config =
{
    seleniumAddress: 'http://localhost:4723/wd/hub',
    seleniumArgs: driverArgs,
    /* //Point to already running server
    seleniumAddress: 'http://localhost:4444/wd/hub',
    seleniumArgs: driverArgs, */

    //Start local server automatically
    // seleniumServerJar: seleniumServerPath,
    // localSeleniumStandaloneOpts: { jvmArgs: driverArgs, args: ['-log', 'logs/seleniumServer.log'] },

    // getMultiCapabilities() {
    //     // let browserToUse = "chrome";
    //     // process.argv.slice(3).forEach(arg => {
    //     //     let name = arg.split('=')[0], value = arg.split('=')[1];
    //     //     name = name.replace('--', '');

    //     //     if (name === 'browserToUse') {
    //     //         if (Object.prototype.hasOwnProperty.call(capabilitiesMap, value)) {
    //     //             browserToUse = value;
    //     //         }
    //     //     }
    //     // });
    //     // return [capabilitiesMap[browserToUse]];
    //     return capabilitiesMap
    // },

    multiCapabilities: [
        /* capabilitiesMap.chrome, */ capabilitiesMap.android
    ],

    //directConnect: true,
    SELENIUM_PROMISE_MANAGER: false,
    //restartBrowserBetweenTests: true, /*setting to true exposes the bug in the protractor/jasmine.*/
    useAllAngular2AppRoots: true,

    framework: 'jasmine2',
    plugins: [{
        path: './plugins/ConfigPlugin.js',
    }],
    allScriptsTimeout: 5 * 60000,
    getPageTimeout: 50000,

    jasmineNodeOpts: {
        defaultTimeoutInterval: 2000000,
        isVerbose: true,
        includeStackTrace: true
    },
    params: {
        baseDir: __dirname,
    },
    specs: [
        './specs/H*.js',
    ]
}