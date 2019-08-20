import { browser, protractor, element, by, By, ElementFinder, ElementArrayFinder, promise, WebElementPromise } from "protractor";
import * as moment from "moment";
import { IElementWrapper, IElementArrayWrapper } from "../../elementWrapper/Common/Core/IElement-Wrapper";
import { ElementArrayWrapper, ElementWrapper } from "../../elementWrapper/Element-Factory";

export interface IGetColumn {
    /**
    *Provides the elements in any column of the Grid.
    *@param column The [Index Number(starts with 1)] or the [Name] of the column you want to select.
    **/
    (column: number | string): IElementArrayWrapper
}
export interface IGetElements {
    /**
    *Provides elements from one column of the grid based on conditions in the other column.
    *@param column The [Index Number(starts with 1)] or the [Name] of the column you want to select.
    *@param row The [Row Number] or [A JSON object with filteringColumn and filter properties]
    *@param filteringColumn The [Index Number(starts with 1)] or the [Name] of the column you want to filter with.
    *@param filter The [value] or the [Filtering function(cb)] in the filtering column.
    **/
    (column: number | string, row: number | { filteringColumn: number | string, filter: string | ((columnElement: IElementWrapper, index?: number) => boolean | promise.Promise<boolean>) }): IElementArrayWrapper
}
export interface IGetRow {
    /**
    *Provides the elements in any row of the Grid.
    *@param row The index number(starts with 1) of the row you want to select.
    **/
    (row: number | "Last"): IElementArrayWrapper
}
export interface IGetSortedColumnValues {
    (column: string | number, valueType: "string" | "number" | "date", sortType?: "asc" | "desc", dateFormat?: string): promise.Promise<string[]>
}

export class Grid {
    private cells: IElementArrayWrapper;
    private headers: IElementArrayWrapper;

    constructor(cells: IElementArrayWrapper, headers: IElementArrayWrapper) {
        this.cells = cells;
        this.headers = headers;
    }

    getRow: IGetRow = (row) => {
        let self = this, cnt = null, cellCount = null;
        if (typeof row === 'number') {
            return self.cells.filter((elem, index) => {
                if (cnt === null) {
                    return self.headers.count().then(hds => {
                        cnt = hds;
                        return (index >= (cnt * (row - 1)) && index < (cnt * row));
                    });
                }
                return (index >= (cnt * (row - 1)) && index < (cnt * row));
            })
        }
        if (row === "Last") {
            return self.cells.filter((elem, index) => {
                if (cnt === null) {
                    return self.headers.count()
                        .then(hds => {
                            cnt = hds;
                            if (cellCount === null) {
                                return self.cells.count()
                                    .then(ccount => {
                                        cellCount = ccount;
                                        return (index >= cellCount - hds)
                                    });
                            }
                            return (index >= cellCount - hds)
                        });
                }
                return (index >= cellCount - cnt)
            });
        }
    };

    getColumn: IGetColumn = (column) => {
        let self = this, cnt = null;
        let myColElms = (columnNum: number) => () => self.cells.count()
            .then(ccnt => self.headers.count()
                .then(hcnt => {
                    let elms: WebElementPromise[] = [];
                    for (let i = 0; i < ccnt; i++) {
                        if (!((i - columnNum + 1) % hcnt)) {
                            elms.push(self.cells.get(i).getWebElement())
                        }
                    }
                    return elms;
                }));

        if (typeof column === 'number') {
            return new ElementArrayWrapper(new ElementArrayFinder(browser, myColElms(column)));
        }
        return new ElementArrayWrapper(new ElementArrayFinder(browser, () => self.headers.getAttribute('innerText')//Can't use getText() due to IE issue
            .then(htxt => {
                let headTxt = [];
                for (let i = 0; i < htxt.length; i++) {
                    headTxt.push(htxt[i].replace(/(\r\n|\n|\r|\s\s+)/g, '').trim().toLowerCase());
                }
                let columnNumber = headTxt.indexOf(column.toLowerCase()) + 1;
                return myColElms(columnNumber)();
            })
        ));
    };

    getElements: IGetElements = (column, row) => {
        let self = this;
        if (typeof row === 'number') {
            return self.getColumn(column).filter(function (ele, ind) {
                return (ind === row - 1)
            });
        }
        let filterFn = (fn) => {
            return self.getColumn(column).filter((elem, index) => {
                return fn(self.getColumn(row.filteringColumn).get(index), index);
            });
        }
        if (typeof row.filter === 'string') {
            let myColElms = () => () => self.getColumn(row.filteringColumn).getText()
                .then((txtArr) => {
                    let strArr: Array<string> = JSON.parse(JSON.stringify(txtArr)), indArr = [];
                    for (let x in strArr)
                        if (strArr[x] == row.filter)
                            indArr.push(x);
                    return indArr;
                }).then(indxArr => {
                    let elms: WebElementPromise[] = [];
                    for (let i in indxArr)
                        elms.push(self.getColumn(column).get(indxArr[i]).getWebElement())
                    return elms;
                });
            return new ElementArrayWrapper(new ElementArrayFinder(browser, myColElms()));
            /* let textMatcher = (element: ElementFinder, index) => {
                return element.getText().then(txt => {
                    return (txt === row.filter)
                });
            }
            return filterFn(textMatcher); */
        }
        return filterFn(row.filter);
    }

    getHeaderElement = (column: number | string): IElementWrapper => {
        let self = this;
        if (typeof column === 'number')
            return self.headers.get(column - 1)
        if (typeof column === 'string') {
            let myColElms = () => () => self.headers.getAttribute('innerText')
                .then(hdTxt => {
                    let strArr: Array<string> = JSON.parse(JSON.stringify(hdTxt))
                    for (let x in strArr) {
                        if (strArr[x].indexOf(column) > -1) {
                            return self.headers.get(parseInt(x))
                        }
                    }
                }).then(headElem => {
                    let elms: WebElementPromise[] = [];
                    elms.push(headElem.getWebElement())
                    return elms;
                });
            return new ElementArrayWrapper(new ElementArrayFinder(browser, myColElms())).first()
        }
    }

    getSortedColumnValues: IGetSortedColumnValues = (column, valueType, sortType = "asc", dateFormat) => {
        return this.getColumn(column).getText()
            .then(txt => {
                let strArr: Array<string> = JSON.parse(JSON.stringify(txt)), sortFn;
                switch (valueType) {
                    case "number":
                        sortFn = (a, b) => {
                            let toNumber = (str) => parseInt(str.split(' ')[0]);
                            if (sortType === "desc")
                                return toNumber(b) - toNumber(a);
                            return toNumber(a) - toNumber(b);
                        }
                        break;
                    case "date":
                        sortFn = (a, b) => {
                            let toDate = (str) => {
                                if (str.length == 0)
                                    return 8640000000000000;//Max date;
                                if (!!dateFormat) {
                                    return moment(str, dateFormat).toDate().getTime();
                                }
                                return new Date(str).getTime();
                            }
                            if (sortType === "desc")
                                return toDate(b) - toDate(a);
                            return toDate(a) - toDate(b);
                        }
                        break;
                    case "string":
                        sortFn = (a, b) => {
                            //setting emty string to come later in the sort
                            if (a.length == 0) a = 'ZZZZZZZZ';
                            if (b.length == 0) b = 'ZZZZZZZZ';
                            if (sortType === "desc")
                                return b.toLowerCase().localeCompare(a.toLowerCase());
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        }
                }
                return strArr.sort(sortFn);
            });
    }
}