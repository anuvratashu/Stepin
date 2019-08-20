import { browser } from 'protractor';
import * as path from 'path';
import * as fs from 'fs';

export class TrosPlugin {

    public trossTokenUpdates() {
        try {
            let testOutDir = browser.params.baseDir,
                loc = path.resolve(testOutDir, '/../test-run-info'),
                _isLateralRun = false,
                proAckToken = {
                    sessionToken: "",
                    runCachePath: ""
                },
                tokenFile = loc + '/ControllerRunID.txt';

            try {
                if (fs.existsSync(loc + '/pro-ack-token.json')) {
                    console.error("This should be a primary run session. Instead, it's a lateral session !");
                    _isLateralRun = true;
                }
            } catch (e) { console.log("ERROR ::: Checking token file :" + e); }

            console.log("Fixing token...");
            console.log("loc: " + loc);

            try {
                if (fs.existsSync(tokenFile)) {
                    console.log("Run Session ID : Located");
                    try {
                        proAckToken.sessionToken = fs.readFileSync(tokenFile, 'utf8');
                        proAckToken.runCachePath = testOutDir;
                        var tokenString = JSON.stringify(proAckToken); //convert it back to json
                        try {
                            fs.writeFileSync(loc + '/pro-ack-token.json', tokenString, 'utf8');
                            console.log("pro-token-acknowledgement : success");
                        } catch (er) {
                            console.log("ERROR ::: Acknowledging session token :" + er);
                            console.log("pro-token-acknowledgement : failed");
                        }
                    } catch (e) { console.log("ERROR ::: Reading token file :" + e); }
                }
                else
                    console.log("Run Session ID can't be located");
            } catch (e) { }

            if (fs.existsSync(loc + '/pro-ack-token.json'))
                console.log("Pro-ack-token ::: [ confirming the acknowledgement in the primary run session ]");
        } catch (error) {
            console.log("Error with TrosToken: ", error);
        }
    }
};
