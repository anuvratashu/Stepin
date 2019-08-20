import { ElementFinder, ElementArrayFinder, browser,promise } from "protractor";
import { ElementApi, ElementArrayApi } from './Core/Elements-Mixin';
import * as png from 'pngjs';

export abstract class CommonElement extends ElementApi {
    constructor(private targetElement: ElementFinder,
        private extendingElementClass: typeof CommonElement = CommonElement,
        private extendingElementArrayClass: typeof CommonArrayElements = CommonArrayElements
    ) {
        super(targetElement, extendingElementClass, extendingElementArrayClass);
    }

    get baseElement() {
        return this.targetElement;
    }

    trigger(eventName: string) {
        return browser.executeScript("var myEvent = document.createEvent('Event');myEvent.initEvent('" + eventName + "', true, true);arguments[0].dispatchEvent(myEvent);", this.targetElement.getWebElement());
    }

    highlight() {
        return browser.executeScript("arguments[0].setAttribute('style', arguments[1]);", this.targetElement, "border: 2px solid red;border-style:outset; background-color: yellow;")
    };

    // /* async takeScreenshot() {
    //     let PNG = png.PNG,
    //         androidDefaultOffsets = {
    //             statusBar: 24,
    //             addressBar: 56,
    //             addressBarScrolled: 0,
    //             toolBar: 48
    //         }, iosDefaultOffsets = {
    //             statusBar: 20,
    //             addressBar: 44,
    //             addressBarScrolled: 19,
    //             toolBar: 44
    //         }, getVisibleDimensions = () => {
    //             var getScrollParent = function (node) {
    //                 if (node === null) return null;
    //                 if (!(node.scrollHeight && node.clientHeight)) return getScrollParent(node.parentNode);
    //                 if (node.scrollHeight > node.clientHeight) return node;
    //                 return getScrollParent(node.parentNode);
    //             }

    //             var node = arguments[0], referenceNode = getScrollParent(arguments[0]);
    //             if (referenceNode == null) referenceNode = node;

    //             var pos = node.getBoundingClientRect(), referencePos = referenceNode.getBoundingClientRect();

    //             return {
    //                 "width": Math.min(
    //                     node.clientWidth,
    //                     referencePos.left + referenceNode.clientWidth - pos.left,
    //                     node.clientWidth - (referencePos.left - pos.left)
    //                 ),
    //                 "height": Math.min(
    //                     node.clientHeight,
    //                     referencePos.top + referenceNode.clientHeight - pos.top,
    //                     node.clientHeight - (referencePos.top - pos.top)
    //                 )
    //             }
    //         }

    //     let loc = await this.targetElement.getLocation(),
    //         capabilities = (await browser.getProcessedConfig()).capabilities,
    //         viewData: { screenHeight, viewPortHeight, dpRatio } = await browser.executeScript(function () {
    //             return {
    //                 screenHeight: window.screen.height,
    //                 viewPortHeight: window.innerHeight,
    //                 dpRatio: window.devicePixelRatio
    //             };
    //         }),
    //         pixelRatio = viewData.dpRatio,
    //         src = PNG.sync.read(Buffer.from(await browser.takeScreenshot(), 'base64')),
    //         dim: { "width": number, "height": number } = await browser.executeScript(getVisibleDimensions, this.targetElement.getWebElement()),
    //         dst = new PNG({ width: dim.width * pixelRatio, height: dim.height * pixelRatio });

