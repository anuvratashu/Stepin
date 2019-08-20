import { element, by, ElementFinder, ElementArrayFinder,promise } from "protractor";
import { CommonElement, CommonArrayElements } from '../Common/Common-Elements';
import { IWrapperInterface, IWrapperArrayInterface } from "../IWrapper-Interfaces";

export class ChromeElement extends CommonElement implements IWrapperInterface {
    private myElements: ElementFinder;
    constructor(targetElement: ElementFinder, extendingElementClass: typeof ChromeElement = ChromeElement, extendingElementArrayClass: typeof ChromeArrayElements = ChromeArrayElements) {
        super(targetElement, extendingElementClass, extendingElementArrayClass);
        this.myElements = targetElement
    }
}

export class ChromeArrayElements extends CommonArrayElements implements IWrapperArrayInterface {
    private myElements: ElementArrayFinder;
    constructor(targetElements: ElementArrayFinder, extendingElementClass: typeof ChromeElement = ChromeElement, extendingElementArrayClass: typeof ChromeArrayElements = ChromeArrayElements) {
        super(targetElements, extendingElementClass, extendingElementArrayClass);
        this.myElements = targetElements;
    }
}