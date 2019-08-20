import { browser, protractor, by, By, ElementFinder, ElementArrayFinder, promise } from "protractor";
import { HelperReg } from "../framework/lib/helperRegistory";
import { wrapperElement as element } from "../framework/elementWrapper/Element-Factory";

let helper = new HelperReg();

export class AppMessage {

    /*********************************************** Modal Messages********************************************************/
    private modalBody = element(by.css('app-message div.kx-modal__content'));
    modalName = this.modalBody.element(by.css('.kx-modal__title'));
    modalCloseButton = this.modalBody.element(by.css('button.kx-modal__close span'))
    modalText = this.modalBody.element(by.css('div.kx-modal__body'));
    modalButton = (buttonText: string) => this.modalBody.element(by.cssContainingText('button', buttonText));

    /*********************************************** Notification Messages********************************************************/
    private notificationBody = element(by.css('app-message div.toaster-container'));
    notificationName = this.notificationBody.element(by.css('.kx-notification__title'));
    notificationCloseButton = this.notificationBody.element(by.css('button.kx-notification__dismiss span'))
    notificationText = this.notificationBody.element(by.css('div.kx-notification__body'));
    notificationButton = (buttonText: string) => this.notificationBody.element(by.cssContainingText('button', buttonText));

    /*################################################## Methods ##################################################*/

    async readNotificationMessage(timeout: number = 5000) {
        let self = this,
            readToast = () => browser.wait(protractor.ExpectedConditions.visibilityOf(self.notificationBody.baseElement), timeout)
                .then(() => self.notificationText.getText(), e => "Notification Message not found");

        //await browser.sleep(1000);
        if (await browser.waitForAngularEnabled()) {
            await browser.waitForAngularEnabled(false)
            try {
                let toastText = await readToast()
                await browser.waitForAngularEnabled(true);
                await browser.wait(protractor.ExpectedConditions.stalenessOf(self.notificationBody.baseElement), timeout)
                return toastText;
            } catch (err) {
                await browser.waitForAngularEnabled(true)
                throw err
            }
        }
        else
            return readToast();
    };

};