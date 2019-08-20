import { ElementFinder, ElementArrayFinder, promise, WebElement, WebElementPromise,Locator } from "protractor";
import { IWrapperInterface, IWrapperArrayInterface } from "../../IWrapper-Interfaces";

export interface IElementWrapper extends IWrapperInterface, Omit<WebElement, keyof IWrapperInterface> {
    new(targetElement: ElementFinder): void;

    $(selector: string): IElementWrapper;
    $$(selector: string): IElementArrayWrapper;
    all(locator: Locator): IElementArrayWrapper;
    allowAnimations(value: boolean): IElementWrapper;
    clone(): IElementWrapper;
    element(subLocator: any): IElementWrapper;
    evaluate(expression: string): IElementWrapper;
    equals(element: ElementFinder | WebElement): promise.Promise<any>;

    getWebElement(): WebElementPromise;
    isPresent(): promise.Promise<boolean>;
    locator(): any;
}

export interface IElementArrayWrapper extends IWrapperArrayInterface, Omit<WebElement, keyof IWrapperArrayInterface> {
    new(targetElement: ElementArrayFinder): void;

    $$(selector: string): IElementArrayWrapper;
    all(subLocator: Locator): IElementArrayWrapper;
    allowAnimations(value: boolean): IElementWrapper;
    clone(): IElementWrapper;
    /**
    * Calls the input function on each ElementFinder represented by the
    * ElementArrayFinder.
    *
    * @alias element.all(locator).each(eachFunction)
    * @view
    * <ul class="items">
    *   <li>First</li>
    *   <li>Second</li>
    *   <li>Third</li>
    * </ul>
    *
    * @example
    * element.all(by.css('.items li')).each(function(element, index) {
    *   // Will print 0 First, 1 Second, 2 Third.
    *   element.getText().then(function (text) {
    *     console.log(index, text);
    *   });
    * });
    *
    * // Or using the shortcut $$() notation instead of element.all(by.css()):
    *
    * $$('.items li').each(function(element, index) {
    *   // Will print 0 First, 1 Second, 2 Third.
    *   element.getText().then(function (text) {
    *     console.log(index, text);
    *   });
    * });
    *
    * @param {function(IElementWrapper)} fn Input function
    *
    * @returns {!webdriver.promise.Promise} A promise that will resolve when the
    *     function has been called on all the ElementWrapper. The promise will
    *     resolve to null.
    */
    each(fn: (element?: IElementWrapper, index?: number) => any): promise.Promise<any>;
    /**
     * Evaluates the input as if it were on the scope of the current underlying
     * elements.
     *
     * @view
     * <span class="foo">{{letiableInScope}}</span>
     *
     * @example
     * let value = element.all(by.css('.foo')).evaluate('letiableInScope');
     *
     * // Or using the shortcut $$() notation instead of element.all(by.css()):
     *
     * let value = $$('.foo').evaluate('letiableInScope');
     *
     * @param {string} expression
     *
     * @returns {IElementArrayWrapper} which resolves to the
     *     evaluated expression for each underlying element.
     *     The result will be resolved as in
     *     {@link webdriver.WebDriver.executeScript}. In summary - primitives will
     *     be resolved as is, functions will be converted to string, and elements
     *     will be returned as a WebElement.
     */
    evaluate(expression: string): IElementArrayWrapper;
    /**
     * Apply a filter function to each element within the ElementArrayFinder.
     * Returns a new ElementArrayFinder with all elements that pass the filter
     * function. The filter function receives the IElementWrapper as the first
     * argument and the index as a second arg. This does not actually retrieve
     * the underlying list of elements, so it can be used in page objects.
     *
     * @alias element.all(locator).filter(filterFn)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * element.all(by.css('.items li')).filter(function(elem, index) {
        *   return elem.getText().then(function(text) {
        *     return text === 'Third';
        *   });
        * }).first().click();
        *
        * // Or using the shortcut $$() notation instead of element.all(by.css()):
        *
        * $$('.items li').filter(function(elem, index) {
        *   return elem.getText().then(function(text) {
        *     return text === 'Third';
        *   });
        * }).first().click();
        *
        * @param {function(IElementWrapper, number): webdriver.WebElement.Promise}
        * filterFn
        *     Filter function that will test if an element should be returned.
        *     filterFn can either return a boolean or a promise that resolves to a
        * boolean
        * @returns {!IElementArrayWrapper} A IElementArrayWrapper that represents an
        * array
        *     of element that satisfy the filter function.
        */
    filter(filterFn: (element: IElementWrapper, index?: number) => boolean | promise.Promise<boolean>): IElementArrayWrapper
    first(): IElementWrapper;
    get(index: number | promise.Promise<number>): IElementWrapper
    last(): IElementWrapper
    /**
     * Apply a map function to each element within the ElementArrayFinder. The
     * callback receives the IElementWrapper as the first argument and the index as
     * a second arg.
     *
     * @alias element.all(locator).map(mapFunction)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * let items = element.all(by.css('.items li')).map(function(elm, index) {
        *   return {
        *     index: index,
        *     text: elm.getText(),
        *     class: elm.getAttribute('class')
        *   };
        * });
        * expect(items).toEqual([
        *   {index: 0, text: 'First', class: 'one'},
        *   {index: 1, text: 'Second', class: 'two'},
        *   {index: 2, text: 'Third', class: 'three'}
        * ]);
        *
        * // Or using the shortcut $$() notation instead of element.all(by.css()):
        *
        * let items = $$('.items li').map(function(elm, index) {
        *   return {
        *     index: index,
        *     text: elm.getText(),
        *     class: elm.getAttribute('class')
        *   };
        * });
        * expect(items).toEqual([
        *   {index: 0, text: 'First', class: 'one'},
        *   {index: 1, text: 'Second', class: 'two'},
        *   {index: 2, text: 'Third', class: 'three'}
        * ]);
        *
        * @param {function(IElementWrapper, number)} mapFn Map function that
        *     will be applied to each element.
        * @returns {!webdriver.promise.Promise} A promise that resolves to an array
        *     of values returned by the map function.
        */
    map<T>(mapFn: (element?: IElementWrapper, index?: number) => any): promise.Promise<T[]>

