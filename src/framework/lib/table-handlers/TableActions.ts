import { browser, element, by, By, ElementFinder, ElementArrayFinder, protractor, promise } from "protractor";
import * as fs from 'fs'
import { TableActions, ConfirmationOptions, WebBrowser, ImageFolder } from "./Enums";
declare const allure: any;
let EC = protractor.ExpectedConditions;

export class TableActionParams {
    rowCollection: ElementArrayFinder;
    searchText: string;
    searchColumn: number;
    actionColumn: number;
    actionName: TableActions;
    textForValidation: string;
    handleCellChild: boolean = false;
    tagName: string
}

export class CacheStore {
    value: string = "";
}

export interface ITableActionInputs {
    searchInColumn(searchColumn: number): ITableActionInputs;
    usingTheText(searchText: string): ITableActionInputs;
    actionInColumn(actionCol: number): ITableActionInputs;
    performAction(action: string): ITableActionInputs;

}


export class Actions {   //converted the class to abstract and implementing IBrowserActions on 10-May-2017

    private tblActionInputs__: TableActionParams;



    get tableActionInputs(): TableActionParams {
        if (this.tblActionInputs__ === undefined) {
            this.tblActionInputs__ = new TableActionParams();
        }
        return this.tblActionInputs__;
    }

    elementToSync: ElementFinder;

    constructor(elementctor?: ElementFinder) {
        if (elementctor != undefined) {
            this.elementToSync = elementctor;
        }
    }



    /*********************************************************************************************************************************************************************************** */

    /*Author      : Yusuf
      Date        : 08-Mar-2017
      Description : Used to hold the Protractor execution until the specified element is visible or timeout occurs. This is a variant of syncForVisibility function.*/
    waitForVisibility(locator, time?: number) {
        return browser.wait(EC.visibilityOf(locator), time || 45000)
    }

    waitForInVisibility(locator, time?: number) {
        return browser.wait(EC.invisibilityOf(locator), time || 30000)
    }

    isClickable(locator, time?: number) {
        browser.wait(EC.elementToBeClickable(locator), time || 15000)
    }

    /****************************************************************************************************************************************************************************************/

    /** 
     * Runs searching the specified text and performs the specified action on the element collection 
     * that have been transformed from a set of independent elements into a collection of rows.
     * @returns {void}
    */
    //Author : Yusuf
    //Date   : 20-Mar-2017
    RunTableAction_(tblActionInputs: TableActionParams): boolean {
        let locidx = 0;
        let cnt: number;
        let result = true;

        try {
            this.getMatchingRows(tblActionInputs.rowCollection, tblActionInputs.searchColumn, tblActionInputs.searchText).then(filteredElem => {
                if (tblActionInputs.handleCellChild) {
                    this.DetermineAndExecuteAction(filteredElem[0].element(by.xpath("./descendant::button[" + tblActionInputs.actionColumn + "]")), tblActionInputs);
                }
                else
                    this.DetermineAndExecuteAction(filteredElem[0], tblActionInputs);
                browser.sleep(2000);
            });
        }
        catch (e) { console.log(e); result = false; }
        return result;
    }

    /****************************************************************************************************************************************************************************************/

    /** 
     * Runs searching the specified text and performs the specified action on the element collection 
     * that have been transformed from a set of independent elements into a collection of rows.
     * @returns {void}
    */
    //Author : Yusuf
    //Date   : 20-Mar-2017
    RunTableActionWithRowAndCol(rowCollection: ElementArrayFinder, rowIndex: number, colIndex: number, action: TableActions) {
        let locrowidx = 0;
        let result = true;

        try {
            let locidx = 0;
            let cnt: number;
            let result: boolean = false;
            //console.log("Exec-2"+rowCollection.count().then(inc => {console.log(inc);}));
            let c1 = 0;
            return rowCollection.filter(rowel => {

                locrowidx++;
                // console.log("locrowidx:"+locrowidx);
                // if(rowIndex === locrowidx)
                //{
                // console.log("Inside RunTableActionWithRowAndCol-1 :---"+rowCollection.count().then(inc => {console.log(inc);}));


                //console.log("Inside RunTableActionWithRowAndCol-2 :---"+ targetRow.count().then(inc1 => {console.log(inc1);}));
                //rowel.all(by.xpath("/div/div")).each( b => 

                let coll = rowel.findElement(by.tagName("div")).findElements(by.tagName("div")).then(l => {

                    l.forEach(el => {
                        c1++;
                        if (c1 === 5) {
                            //el.findElement(by.tagName("input")).click();
                            browser.executeScript("return arguments[0].click()", el.findElement(by.tagName("input")));
                        }
                    });


                });
                return true;
            })





            /*let tmp1 = colColl.then(vl => {
                var k=0;
                if(vl.length <= 0 )
                {
                   while(vl.length > 0)
                   {
                       browser.sleep(1000);
                       if(k >= 60)
                       {
                           console.log("Not got te right val");
                           break;
                       }
                       continue;
                   }
                }
            })*/





        }
        catch (e) { console.log(e); result = false; }
        return result;
    }

