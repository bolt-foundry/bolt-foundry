"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const url_1 = tslib_1.__importDefault(require("url"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const assert_1 = tslib_1.__importDefault(require("assert"));
const get_port_1 = tslib_1.__importDefault(require("get-port"));
const http_1 = tslib_1.__importDefault(require("http"));
const glob_1 = require("glob");
const fs_1 = require("fs");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const user_interface_1 = tslib_1.__importDefault(require("../user-interface"));
const child_process_1 = require("child_process");
const debug = debug_1.default('devcert:platforms:shared');
/**
 *  Given a directory or glob pattern of directories, run a callback for each db
 *  directory, with a version argument.
 */
function doForNSSCertDB(nssDirGlob, callback) {
    glob_1.sync(nssDirGlob).forEach((potentialNSSDBDir) => {
        debug(`checking to see if ${potentialNSSDBDir} is a valid NSS database directory`);
        if (fs_1.existsSync(path_1.default.join(potentialNSSDBDir, 'cert8.db'))) {
            debug(`Found legacy NSS database in ${potentialNSSDBDir}, running callback...`);
            callback(potentialNSSDBDir, 'legacy');
        }
        if (fs_1.existsSync(path_1.default.join(potentialNSSDBDir, 'cert9.db'))) {
            debug(`Found modern NSS database in ${potentialNSSDBDir}, running callback...`);
            callback(potentialNSSDBDir, 'modern');
        }
    });
}
/**
 *  Given a directory or glob pattern of directories, attempt to install the
 *  CA certificate to each directory containing an NSS database.
 */
function addCertificateToNSSCertDB(nssDirGlob, certPath, certutilPath) {
    debug(`trying to install certificate into NSS databases in ${nssDirGlob}`);
    doForNSSCertDB(nssDirGlob, (dir, version) => {
        const dirArg = version === 'modern' ? `sql:${dir}` : dir;
        utils_1.run(certutilPath, ['-A', '-d', dirArg, '-t', 'C,,', '-i', certPath, '-n', 'devcert']);
    });
    debug(`finished scanning & installing certificate in NSS databases in ${nssDirGlob}`);
}
exports.addCertificateToNSSCertDB = addCertificateToNSSCertDB;
function removeCertificateFromNSSCertDB(nssDirGlob, certPath, certutilPath) {
    debug(`trying to remove certificates from NSS databases in ${nssDirGlob}`);
    doForNSSCertDB(nssDirGlob, (dir, version) => {
        const dirArg = version === 'modern' ? `sql:${dir}` : dir;
        try {
            utils_1.run(certutilPath, ['-A', '-d', dirArg, '-t', 'C,,', '-i', certPath, '-n', 'devcert']);
        }
        catch (e) {
            debug(`failed to remove ${certPath} from ${dir}, continuing. ${e.toString()}`);
        }
    });
    debug(`finished scanning & installing certificate in NSS databases in ${nssDirGlob}`);
}
exports.removeCertificateFromNSSCertDB = removeCertificateFromNSSCertDB;
/**
 *  Check to see if Firefox is still running, and if so, ask the user to close
 *  it. Poll until it's closed, then return.
 *
 * This is needed because Firefox appears to load the NSS database in-memory on
 * startup, and overwrite on exit. So we have to ask the user to quite Firefox
 * first so our changes don't get overwritten.
 */
function closeFirefox() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (isFirefoxOpen()) {
            yield user_interface_1.default.closeFirefoxBeforeContinuing();
            while (isFirefoxOpen()) {
                yield sleep(50);
            }
        }
    });
}
exports.closeFirefox = closeFirefox;
/**
 * Check if Firefox is currently open
 */
