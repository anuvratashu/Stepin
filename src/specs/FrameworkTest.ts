//import { AutomationReg } from '../factory/AutomationRegistory';
import { browser, by } from "protractor";
import { wrapperElement as element } from "../framework/elementWrapper/Element-Factory"
import { Grid } from "../framework/lib/table-handlers/Grid";
import { HelperReg } from "../framework/lib/helperRegistory";
import * as fs from 'fs';

let acts = new HelperReg(),
    step = acts.allureHelpers.step.bind(acts.allureHelpers);

describe('KDI Framework Testing Testing', () => {

    beforeAll(() => {
        browser.waitForAngularEnabled(false);
    })

    beforeEach(() => {
    });

    it('Wrapper API Test', async () => {
        await step(1, "Test setp1", async () => {
            await browser.get('http://www.google.com')
            await browser.sleep(2000);
        })

        await step(2, "Test setp2", async () => {
            expect(true).toBe(false, "Test1")
            await element(by.css('input[name="q"]')).sendKeys("IMDB");
            await browser.sleep(2000)
            expect(await element(by.css('input[name="q"]')).getAttribute("value")).toBe("IMDB")
            expect(true).toBe(false, "Test2")
            await element.all(by.css('input[value="Google Search"]')).last().click();
        })
        //div[jsname="VlcLAe"] 
        await step(3, "Test setp3", async () => {
            await browser.sleep(2000);
            let tr = element(by.css('#rhs_block')).all(by.css("span")).get(3)
            expect(await tr.getText()).toBe("IMDb");
            await element.all(by.css('.r>a')).each(async (elm, ind) => console.log(ind, await elm.getText()));
            console.log(await element.all(by.css('.r>a')).baseElements.reduce(async (acc, elem) => acc + await elem.getText(), ""));
            await element.all(by.css('.r>a')).filter(async (elem, ind) => (await elem.getText()).toLowerCase().indexOf('wikipedia') > -1).first().click();

            await browser.sleep(3000)
            expect(await browser.getCurrentUrl()).toBe('https://en.wikipedia.org/wiki/IMDb');
            fs.writeFileSync('snapshot.png', await element(by.css('table[class="infobox vcard"]>tbody')).takeScreenshot(), 'base64');
            fs.writeFileSync('snapshot1.png', await element(by.css('table[class="infobox vcard"]>tbody')).takeCroppedScreenshot({ x: 10, y: 10 }, { "width": 50, "height": 100 }), 'base64');
        })
    });
});