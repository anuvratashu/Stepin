import { Actions } from './table-handlers/TableActions';
import { FileSystemHelpers } from './helpers/FileSystemHelpers';
import { TestRunCacheHelpers } from './helpers/TestRunCacheHelpers';
import { CommandLineHelpers } from './helpers/CommandLineHelpers';
import { CodeCoverageHelpers } from './helpers/CodeCoverageHelpers';
import { OtherHelpers } from './helpers/OtherHelpers';
import { AllureHelpers } from './helpers/AllureHelpers';

export class HelperReg {

    /**Provides various useful methods helpful in simulating User Actions.*/
    actions: Actions;

    /**Provides helper methods for reporting in Allure framework.*/
    allureHelpers: AllureHelpers;

    /**Provides helper methods for executing commands through Command Line.*/
    cliHelpers: CommandLineHelpers;

    /**Provides helper methods for gathering application code coverage data.*/
    codeCoverageHelpers: CodeCoverageHelpers;

    /**Provides few helper methods for handling files and folders.*/
    fileFolderHelper: FileSystemHelpers;

    /**Provides methods to maintain test Cache at runtime for reuse in test execution.*/
    testRunCache: TestRunCacheHelpers;

    /**Provides few random methods for help.*/
    otherHelpers: OtherHelpers

    constructor() {

        if (this.allureHelpers === undefined)
            this.allureHelpers = new AllureHelpers();

        if (this.fileFolderHelper === undefined)
            this.fileFolderHelper = new FileSystemHelpers();

        if (this.testRunCache === undefined) {
            this.testRunCache = new TestRunCacheHelpers();
        }

        if (this.cliHelpers === undefined) {
            this.cliHelpers = new CommandLineHelpers();
        }

        if (this.codeCoverageHelpers === undefined) {
            this.codeCoverageHelpers = new CodeCoverageHelpers();
        }

        if (this.otherHelpers === undefined) {
            this.otherHelpers = new OtherHelpers();
        }
    }
}