import { element, by, ElementFinder, ElementArrayFinder,promise } from "protractor";
import { CommonElement, CommonArrayElements } from '../common/Common-Elements';
import { IWrapperInterface, IWrapperArrayInterface } from "../IWrapper-Interfaces";

export class MicrosoftEdgeElement extends CommonElement implements IWrapperInterface{
    private myElements;
    constructor(targetElement: ElementFinder) {
        super(targetElement, MicrosoftEdgeElement, MicrosoftEdgeArrayElements);
        this.myElements = targetElement
    }
    click() {
        return this.myElements.click();
    }
}

export class MicrosoftEdgeArrayElements extends CommonArrayElements implements IWrapperArrayInterface{
    private myElements;
    constructor(targetElements: ElementArrayFinder) {
        super(targetElements, MicrosoftEdgeElement, MicrosoftEdgeArrayElements);
        this.myElements = targetElements;
    }
}