function isFirefoxOpen() {
    // NOTE: We use some Windows-unfriendly methods here (ps) because Windows
    // never needs to check this, because it doesn't update the NSS DB
    // automaticaly.
    assert_1.default(constants_1.isMac || constants_1.isLinux, 'checkForOpenFirefox was invoked on a platform other than Mac or Linux');
    return child_process_1.execSync('ps aux').indexOf('firefox') > -1;
}
function sleep(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
/**
 * Firefox manages it's own trust store for SSL certificates, which can be
 * managed via the certutil command (supplied by NSS tooling packages). In the
 * event that certutil is not already installed, and either can't be installed
 * (Windows) or the user doesn't want to install it (skipCertutilInstall:
 * true), it means that we can't programmatically tell Firefox to trust our
 * root CA certificate.
 *
 * There is a recourse though. When a Firefox tab is directed to a URL that
 * responds with a certificate, it will automatically prompt the user if they
 * want to add it to their trusted certificates. So if we can't automatically
 * install the certificate via certutil, we instead start a quick web server
 * and host our certificate file. Then we open the hosted cert URL in Firefox
 * to kick off the GUI flow.
 *
 * This method does all this, along with providing user prompts in the terminal
 * to walk them through this process.
 */
function openCertificateInFirefox(firefoxPath, certPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        debug('Adding devert to Firefox trust stores manually. Launching a webserver to host our certificate temporarily ...');
        let port = yield get_port_1.default();
        let server = http_1.default.createServer((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let { pathname } = url_1.default.parse(req.url);
            if (pathname === '/certificate') {
                res.writeHead(200, { 'Content-type': 'application/x-x509-ca-cert' });
                res.write(fs_1.readFileSync(certPath));
                res.end();
            }
            else {
                res.writeHead(200);
                res.write(yield user_interface_1.default.firefoxWizardPromptPage(`http://localhost:${port}/certificate`));
                res.end();
            }
        })).listen(port);
        debug('Certificate server is up. Printing instructions for user and launching Firefox with hosted certificate URL');
        yield user_interface_1.default.startFirefoxWizard(`http://localhost:${port}`);
        utils_1.run(firefoxPath, [`http://localhost:${port}`]);
        yield user_interface_1.default.waitForFirefoxWizard();
        server.close();
    });
}
exports.openCertificateInFirefox = openCertificateInFirefox;
function assertNotTouchingFiles(filepath, operation) {
    if (!filepath.startsWith(constants_1.configDir) && !filepath.startsWith(constants_1.getLegacyConfigDir())) {
        throw new Error(`Devcert cannot ${operation} ${filepath}; it is outside known devcert config directories!`);
    }
}
exports.assertNotTouchingFiles = assertNotTouchingFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9icmVudC9jb2RlL2RldmNlcnQvIiwic291cmNlcyI6WyJwbGF0Zm9ybXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUF3QjtBQUN4QixzREFBc0I7QUFDdEIsMERBQWdDO0FBQ2hDLDREQUE0QjtBQUM1QixnRUFBK0I7QUFDL0Isd0RBQXdCO0FBQ3hCLCtCQUFvQztBQUNwQywyQkFBb0U7QUFDcEUsb0NBQStCO0FBQy9CLDRDQUE4RTtBQUM5RSwrRUFBbUM7QUFDbkMsaURBQWlEO0FBRWpELE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXREOzs7R0FHRztBQUNILHdCQUF3QixVQUFrQixFQUFFLFFBQTZEO0lBQ3ZHLFdBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO1FBQzdDLEtBQUssQ0FBQyxzQkFBdUIsaUJBQWtCLG9DQUFvQyxDQUFDLENBQUM7UUFDckYsSUFBSSxlQUFNLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFO1lBQ3BELEtBQUssQ0FBQyxnQ0FBaUMsaUJBQWtCLHVCQUF1QixDQUFDLENBQUE7WUFDakYsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxlQUFNLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFO1lBQ3BELEtBQUssQ0FBQyxnQ0FBaUMsaUJBQWtCLHVCQUF1QixDQUFDLENBQUE7WUFDakYsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsbUNBQTBDLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxZQUFvQjtJQUNsRyxLQUFLLENBQUMsdURBQXdELFVBQVcsRUFBRSxDQUFDLENBQUM7SUFDN0UsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUMxQyxNQUFNLE1BQU0sR0FBRyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFRLEdBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDekQsV0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUMsQ0FBQztJQUNILEtBQUssQ0FBQyxrRUFBbUUsVUFBVyxFQUFFLENBQUMsQ0FBQztBQUMxRixDQUFDO0FBUEQsOERBT0M7QUFFRCx3Q0FBK0MsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFlBQW9CO0lBQ3ZHLEtBQUssQ0FBQyx1REFBd0QsVUFBVyxFQUFFLENBQUMsQ0FBQztJQUM3RSxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzFDLE1BQU0sTUFBTSxHQUFHLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQVEsR0FBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMzRCxJQUFJO1lBQ0YsV0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN2RjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsS0FBSyxDQUFDLG9CQUFxQixRQUFTLFNBQVUsR0FBSSxpQkFBa0IsQ0FBQyxDQUFDLFFBQVEsRUFBRyxFQUFFLENBQUMsQ0FBQTtTQUNyRjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLGtFQUFtRSxVQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzFGLENBQUM7QUFYRCx3RUFXQztBQUVEOzs7Ozs7O0dBT0c7QUFDSDs7UUFDRSxJQUFJLGFBQWEsRUFBRSxFQUFFO1lBQ25CLE1BQU0sd0JBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1lBQ3hDLE9BQU0sYUFBYSxFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2pCO1NBQ0Y7SUFDSCxDQUFDO0NBQUE7QUFQRCxvQ0FPQztBQUVEOztHQUVHO0FBQ0g7SUFDRSx5RUFBeUU7SUFDekUsa0VBQWtFO0lBQ2xFLGdCQUFnQjtJQUNoQixnQkFBTSxDQUFDLGlCQUFLLElBQUksbUJBQU8sRUFBRSx1RUFBdUUsQ0FBQyxDQUFDO0lBQ2xHLE9BQU8sd0JBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELGVBQXFCLEVBQVU7O1FBQzdCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQUE7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxrQ0FBK0MsV0FBbUIsRUFBRSxRQUFnQjs7UUFDbEYsS0FBSyxDQUFDLCtHQUErRyxDQUFDLENBQUM7UUFDdkgsSUFBSSxJQUFJLEdBQUcsTUFBTSxrQkFBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxNQUFNLEdBQUcsY0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNoRCxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsYUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBSSxRQUFRLEtBQUssY0FBYyxFQUFFO2dCQUMvQixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLGNBQWMsRUFBRSw0QkFBNEIsRUFBRSxDQUFDLENBQUM7Z0JBQ3JFLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDWDtpQkFBTTtnQkFDTCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sd0JBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxvQkFBcUIsSUFBSyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDWDtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hCLEtBQUssQ0FBQyw0R0FBNEcsQ0FBQyxDQUFDO1FBQ3BILE1BQU0sd0JBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBcUIsSUFBSyxFQUFFLENBQUMsQ0FBQztRQUMxRCxXQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsb0JBQXFCLElBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLHdCQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsQ0FBQztDQUFBO0FBcEJELDREQW9CQztBQUVELGdDQUF1QyxRQUFnQixFQUFFLFNBQWlCO0lBQ3RFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLHFCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsOEJBQWtCLEVBQUUsQ0FBQyxFQUFFO1FBQ2pGLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQW1CLFNBQVUsSUFBSyxRQUFTLG1EQUFtRCxDQUFDLENBQUM7S0FDakg7QUFDTCxDQUFDO0FBSkQsd0RBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgZ2V0UG9ydCBmcm9tICdnZXQtcG9ydCc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IHN5bmMgYXMgZ2xvYiB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIGFzIHJlYWRGaWxlLCBleGlzdHNTeW5jIGFzIGV4aXN0cyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHJ1biB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IGlzTWFjLCBpc0xpbnV4ICwgY29uZmlnRGlyLCBnZXRMZWdhY3lDb25maWdEaXIgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IFVJIGZyb20gJy4uL3VzZXItaW50ZXJmYWNlJztcbmltcG9ydCB7IGV4ZWNTeW5jIGFzIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnZGV2Y2VydDpwbGF0Zm9ybXM6c2hhcmVkJyk7XG5cbi8qKlxuICogIEdpdmVuIGEgZGlyZWN0b3J5IG9yIGdsb2IgcGF0dGVybiBvZiBkaXJlY3RvcmllcywgcnVuIGEgY2FsbGJhY2sgZm9yIGVhY2ggZGJcbiAqICBkaXJlY3RvcnksIHdpdGggYSB2ZXJzaW9uIGFyZ3VtZW50LlxuICovXG5mdW5jdGlvbiBkb0Zvck5TU0NlcnREQihuc3NEaXJHbG9iOiBzdHJpbmcsIGNhbGxiYWNrOiAoZGlyOiBzdHJpbmcsIHZlcnNpb246IFwibGVnYWN5XCIgfCBcIm1vZGVyblwiKSA9PiB2b2lkKTogdm9pZCB7XG4gIGdsb2IobnNzRGlyR2xvYikuZm9yRWFjaCgocG90ZW50aWFsTlNTREJEaXIpID0+IHtcbiAgICBkZWJ1ZyhgY2hlY2tpbmcgdG8gc2VlIGlmICR7IHBvdGVudGlhbE5TU0RCRGlyIH0gaXMgYSB2YWxpZCBOU1MgZGF0YWJhc2UgZGlyZWN0b3J5YCk7XG4gICAgaWYgKGV4aXN0cyhwYXRoLmpvaW4ocG90ZW50aWFsTlNTREJEaXIsICdjZXJ0OC5kYicpKSkge1xuICAgICAgZGVidWcoYEZvdW5kIGxlZ2FjeSBOU1MgZGF0YWJhc2UgaW4gJHsgcG90ZW50aWFsTlNTREJEaXIgfSwgcnVubmluZyBjYWxsYmFjay4uLmApXG4gICAgICBjYWxsYmFjayhwb3RlbnRpYWxOU1NEQkRpciwgJ2xlZ2FjeScpO1xuICAgIH1cbiAgICBpZiAoZXhpc3RzKHBhdGguam9pbihwb3RlbnRpYWxOU1NEQkRpciwgJ2NlcnQ5LmRiJykpKSB7XG4gICAgICBkZWJ1ZyhgRm91bmQgbW9kZXJuIE5TUyBkYXRhYmFzZSBpbiAkeyBwb3RlbnRpYWxOU1NEQkRpciB9LCBydW5uaW5nIGNhbGxiYWNrLi4uYClcbiAgICAgIGNhbGxiYWNrKHBvdGVudGlhbE5TU0RCRGlyLCAnbW9kZXJuJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiAgR2l2ZW4gYSBkaXJlY3Rvcnkgb3IgZ2xvYiBwYXR0ZXJuIG9mIGRpcmVjdG9yaWVzLCBhdHRlbXB0IHRvIGluc3RhbGwgdGhlXG4gKiAgQ0EgY2VydGlmaWNhdGUgdG8gZWFjaCBkaXJlY3RvcnkgY29udGFpbmluZyBhbiBOU1MgZGF0YWJhc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRDZXJ0aWZpY2F0ZVRvTlNTQ2VydERCKG5zc0Rpckdsb2I6IHN0cmluZywgY2VydFBhdGg6IHN0cmluZywgY2VydHV0aWxQYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgZGVidWcoYHRyeWluZyB0byBpbnN0YWxsIGNlcnRpZmljYXRlIGludG8gTlNTIGRhdGFiYXNlcyBpbiAkeyBuc3NEaXJHbG9iIH1gKTtcbiAgZG9Gb3JOU1NDZXJ0REIobnNzRGlyR2xvYiwgKGRpciwgdmVyc2lvbikgPT4ge1xuICAgIGNvbnN0IGRpckFyZyA9IHZlcnNpb24gPT09ICdtb2Rlcm4nID8gYHNxbDokeyBkaXIgfWAgOiBkaXI7XG4gICAgICBydW4oY2VydHV0aWxQYXRoLCBbJy1BJywgJy1kJywgZGlyQXJnLCAnLXQnLCAnQywsJywgJy1pJywgY2VydFBhdGgsICctbicsICdkZXZjZXJ0J10pO1xuICB9KTtcbiAgZGVidWcoYGZpbmlzaGVkIHNjYW5uaW5nICYgaW5zdGFsbGluZyBjZXJ0aWZpY2F0ZSBpbiBOU1MgZGF0YWJhc2VzIGluICR7IG5zc0Rpckdsb2IgfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQ2VydGlmaWNhdGVGcm9tTlNTQ2VydERCKG5zc0Rpckdsb2I6IHN0cmluZywgY2VydFBhdGg6IHN0cmluZywgY2VydHV0aWxQYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgZGVidWcoYHRyeWluZyB0byByZW1vdmUgY2VydGlmaWNhdGVzIGZyb20gTlNTIGRhdGFiYXNlcyBpbiAkeyBuc3NEaXJHbG9iIH1gKTtcbiAgZG9Gb3JOU1NDZXJ0REIobnNzRGlyR2xvYiwgKGRpciwgdmVyc2lvbikgPT4ge1xuICAgIGNvbnN0IGRpckFyZyA9IHZlcnNpb24gPT09ICdtb2Rlcm4nID8gYHNxbDokeyBkaXIgfWAgOiBkaXI7XG4gICAgdHJ5IHtcbiAgICAgIHJ1bihjZXJ0dXRpbFBhdGgsIFsnLUEnLCAnLWQnLCBkaXJBcmcsICctdCcsICdDLCwnLCAnLWknLCBjZXJ0UGF0aCwgJy1uJywgJ2RldmNlcnQnXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoYGZhaWxlZCB0byByZW1vdmUgJHsgY2VydFBhdGggfSBmcm9tICR7IGRpciB9LCBjb250aW51aW5nLiAkeyBlLnRvU3RyaW5nKCkgfWApXG4gICAgfVxuICB9KTtcbiAgZGVidWcoYGZpbmlzaGVkIHNjYW5uaW5nICYgaW5zdGFsbGluZyBjZXJ0aWZpY2F0ZSBpbiBOU1MgZGF0YWJhc2VzIGluICR7IG5zc0Rpckdsb2IgfWApO1xufVxuXG4vKipcbiAqICBDaGVjayB0byBzZWUgaWYgRmlyZWZveCBpcyBzdGlsbCBydW5uaW5nLCBhbmQgaWYgc28sIGFzayB0aGUgdXNlciB0byBjbG9zZVxuICogIGl0LiBQb2xsIHVudGlsIGl0J3MgY2xvc2VkLCB0aGVuIHJldHVybi5cbiAqXG4gKiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIEZpcmVmb3ggYXBwZWFycyB0byBsb2FkIHRoZSBOU1MgZGF0YWJhc2UgaW4tbWVtb3J5IG9uXG4gKiBzdGFydHVwLCBhbmQgb3ZlcndyaXRlIG9uIGV4aXQuIFNvIHdlIGhhdmUgdG8gYXNrIHRoZSB1c2VyIHRvIHF1aXRlIEZpcmVmb3hcbiAqIGZpcnN0IHNvIG91ciBjaGFuZ2VzIGRvbid0IGdldCBvdmVyd3JpdHRlbi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsb3NlRmlyZWZveCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGlzRmlyZWZveE9wZW4oKSkge1xuICAgIGF3YWl0IFVJLmNsb3NlRmlyZWZveEJlZm9yZUNvbnRpbnVpbmcoKTtcbiAgICB3aGlsZShpc0ZpcmVmb3hPcGVuKCkpIHtcbiAgICAgIGF3YWl0IHNsZWVwKDUwKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBGaXJlZm94IGlzIGN1cnJlbnRseSBvcGVuXG4gKi9cbmZ1bmN0aW9uIGlzRmlyZWZveE9wZW4oKSB7XG4gIC8vIE5PVEU6IFdlIHVzZSBzb21lIFdpbmRvd3MtdW5mcmllbmRseSBtZXRob2RzIGhlcmUgKHBzKSBiZWNhdXNlIFdpbmRvd3NcbiAgLy8gbmV2ZXIgbmVlZHMgdG8gY2hlY2sgdGhpcywgYmVjYXVzZSBpdCBkb2Vzbid0IHVwZGF0ZSB0aGUgTlNTIERCXG4gIC8vIGF1dG9tYXRpY2FseS5cbiAgYXNzZXJ0KGlzTWFjIHx8IGlzTGludXgsICdjaGVja0Zvck9wZW5GaXJlZm94IHdhcyBpbnZva2VkIG9uIGEgcGxhdGZvcm0gb3RoZXIgdGhhbiBNYWMgb3IgTGludXgnKTtcbiAgcmV0dXJuIGV4ZWMoJ3BzIGF1eCcpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqIEZpcmVmb3ggbWFuYWdlcyBpdCdzIG93biB0cnVzdCBzdG9yZSBmb3IgU1NMIGNlcnRpZmljYXRlcywgd2hpY2ggY2FuIGJlXG4gKiBtYW5hZ2VkIHZpYSB0aGUgY2VydHV0aWwgY29tbWFuZCAoc3VwcGxpZWQgYnkgTlNTIHRvb2xpbmcgcGFja2FnZXMpLiBJbiB0aGVcbiAqIGV2ZW50IHRoYXQgY2VydHV0aWwgaXMgbm90IGFscmVhZHkgaW5zdGFsbGVkLCBhbmQgZWl0aGVyIGNhbid0IGJlIGluc3RhbGxlZFxuICogKFdpbmRvd3MpIG9yIHRoZSB1c2VyIGRvZXNuJ3Qgd2FudCB0byBpbnN0YWxsIGl0IChza2lwQ2VydHV0aWxJbnN0YWxsOlxuICogdHJ1ZSksIGl0IG1lYW5zIHRoYXQgd2UgY2FuJ3QgcHJvZ3JhbW1hdGljYWxseSB0ZWxsIEZpcmVmb3ggdG8gdHJ1c3Qgb3VyXG4gKiByb290IENBIGNlcnRpZmljYXRlLlxuICpcbiAqIFRoZXJlIGlzIGEgcmVjb3Vyc2UgdGhvdWdoLiBXaGVuIGEgRmlyZWZveCB0YWIgaXMgZGlyZWN0ZWQgdG8gYSBVUkwgdGhhdFxuICogcmVzcG9uZHMgd2l0aCBhIGNlcnRpZmljYXRlLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgcHJvbXB0IHRoZSB1c2VyIGlmIHRoZXlcbiAqIHdhbnQgdG8gYWRkIGl0IHRvIHRoZWlyIHRydXN0ZWQgY2VydGlmaWNhdGVzLiBTbyBpZiB3ZSBjYW4ndCBhdXRvbWF0aWNhbGx5XG4gKiBpbnN0YWxsIHRoZSBjZXJ0aWZpY2F0ZSB2aWEgY2VydHV0aWwsIHdlIGluc3RlYWQgc3RhcnQgYSBxdWljayB3ZWIgc2VydmVyXG4gKiBhbmQgaG9zdCBvdXIgY2VydGlmaWNhdGUgZmlsZS4gVGhlbiB3ZSBvcGVuIHRoZSBob3N0ZWQgY2VydCBVUkwgaW4gRmlyZWZveFxuICogdG8ga2ljayBvZmYgdGhlIEdVSSBmbG93LlxuICpcbiAqIFRoaXMgbWV0aG9kIGRvZXMgYWxsIHRoaXMsIGFsb25nIHdpdGggcHJvdmlkaW5nIHVzZXIgcHJvbXB0cyBpbiB0aGUgdGVybWluYWxcbiAqIHRvIHdhbGsgdGhlbSB0aHJvdWdoIHRoaXMgcHJvY2Vzcy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5DZXJ0aWZpY2F0ZUluRmlyZWZveChmaXJlZm94UGF0aDogc3RyaW5nLCBjZXJ0UGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGRlYnVnKCdBZGRpbmcgZGV2ZXJ0IHRvIEZpcmVmb3ggdHJ1c3Qgc3RvcmVzIG1hbnVhbGx5LiBMYXVuY2hpbmcgYSB3ZWJzZXJ2ZXIgdG8gaG9zdCBvdXIgY2VydGlmaWNhdGUgdGVtcG9yYXJpbHkgLi4uJyk7XG4gIGxldCBwb3J0ID0gYXdhaXQgZ2V0UG9ydCgpO1xuICBsZXQgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgbGV0IHsgcGF0aG5hbWUgfSA9IHVybC5wYXJzZShyZXEudXJsKTtcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvY2VydGlmaWNhdGUnKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCwgeyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0JyB9KTtcbiAgICAgIHJlcy53cml0ZShyZWFkRmlsZShjZXJ0UGF0aCkpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMud3JpdGUoYXdhaXQgVUkuZmlyZWZveFdpemFyZFByb21wdFBhZ2UoYGh0dHA6Ly9sb2NhbGhvc3Q6JHsgcG9ydCB9L2NlcnRpZmljYXRlYCkpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSkubGlzdGVuKHBvcnQpO1xuICBkZWJ1ZygnQ2VydGlmaWNhdGUgc2VydmVyIGlzIHVwLiBQcmludGluZyBpbnN0cnVjdGlvbnMgZm9yIHVzZXIgYW5kIGxhdW5jaGluZyBGaXJlZm94IHdpdGggaG9zdGVkIGNlcnRpZmljYXRlIFVSTCcpO1xuICBhd2FpdCBVSS5zdGFydEZpcmVmb3hXaXphcmQoYGh0dHA6Ly9sb2NhbGhvc3Q6JHsgcG9ydCB9YCk7XG4gIHJ1bihmaXJlZm94UGF0aCwgW2BodHRwOi8vbG9jYWxob3N0OiR7IHBvcnQgfWBdKTtcbiAgYXdhaXQgVUkud2FpdEZvckZpcmVmb3hXaXphcmQoKTtcbiAgc2VydmVyLmNsb3NlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3RUb3VjaGluZ0ZpbGVzKGZpbGVwYXRoOiBzdHJpbmcsIG9wZXJhdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFmaWxlcGF0aC5zdGFydHNXaXRoKGNvbmZpZ0RpcikgJiYgIWZpbGVwYXRoLnN0YXJ0c1dpdGgoZ2V0TGVnYWN5Q29uZmlnRGlyKCkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYERldmNlcnQgY2Fubm90ICR7IG9wZXJhdGlvbiB9ICR7IGZpbGVwYXRoIH07IGl0IGlzIG91dHNpZGUga25vd24gZGV2Y2VydCBjb25maWcgZGlyZWN0b3JpZXMhYCk7XG4gICAgfVxufSJdfQ==