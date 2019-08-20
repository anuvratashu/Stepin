import * as cp from 'child_process';
import * as path from 'path';
import { browser, element, by, By, ElementArrayFinder, ElementFinder, protractor, promise } from "protractor";
declare const allure: any;

export class AllureHelpers {

    async attachScreenshot(name: string = 'Screenshot') {
        let png = await browser.takeScreenshot();
        return allure.createAttachment(name, () => {
            return new Buffer(png, 'base64')
        }, 'image/png')();
    }

    
    async step(step: number | string, description: string, testFunctions: Function = () => { }) {
        let self = this;
        step = typeof step === 'string' ? step : 'Step:' + step;
        allure._allure.startStep('[' + step + ']' + description);
        try {
            await testFunctions();
        }
        catch (e) {
            await self.attachScreenshot(description);
            allure._allure.endStep('failed');
            throw e
        }
        await self.attachScreenshot(description);
        allure._allure.endStep('passed');
    }


    testLink(link: string) {
        if (!!browser.params.testServer)
            link = browser.params.testServer + link
        allure.addLabel('testId', link);
    }

    bugLink(...links: string[]) {
        links.forEach((lnk) => {
            if (!!browser.params.testServer)
                lnk = browser.params.testServer + lnk
            allure.addLabel('issue', lnk);
        })
    }

    expectScreenshot = function (onFail = true) {
        var originalAddExpectationResult = jasmine['Spec'].prototype.addExpectationResult;
        jasmine['Spec'].prototype.addExpectationResult = async function () {
            let condition = onFail ? !arguments[0] : true;
            if (condition && !!arguments[1].matcherName) {
                let name = arguments[1].message.replace(/[^\w\s]/gi, '');
                name = !!name ? name : "expectations failed"
                await browser.takeScreenshot().then(png => allure.createAttachment(name, () => new Buffer(png, 'base64'), 'image/png')(),
                    err => console.log('Error while taking screenshot - ' + err.message));
            }
            return originalAddExpectationResult.apply(this, arguments);
        };
    }
}