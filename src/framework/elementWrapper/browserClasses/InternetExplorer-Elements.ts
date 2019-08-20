import { element, by, ElementFinder, ElementArrayFinder, browser,promise } from "protractor";
import { CommonElement, CommonArrayElements } from '../Common/Common-Elements';
import { IWrapperInterface, IWrapperArrayInterface } from "../IWrapper-Interfaces";

export class InternetExplorerElement extends CommonElement implements IWrapperInterface{
    private myElement;
    constructor(targetElement: ElementFinder) {
        super(targetElement, InternetExplorerElement, InternetExplorerArrayElements);
        this.myElement = targetElement
    }
    click() {
        return browser.executeScript("return arguments[0].click()", this.myElement.getWebElement()).then(() => { });
    }
}

export class InternetExplorerArrayElements extends CommonArrayElements implements IWrapperArrayInterface{
    private myElements;
    constructor(targetElements: ElementArrayFinder) {
        super(targetElements, InternetExplorerElement, InternetExplorerArrayElements);
        this.myElements = targetElements;
    }
}