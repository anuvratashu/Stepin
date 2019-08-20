import { login } from 'kognifai-login';
import { AppHeader } from '../pages/AppHeader';
import { AppMessage } from '../pages/AppMessage';
import { Home } from '../pages/Home';
//import { Login } from '../pages/Login';
import { Services } from '../pages/Services';
import { SideBar } from '../pages/SideBar';
import { ToolsMenu } from '../pages/ToolsMenu';
import { UserProfile } from '../pages/UserProfile';
import { UserAdministration } from '../pages/UserAdministration';
import { Entitlements } from '../pages/Entitlements';
import { Users } from '../pages/Users';
import { Applications } from '../pages/Applications';
import { Dashboards } from '../pages/Dashboard';
import { TimeSeriesViewer } from '../pages/TimeSeriesViewer';
//import { Settings, Logging, Message, Statistics, ToolsMenuPage, UomService, DataContext } from '../pages/TestPages';

export class KognifaiCoreReg {
    private static loginPage__: typeof login;
    private static homePage__: Home;
    private static toolsMenu__: ToolsMenu;
    private static appHeaderPage__: AppHeader;
    private static services__: Services;
    private static userAdminPage__: UserAdministration;
    private static sideBar__: SideBar
    private static userProfilePage__: UserProfile;
    private static appMessageWindow__: AppMessage;
    private static entitlementsPage__: Entitlements;
    private static usersPage__: Users;
    private static applicationsPage__: Applications;
    private static dashboardsPage__: Dashboards;
    private static timeSeriesViewerPage__: TimeSeriesViewer;
    // private static settingsPage__: Settings;
    // private static loggingPage__: Logging;
    // private static statisticsPage__: Statistics;
    // private static toolsMenuPage__: ToolsMenuPage;
    // private static uomServicePage__: UomService;
    // private static dataContextPage__: DataContext;
    // private static messagePage__: Message;

    static get loginPage(): typeof login {
        if (KognifaiCoreReg.loginPage__ === undefined) {
            KognifaiCoreReg.loginPage__ = login
        }
        return KognifaiCoreReg.loginPage__;
    }

    static get homePage(): Home {
        if (KognifaiCoreReg.homePage__ === undefined) {
            KognifaiCoreReg.homePage__ = new Home();
        }
        return KognifaiCoreReg.homePage__;
    }

    static get toolsMenu(): ToolsMenu {
        if (KognifaiCoreReg.toolsMenu__ === undefined) {
            KognifaiCoreReg.toolsMenu__ = new ToolsMenu();
        }
        return KognifaiCoreReg.toolsMenu__;
    }

    static get appHeader(): AppHeader {
        if (KognifaiCoreReg.appHeaderPage__ === undefined) {
            KognifaiCoreReg.appHeaderPage__ = new AppHeader();
        }
        return KognifaiCoreReg.appHeaderPage__;
    }

    static get entitlementsPage(): Entitlements {
        if (KognifaiCoreReg.entitlementsPage__ === undefined) {
            KognifaiCoreReg.entitlementsPage__ = new Entitlements()
        }
        return KognifaiCoreReg.entitlementsPage__;
    }

    static get usersPage(): Users {
        if (KognifaiCoreReg.usersPage__ === undefined) {
            KognifaiCoreReg.usersPage__ = new Users()
        }
        return KognifaiCoreReg.usersPage__;
    }

    static get applicationsPage(): Applications {
        if (KognifaiCoreReg.applicationsPage__ === undefined) {
            KognifaiCoreReg.applicationsPage__ = new Applications()
        }
        return KognifaiCoreReg.applicationsPage__;
    }

    static get services(): Services {
        if (KognifaiCoreReg.services__ === undefined) {
            KognifaiCoreReg.services__ = new Services()
        }
        return KognifaiCoreReg.services__;
    }

    static get userAdminPage(): UserAdministration {
        if (KognifaiCoreReg.userAdminPage__ === undefined) {
            KognifaiCoreReg.userAdminPage__ = new UserAdministration();
        }
        return KognifaiCoreReg.userAdminPage__;
    }

    static get sideBar(): SideBar {
        if (KognifaiCoreReg.sideBar__ === undefined) {
            KognifaiCoreReg.sideBar__ = new SideBar();
        }
        return KognifaiCoreReg.sideBar__;
    }

    static get userProfilePage(): UserProfile {
        if (KognifaiCoreReg.userProfilePage__ === undefined) {
            KognifaiCoreReg.userProfilePage__ = new UserProfile();
        }
        return KognifaiCoreReg.userProfilePage__;
    }

    static get dashboardPage(): Dashboards {
        if (KognifaiCoreReg.dashboardsPage__ === undefined) {
            KognifaiCoreReg.dashboardsPage__ = new Dashboards();
        }
        return KognifaiCoreReg.dashboardsPage__;
    }

    static get timeSeriesViewerPage(): TimeSeriesViewer {
        if (KognifaiCoreReg.timeSeriesViewerPage__ === undefined) {
            KognifaiCoreReg.timeSeriesViewerPage__ = new TimeSeriesViewer();
        }
        return KognifaiCoreReg.timeSeriesViewerPage__;
    }

    static get appMessageWindow(): AppMessage {
        if (KognifaiCoreReg.appMessageWindow__ === undefined) {
            KognifaiCoreReg.appMessageWindow__ = new AppMessage();
        }
        return KognifaiCoreReg.appMessageWindow__;
    }

    /* static get settingsPage(): Settings {
        if (KognifaiCoreReg.settingsPage__ === undefined) {
            KognifaiCoreReg.settingsPage__ = new Settings();
        }
        return KognifaiCoreReg.settingsPage__;
    }

    static get loggingPage(): Logging {
        if (KognifaiCoreReg.loggingPage__ === undefined) {
            KognifaiCoreReg.loggingPage__ = new Logging();
        }
        return KognifaiCoreReg.loggingPage__;
    }

    static get statisticsPage(): Statistics {
        if (KognifaiCoreReg.statisticsPage__ === undefined) {
            KognifaiCoreReg.statisticsPage__ = new Statistics();
        }
        return KognifaiCoreReg.statisticsPage__;
    }

    static get toolsMenuPage(): ToolsMenuPage {
        if (KognifaiCoreReg.toolsMenuPage__ === undefined) {
            KognifaiCoreReg.toolsMenuPage__ = new ToolsMenuPage();
        }
        return KognifaiCoreReg.toolsMenuPage__;
    }

    static get uomServicePage(): UomService {
        if (KognifaiCoreReg.uomServicePage__ === undefined) {
            KognifaiCoreReg.uomServicePage__ = new UomService();
        }
        return KognifaiCoreReg.uomServicePage__;
    }

    static get dataContextPage(): DataContext {
        if (KognifaiCoreReg.dataContextPage__ === undefined) {
            KognifaiCoreReg.dataContextPage__ = new DataContext();
        }
        return KognifaiCoreReg.dataContextPage__;
    }

    static get messagePage(): Message {
        if (KognifaiCoreReg.messagePage__ === undefined) {
            KognifaiCoreReg.messagePage__ = new Message();
        }
        return KognifaiCoreReg.messagePage__;
    } */
}