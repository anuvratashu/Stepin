import { ElementFinder, ElementArrayFinder } from "protractor";
// Categorising ElementFinder default apis based on their return type.
let EF_To_EAF_Func = ['$$', 'all'],
    EF_To_EF_Func = ['$', 'allowAnimations', 'clone', 'element', 'evaluate'],
    EF_Action_Func = ['clear', 'click', 'equals', 'findElement', 'findElements',
        'getAttribute', 'getCssValue', 'getDriver', 'getId', 'getInnerHtml', 'getLocation',
        'getOuterHtml', 'getRawId', 'getSize', 'getTagName', 'getText', 'getWebElement',
        'isDisplayed', 'isElementPresent', 'isEnabled', 'isPresent', 'isSelected',
        'locator', 'sendKeys', 'serialize', 'submit', 'takeScreenshot', 'then'];

// Categorising ElementArrayFinder default apis based on their return type.
let EAF_To_EAF_Func = ['$$', 'all', 'allowAnimations', 'clone', 'findElements', 'evaluate'/* , 'filter' */],
    EAF_To_EF_Func = ['count', 'findElement', 'findElements', 'first', 'get', 'last',],
    EAF_Action_Func = ['clear', 'click', /* 'each', */ 'getAttribute', 'getCssValue', 'getDriver', 'getId',
        'getInnerHtml', 'getOuterHtml', 'getRawId', 'getSize', 'getTagName', 'getText', 'getWebElements',
        'isDisplayed', 'isElementPresent', 'isEnabled', 'isPresent', 'isSelected', 'locator', /* 'map', */ 'reduce',
        'sendKeys', 'serialize', 'submit', 'takeScreenshot', 'then'];

// A function to attach ElementFinder apis to Custom ElementAction Class.
export class ElementApi {
    private target: ElementFinder;
    private Actions;
    private ArrayActions;
    constructor(targetElement, Actions, ArrayActions) {
        this.target = targetElement;
        this.Actions = Actions;
        this.ArrayActions = ArrayActions;

        EF_To_EAF_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return new this.ArrayActions(this.target[fnName].apply(this.target, args), this.Actions, this.ArrayActions);
            };
        });

        EF_To_EF_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return new this.Actions(this.target[fnName].apply(this.target, args), this.Actions, this.ArrayActions);
            };
        });

        EF_Action_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return this.target[fnName].apply(this.target, args);
            };
        });
    }
};

// A function to attach ElementArrayFinder apis to Custom ElementArrayAction Class.
export class ElementArrayApi {
    private allTarget: ElementArrayFinder;
    private Actions;
    private ArrayActions;
    constructor(targetElements, Actions, ArrayActions) {
        this.allTarget = targetElements;
        this.Actions = Actions;
        this.ArrayActions = ArrayActions;
        let self = this

        EAF_To_EAF_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return new this.ArrayActions(this.allTarget[fnName].apply(this.allTarget, args), this.Actions, this.ArrayActions);
            };
        });

        EAF_To_EF_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return new this.Actions(this.allTarget[fnName].apply(this.allTarget, args), this.Actions, this.ArrayActions);
            };
        });

        EAF_Action_Func.forEach(fnName => {
            this[fnName] = (...args) => {
                return this.allTarget[fnName].apply(this.allTarget, args);
            };
        });

        //Overriding filter api to provide ElementAction instance to callback insted of ElementFinder instance.
        this['filter'] = filterFn => {
            return new this.ArrayActions(this.allTarget.filter(function () {
                return filterFn(new self.Actions(arguments[0], self.Actions, self.ArrayActions), arguments[1]);
            }), this.Actions, this.ArrayActions);
        };

        //Overriding map api to provide ElementAction instance to callback insted of ElementFinder instance.
        this['map'] = mapFn => {
            return this.allTarget.map(function () {
                return mapFn(new self.Actions(arguments[0], self.Actions, self.ArrayActions), arguments[1]);
            });
        };

        //Overriding map api to provide ElementAction instance to callback insted of ElementFinder instance.
        this['each'] = eachFn => {
            return this.allTarget.each(function () {
                return eachFn(new self.Actions(arguments[0], self.Actions, self.ArrayActions), arguments[1]);
            });
        };

        // //Overriding reduce api to provide ElementAction instance to callback insted of ElementFinder instance.
        // this['reduce'] = reduceFn => {
        //     return this.allTarget.reduce(function () {
        //         return reduceFn(arguments[1], new self.Actions(arguments[0], self.Actions, self.ArrayActions));
        //     }, arguments[1]);
        // };
    }
};