//import { AutomationReg } from '../factory/AutomationRegistory';
import { browser, by, protractor, ExpectedConditions as EC, promise } from "protractor";
import { wrapperElement as element } from "../framework/elementWrapper/Element-Factory"
import { Grid } from "../framework/lib/table-handlers/Grid";
import { HelperReg } from "../framework/lib/helperRegistory";
import * as fs from 'fs';
import { Service } from "../pages/Service";
import * as rest from "restler"

let acts = new HelperReg(),
    step = acts.allureHelpers.step.bind(acts.allureHelpers),
    service = new Service();
let uploadJson = {
    team: "Kongsberg Digital Software and Services",
    video: "",
    "upcoming-videos": []
}

describe('KDI Framework Testing Testing', () => {

    beforeAll(() => {
        browser.waitForAngularEnabled(false);
    })

    beforeEach(() => {
    });

    it('Youtube Test case', async () => {
        await step(1, "Test setp1", async () => {
            await browser.get('http://www.youtube.com')
            await browser.sleep(5000);
        })

        await step(2, "Test setp2", async () => {
            let searchButton = element(by.css('button.topbar-menu-button-avatar-button[aria-label="Search YouTube"]'))
            await searchButton.click();
            await element(by.css('input.searchbox-input')).sendKeys("step-inforum");
            await browser.sleep(2000)
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            await browser.sleep(4000);
            await element(by.cssContainingText('ytm-compact-channel-renderer a>h4', "STeP-IN Forum")).click();
            await browser.sleep(3000);
            await element(by.cssContainingText('div>a[role="tab"]', "Videos")).click();
            let myVideo = await service.getVideo("http://54.169.34.162:5252/video");//"Big Data Testing"
            let videoList = () => element.all(by.css("ytm-compact-video-renderer a>h4"));
            let scrollingNeeded = true;
            do {
                await browser.sleep(5000);
                let allText = await videoList().getAttribute("innerText");
                let ind = allText.indexOf(myVideo)
                if (ind > -1) {
                    await browser.executeScript('arguments[0].scrollIntoView()', videoList().get(ind).getWebElement());
                    await browser.sleep(2000);
                    await browser.executeScript('arguments[0].scrollIntoView()', videoList().get(ind).getWebElement());
                    await videoList().get(ind).trigger("click");
                    scrollingNeeded = false
                }
                else {
                    let showMore = element(by.cssContainingText("button>div", "Show more"))
                    await browser.executeScript('arguments[0].scrollIntoView()', showMore.getWebElement());
                    await browser.sleep(2000);
                    await showMore.click();
                }
            }
            while (scrollingNeeded)
            await browser.sleep(2000);
            await element(by.css('button[aria-label="Account"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText("ytm-menu-item>button", "Playback Settings")).click()
            await browser.sleep(1000)
            await element(by.css('select[id^="player-quality-dropdown"]')).click();
            await browser.actions().sendKeys(protractor.Key.UP).perform();
            await browser.actions().sendKeys(protractor.Key.UP).perform();
            await browser.actions().sendKeys(protractor.Key.UP).perform();
            await browser.sleep(2000);
            // await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            // await browser.sleep(2000);
            // await browser.actions().sendKeys(protractor.Key.ENTER).perform();
            // await browser.sleep(2000);
            await element(by.cssContainingText('div.dialog-container button>div', "OK")).click();
            let upcomingVids = (await videoList().getAttribute("innerText")) as any
            uploadJson["upcoming-videos"] = upcomingVids;
            console.log(uploadJson);
            expect(service.postJson("https://54.169.34.162.:52552/upload", "abc.json")).toBe("yf")
        })
    });

});

