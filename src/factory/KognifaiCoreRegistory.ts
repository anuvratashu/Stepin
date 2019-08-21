
import { AppMessage } from '../pages/AppMessage';
import { Home } from '../pages/Home';

export class KognifaiCoreReg {
    private static homePage__: Home;
    private static appMessageWindow__: AppMessage;

    static get homePage(): Home {
        if (KognifaiCoreReg.homePage__ === undefined) {
            KognifaiCoreReg.homePage__ = new Home();
        }
        return KognifaiCoreReg.homePage__;
    }

    static get appMessageWindow(): AppMessage {
        if (KognifaiCoreReg.appMessageWindow__ === undefined) {
            KognifaiCoreReg.appMessageWindow__ = new AppMessage();
        }
        return KognifaiCoreReg.appMessageWindow__;
    }
}