    //     if (!!capabilities.platformName && capabilities.platformName.toLowerCase() == "android" && !!capabilities.nativeWebScreenshot) {
    //         if (viewData.screenHeight == viewData.viewPortHeight + androidDefaultOffsets.statusBar + androidDefaultOffsets.addressBar + androidDefaultOffsets.toolBar)//AddressBar is not hidden
    //             PNG.bitblt(src, dst, loc.x * pixelRatio, (loc.y + (androidDefaultOffsets.statusBar + androidDefaultOffsets.addressBar)) * pixelRatio, dst.width, dst.height, 0, 0);
    //         else if (viewData.screenHeight == viewData.viewPortHeight + androidDefaultOffsets.statusBar + + androidDefaultOffsets.addressBarScrolled + androidDefaultOffsets.toolBar)//AddressBar is hidden(after scroll)
    //             PNG.bitblt(src, dst, loc.x * pixelRatio, (loc.y + (androidDefaultOffsets.statusBar + androidDefaultOffsets.addressBar)) * pixelRatio, dst.width, dst.height, 0, 0);
    //     }
    //     else if (!!capabilities.platformName && capabilities.platformName.toLowerCase() == "ios" && !!capabilities.nativeWebScreenshot) {
    //         if (viewData.screenHeight == viewData.viewPortHeight + iosDefaultOffsets.statusBar + iosDefaultOffsets.addressBar + iosDefaultOffsets.toolBar)//AddressBar is not hidden
    //             PNG.bitblt(src, dst, loc.x * pixelRatio, (loc.y + (iosDefaultOffsets.statusBar + iosDefaultOffsets.addressBar)) * pixelRatio, dst.width, dst.height, 0, 0);
    //         else if (viewData.screenHeight == viewData.viewPortHeight + iosDefaultOffsets.statusBar + + iosDefaultOffsets.addressBarScrolled /* + iosDefaultOffsets.toolBar */)//AddressBar is minimized and Toolbar is hidden(after scroll)
    //             PNG.bitblt(src, dst, loc.x * pixelRatio, (loc.y + (iosDefaultOffsets.statusBar + iosDefaultOffsets.addressBarScrolled)) * pixelRatio, dst.width, dst.height, 0, 0);
    //     } else
    //         PNG.bitblt(src, dst, loc.x * pixelRatio, loc.y * pixelRatio, dst.width, dst.height, 0, 0);
    //     return (PNG.sync.write(dst) as Buffer).toString("base64");
    // } */

    // async takeCroppedScreenshot(startLocation: { x: number, y: number }, cropSize: { width: number, height: number }) {
    //     let PNG = png.PNG,
    //         loc = await this.targetElement.getLocation(),
    //         pixelRatio: number = await browser.executeScript("return window.devicePixelRatio"),
    //         src = PNG['sync'].read(Buffer.from(await browser.takeScreenshot(), 'base64')),
    //         dst = new PNG({ width: (cropSize.width * pixelRatio), height: (cropSize.height * pixelRatio) });

    //     PNG.bitblt(src, dst, (loc.x + startLocation.x) * pixelRatio, (loc.y + startLocation.y) * pixelRatio, dst.width, dst.height, 0, 0);
    //     return (PNG.sync.write(dst) as Buffer).toString("base64");
    // }

    async takeCroppedScreenshot(startLocation: { x: number, y: number }, cropSize: { width: number, height: number }) {
        let PNG = png.PNG,
            pixelRatio: number = await browser.executeScript("return window.devicePixelRatio"),
            src = PNG['sync'].read(Buffer.from(await this.targetElement.takeScreenshot(), 'base64')),
            dst = new PNG({ width: (cropSize.width * pixelRatio), height: (cropSize.height * pixelRatio) });

        PNG.bitblt(src, dst, (startLocation.x) * pixelRatio, (startLocation.y) * pixelRatio, dst.width, dst.height, 0, 0);
        return (PNG.sync.write(dst) as Buffer).toString("base64");
    }
}

export abstract class CommonArrayElements extends ElementArrayApi {
    constructor(private target: ElementArrayFinder,
        private extendingElementClass: typeof CommonElement = CommonElement,
        private extendingElementArrayClass: typeof CommonArrayElements = CommonArrayElements
    ) {
        super(target, extendingElementClass, extendingElementArrayClass);
    }

    get baseElements() {
        return this.target;
    }

    selectMatching(value: string) {
        return browser.executeScript("return arguments[0].click()", this.target.filter(elem => elem.getText().then(result => result === value)).first().getWebElement());
    }
}

