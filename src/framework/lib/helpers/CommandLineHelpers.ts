import * as cp from 'child_process';
import * as path from 'path';
import { browser, element, by, By, ElementArrayFinder, ElementFinder, protractor, promise } from "protractor";

export class CommandLineHelpers {
    async runInShell(filePath: string, application: string, args: string | object) {
        let deferred = protractor.promise.defer();
        if (typeof args === 'object') {
            let str = '';
            for (let x in <any>args) {
                if (args.hasOwnProperty(x)) {
                    str = str + ' -' + x;
                    str = str + ' ' + args[x];
                }
            }
            args = str;
        }
        cp.exec(path.resolve(filePath, application) + args, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
            if (error)
                deferred.reject(`exec error: ${error}`);
            else if (stderr)
                deferred.fulfill(stderr);
            else
                deferred.fulfill(stdout);
        })
        return deferred.promise;
    }

}