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

it('addstore::Adding data to store', async () => {

    //browser.ignoreSynchronization=true
    await browser.get("https://www.youtube.com")
    await browser.wait(EC.visibilityOf(element(by.id("search")).baseElement), 50000)
    await element(by.id("search")).sendKeys("Step-inforum")
    await element(by.id("search-icon-legacy")).click()
    await browser.wait(EC.visibilityOf(element(by.linkText("STeP-IN Forum")).baseElement), 50000)
    await element(by.linkText("STeP-IN Forum")).click()
    await browser.wait(EC.visibilityOf(element(by.cssContainingText('div[class="tab-content style-scope paper-tab"]', "Videos")).baseElement), 50000)
    await element(by.cssContainingText('div[class="tab-content style-scope paper-tab"]', "Videos")).click();
    let myVideo = await service.getVideo("http://54.169.34.162:5252/video");//"Big Data Testing"
})

// //browser.executeScript('arguments[0].scrollIntoView(true)', ele.getWebElement())

it('Scroll into the video view', async () => {
    //browser.ignoreSynchronization=true
    await browser.get("https://www.youtube.com/watch?v=KFjt-QIwkPg")
    await browser.sleep(10000)

    let size = await element(by.tagName("video")).getSize()

    let xaxis = size.width
    let yaxis = size.height
    console.log(xaxis, yaxis)
    await browser.actions().mouseMove(element(by.tagName("video")), { x: xaxis - 130, y: yaxis - 10 }).click().perform();
    await browser.sleep(5000)
    await browser.actions().mouseMove(element(by.tagName("video")), { x: xaxis - 130, y: yaxis - 60 }).click().perform();
    await browser.sleep(5000)
    await browser.actions().mouseMove(element(by.tagName("video")), { x: xaxis - 130, y: yaxis - 170 }).click().perform();
})