import { element, by, ElementFinder, ElementArrayFinder,promise } from "protractor";
import { CommonElement, CommonArrayElements } from '../Common/Common-Elements';
import { IWrapperInterface, IWrapperArrayInterface } from "../IWrapper-Interfaces";

export class FirefoxElement extends CommonElement implements IWrapperInterface{
    private myElements;
    constructor(targetElement: ElementFinder) {
        super(targetElement, FirefoxElement, FirefoxArrayElements);
        this.myElements = targetElement
    }
}

export class FirefoxArrayElements extends CommonArrayElements implements IWrapperArrayInterface{
    private myElements;
    constructor(targetElements: ElementArrayFinder) {
        super(targetElements, FirefoxElement, FirefoxArrayElements);
        this.myElements = targetElements;
    }
}