    count(): promise.Promise<number>;
    getWebElements: () => promise.Promise<WebElement[]>;
    isPresent(): promise.Promise<boolean>;
    locator(): any;
    /**
     * Apply a reduce function against an accumulator and every element found
     * using the locator (from left-to-right). The reduce function has to reduce
     * every element into a single value (the accumulator). Returns promise of
     * the accumulator. The reduce function receives the accumulator, current
     * ElementFinder, the index, and the entire array of ElementFinders,
     * respectively.
     *
     * @alias element.all(locator).reduce(reduceFn)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * let value = element.all(by.css('.items li')).reduce(function(acc, elem) {
        *   return elem.getText().then(function(text) {
        *     return acc + text + ' ';
        *   });
        * }, '');
        *
        * expect(value).toEqual('First Second Third ');
        *
        * // Or using the shortcut $$() notation instead of element.all(by.css()):
        *
        * let value = $$('.items li').reduce(function(acc, elem) {
        *   return elem.getText().then(function(text) {
        *     return acc + text + ' ';
        *   });
        * }, '');
        *
        * expect(value).toEqual('First Second Third ');
        *
        * @param {function(number, ElementFinder, number, Array.<ElementFinder>)}
        *     reduceFn Reduce function that reduces every element into a single
        * value.
        * @param {*} initialValue Initial value of the accumulator.
        * @returns {!webdriver.promise.Promise} A promise that resolves to the final
        *     value of the accumulator.
        */
    reduce(reduceFn: Function, initialValue: any): promise.Promise<any>;
}
