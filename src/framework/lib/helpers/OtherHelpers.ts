import { ElementFinder, protractor, browser } from "protractor";
import { IElementWrapper } from "../../elementWrapper/common/core/IElement-Wrapper";

export class OtherHelpers {
    makeRandonString = (strLength: number, strProp?: { content: "alphabet" | "number" | "mixed", case?: "upper" | "lower" | "mixed" }) => {
        let text = "", possible = "";
        let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower = "abcdefghijklmnopqrstuvwxyz", num = "0123456789";
        if (!!strProp) {
            if (!!strProp.content) {
                if (strProp.content === "number")
                    possible = num;
                else {
                    if (strProp.content === "alphabet") {
                        if (!!strProp.case) {
                            if (strProp.case === "upper") possible = upper;
                            if (strProp.case === "lower") possible = lower;
                            if (strProp.case === "mixed") possible = upper + lower;
                        }
                        else
                            possible = upper + lower;
                    }
                    if (strProp.content === "mixed") {
                        if (!!strProp.case) {
                            if (strProp.case === "upper") possible = upper + num;
                            if (strProp.case === "lower") possible = lower + num;
                            if (strProp.case === "mixed") possible = upper + lower + num;
                        }
                        possible = upper + lower + num;
                    }
                }
            }
        }
        else
            possible = upper + lower + num

        for (let i = 0; i < strLength; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    todayDate = () => {
        let date = new Date();
        let currentDate = "";

        if (date.getDate().toString().length > 1) currentDate = currentDate + date.getDate().toString();
        else currentDate = currentDate + '0' + date.getDate().toString();
        currentDate = currentDate + '/';

        if ((date.getMonth() + 1).toString().length > 1) currentDate = currentDate + (date.getMonth() + 1).toString()
        else currentDate = currentDate + '0' + (date.getMonth() + 1).toString();
        currentDate = currentDate + '/';

        currentDate = currentDate + date.getFullYear().toString();
        return currentDate
    }

    randomNumberGenerate(n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

        if (n > max) {
            return this.randomNumberGenerate(max) + this.randomNumberGenerate(n - max);
        }

        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }

    checkOverlapp(elems: ElementFinder[] | IElementWrapper[]) {
        let rects = []
        for (let x of elems)
            rects.push(browser.executeScript('return arguments[0].getBoundingClientRect()', x.getWebElement()));

        return protractor.promise.all(rects)
            .then(myRects => {
                let overlapping = false, overlap = (rect1, rect2) => !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom)
                for (let i = 0; i < myRects.length; i++) {
                    for (let j = i; j < myRects.length && j != i; j++)
                        if (overlap(myRects[i], myRects[j]))
                            overlapping = true;
                }
                return overlapping;
            })
    }

    showMousePointer() {
        return browser.executeScript(() => {
            `// Create mouse following image.
            var pointerImg = document.createElement("img");
            // Set image properties.
            pointerImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAQAAACGG/bgAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAHsYAAB7GAZEt8iwAAAAHdElNRQfgAwgMIwdxU/i7AAABZklEQVQ4y43TsU4UURSH8W+XmYwkS2I09CRKpKGhsvIJjG9giQmliHFZlkUIGnEF7KTiCagpsYHWhoTQaiUUxLixYZb5KAAZZhbunu7O/PKfe+fcA+/pqwb4DuximEqXhT4iI8dMpBWEsWsuGYdpZFttiLSSgTvhZ1W/SvfO1CvYdV1kPghV68a30zzUWZH5pBqEui7dnqlFmLoq0gxC1XfGZdoLal2kea8ahLoqKXNAJQBT2yJzwUTVt0bS6ANqy1gaVCEq/oVTtjji4hQVhhnlYBH4WIJV9vlkXLm+10R8oJb79Jl1j9UdazJRGpkrmNkSF9SOz2T71s7MSIfD2lmmfjGSRz3hK8l4w1P+bah/HJLN0sys2JSMZQB+jKo6KSc8vLlLn5ikzF4268Wg2+pPOWW6ONcpr3PrXy9VfS473M/D7H+TLmrqsXtOGctvxvMv2oVNP+Av0uHbzbxyJaywyUjx8TlnPY2YxqkDdAAAAABJRU5ErkJggg==');
            pointerImg.setAttribute('id', 'mouse_follower');
            pointerImg.setAttribute('style', 'position: absolute; z-index: 99999999999; pointer-events: none;');
            // Add mouse follower to the web page.
            document.body.appendChild(pointerImg);
            document.onmousemove = function (e) {
                const mousePointer = document.getElementById('mouse_follower');
                mousePointer.style.left = e.pageX + 'px'; mousePointer.style.top = e.pageY + 'px';
            }`
        })
    }
}