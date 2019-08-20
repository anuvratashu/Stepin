import { ElementFinder, ElementArrayFinder, promise, ElementHelper, WebDriver, WebElement, WebElementPromise } from "protractor";
import { By } from 'selenium-webdriver';
export interface IWrapperInterface {
    baseElement: ElementFinder

    highlight(): promise.Promise<any>

    /**
   * Take a screenshot of the visible region encompassed by this element's
   * bounding rectangle.
   *
   * @param startLocation Coordinates relavite to the Target Element.
   * @param cropSize Size of the image to be cropped out.
   * @return {!Promise<string>} A promise that will be
   *     resolved to the screenshot as a base-64 encoded PNG.
   */
    takeCroppedScreenshot(startLocation: {
        x: number;
        y: number;
    }, cropSize: {
        width: number;
        height: number;
    }): Promise<string>

    trigger(eventName: string): promise.Promise<any>;
}


export interface IWrapperArrayInterface {
    baseElements: ElementArrayFinder

    selectMatching(value: string): promise.Promise<any>;
}
