import { element, browser, ElementFinder, ElementArrayFinder, Locator } from "protractor";
import { IElementWrapper, IElementArrayWrapper } from './common/core/IElement-Wrapper';
import { ChromeElement, ChromeArrayElements } from './browserClasses/Chrome-Elements';
import { FirefoxElement, FirefoxArrayElements } from './browserClasses/Firefox-Elements';
import { InternetExplorerElement, InternetExplorerArrayElements } from './browserClasses/InternetExplorer-Elements';
import { MicrosoftEdgeElement, MicrosoftEdgeArrayElements } from './browserClasses/MicrosoftEdge-Elements';
let deasync = require('deasync');

let getBrowser = () => {
    let browserName;
    browser.driver.getCapabilities().then(capabilities => { browserName = capabilities.get("browserName") });
    deasync.loopWhile(() => typeof browserName === 'undefined');
    return browserName;
}

let getElementType = () => {
    let elementType = { CustomElement: null, CustomArrayElements: null }
    let browserName = getBrowser();
    switch (browserName.toLowerCase()) {
        case "chrome":
            console.log("Chrome Wrapper Initialised...");
            elementType.CustomElement = ChromeElement;
            elementType.CustomArrayElements = ChromeArrayElements;
            break;
        case "firefox":
            console.log("Firefox Wrapper Initialised...");
            elementType.CustomElement = FirefoxElement;
            elementType.CustomArrayElements = FirefoxArrayElements;
            break;
        case "internet explorer":
            console.log("Internet Explorer Wrapper Initialised...");
            elementType.CustomElement = InternetExplorerElement;
            elementType.CustomArrayElements = InternetExplorerArrayElements;
            break;
        case "microsoftedge":
            console.log("Microsoft Edge Wrapper Initialised...");
            elementType.CustomElement = MicrosoftEdgeElement;
            elementType.CustomArrayElements = MicrosoftEdgeArrayElements;
            break;
        default:
            console.log("Default Chrome Wrapper Initialised...");
            elementType.CustomElement = ChromeElement;
            elementType.CustomArrayElements = ChromeArrayElements;
            break;
    }
    return elementType;
}

let ElementWrapper: { new(targetElement: ElementFinder): IElementWrapper }, ElementArrayWrapper: { new(targetElements: ElementArrayFinder): IElementArrayWrapper };

let wrapperElement = (function buildElementHelper() {
    let myElement, types = getElementType();
    myElement = ((locator: Locator) => {
        ElementWrapper = types.CustomElement;
        return new types.CustomElement(element(locator));
    });
    myElement.all = (locator: Locator) => {
        ElementArrayWrapper = types.CustomArrayElements;
        return new types.CustomArrayElements(element.all(locator));
    };
    return myElement as {
        (locator: Locator): IElementWrapper;
        all: (locator: Locator) => IElementArrayWrapper;
    };
})();

export { wrapperElement, ElementWrapper, ElementArrayWrapper };