    /********************************************************************************************************************************************************* */

    /** 
     * Replaces the search value with replace value in the specified locator value
     * and applies the transformed locator to return a run time element.
     * @returns {ElementFinder}
    */
    //Author : Yusuf
    //Date   : 03-Apr-2017
    getRunTimeElement(locatorValue: string, searchVal: string, replaceVal: string): ElementFinder {
        let locator = locatorValue.replace(searchVal, replaceVal);
        return element(by.xpath(locator));
    }

    selectMatchingElement(value: string, rangeValues: ElementArrayFinder) {
        let elem = rangeValues.filter(elem => {
            return elem.getText().then(result => {
                return result === value;
            });
        }).first()
        browser.executeScript("return arguments[0].click()", elem.getWebElement());
    }

    getRunTimeElements(locatorValue: string, searchVal: string, replaceVal: string): ElementArrayFinder {

        let locator = locatorValue.replace(searchVal, replaceVal);
        return element.all(by.xpath(locator));
    }


    /**     
     * Replaces the search value with replace value in the specified locator value
     * and applies the transformed locator to return a run time element.
     * @returns {ElementFinder}
    */
    //Author : Anuvrat
    //Date   : 05-Apr-2017
    performTableActions(tableActionInputs: TableActionParams) {

        tableActionInputs.rowCollection.each(row => {
            row.all(by.xpath("./descendant::" + tableActionInputs.tagName + "[" + tableActionInputs.actionColumn + "]"))
                .each(col => {
                    col.isDisplayed()
                        .then(isDisplay => {
                            if (isDisplay) {
                                this.DetermineAndExecuteAction(col, tableActionInputs);
                            }
                        });
                });
        });
    }

    /*********************************************************************************************************************************************************************************** */
    

    




    /*********************************************************************************************************************************************************************************** */

    /******************************************************************************************************************************************************* */


    private getMatchingRows(rowCollection: ElementArrayFinder, searchColumn: number, searchText: string): ElementArrayFinder {

        return rowCollection.filter(el => {
            return el.element(by.xpath('./descendant::button[' + searchColumn + ']')).getText()
                .then(elName => {
                    if (searchText != undefined) {
                        return elName === searchText;
                    }
                });
        });
    }
    /******************************************************************************************************************************************************* */

    /** 
    * Detrmines the action to be performed on the cell element based on the 'actionDescription' parameter.
    * @returns {void}
    */
    //Author : Yusuf
    //Date   : 16-Mar-2017
    private DetermineAndExecuteAction(targetElement: ElementFinder, tableActionInputs: TableActionParams, action?: TableActions) {
        if (action != undefined) {
            if (!targetElement.isSelected()) {
                //  targetElement.click();
                browser.executeScript("return arguments[0].click()", targetElement.getWebElement());
                browser.sleep(12000);
            }
            return;
        }

        switch (tableActionInputs.actionName) {
            case TableActions.click:
                {
                    // targetElement.click();
                    // break;
                    return browser.executeScript("return arguments[0].click()", targetElement.getWebElement());
                }
            case TableActions.getAttribute:
                break;
            case TableActions.getCell:

            //console.log("VALIDATING the expected with actual...");
            // if(tableActionInputs.textForValidation === undefined && tableActionInputs.searchText != undefined)
            //       expect(targetElement.getText().then(actualValue => {console.log(" Expected Value : "+tableActionInputs.searchText+"            Actual Value:"+actualValue);})).toEqual(tableActionInputs.searchText);
            // else if(tableActionInputs.textForValidation != undefined)
            //       expect(targetElement.getText().then(actualValue => {console.log(" Expected Value : "+tableActionInputs.textForValidation+"            Actual Value:"+actualValue);})).toEqual(tableActionInputs.textForValidation);
            // break;

            case TableActions.getChildFromCell:
                break;
            case TableActions.getInputValue:
                break;
            case TableActions.getSelectedItem:
                break;
            case TableActions.getText:
                break;
            case TableActions.off:
                break;
            case TableActions.on:
                if (!targetElement.isSelected()) {
                    //  targetElement.click();
                    browser.executeScript("return arguments[0].click()", targetElement.getWebElement());
                }
                break;
            case TableActions.selectItem:
                break;
            case TableActions.selectItemByIndex:
                break;
            case TableActions.sendKeys:
                break;
            case TableActions.validate:
                {

                }

            default:
                {
                    //  targetElement.click();
                    browser.executeScript("return arguments[0].click()", targetElement.getWebElement());
                    break;
                }
        }
    }
}
