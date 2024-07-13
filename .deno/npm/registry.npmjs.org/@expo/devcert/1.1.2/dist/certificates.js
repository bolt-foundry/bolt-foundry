"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import path from 'path';
const debug_1 = tslib_1.__importDefault(require("debug"));
const mkdirp_1 = require("mkdirp");
const fs_1 = require("fs");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const certificate_authority_1 = require("./certificate-authority");
const debug = debug_1.default('devcert:certificates');
/**
 * Generate a domain certificate signed by the devcert root CA. Domain
 * certificates are cached in their own directories under
 * CONFIG_ROOT/domains/<domain>, and reused on subsequent requests. Because the
 * individual domain certificates are signed by the devcert root CA (which was
 * added to the OS/browser trust stores), they are trusted.
 */
function generateDomainCertificate(domain) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        mkdirp_1.sync(constants_1.pathForDomain(domain));
        debug(`Generating private key for ${domain}`);
        let domainKeyPath = constants_1.pathForDomain(domain, 'private-key.key');
        generateKey(domainKeyPath);
        debug(`Generating certificate signing request for ${domain}`);
        let csrFile = constants_1.pathForDomain(domain, `certificate-signing-request.csr`);
        constants_1.withDomainSigningRequestConfig(domain, (configpath) => {
            utils_1.openssl(['req', '-new', '-config', configpath, '-key', domainKeyPath, '-out', csrFile]);
        });
        debug(`Generating certificate for ${domain} from signing request and signing with root CA`);
        let domainCertPath = constants_1.pathForDomain(domain, `certificate.crt`);
        yield certificate_authority_1.withCertificateAuthorityCredentials(({ caKeyPath, caCertPath }) => {
            constants_1.withDomainCertificateConfig(domain, (domainCertConfigPath) => {
                utils_1.openssl(['ca', '-config', domainCertConfigPath, '-in', csrFile, '-out', domainCertPath, '-keyfile', caKeyPath, '-cert', caCertPath, '-days', '825', '-batch']);
            });
        });
    });
}
exports.default = generateDomainCertificate;
// Generate a cryptographic key, used to sign certificates or certificate signing requests.
function generateKey(filename) {
    debug(`generateKey: ${filename}`);
    utils_1.openssl(['genrsa', '-out', filename, '2048']);
    fs_1.chmodSync(filename, 400);
}
exports.generateKey = generateKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGVzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9icmVudC9jb2RlL2RldmNlcnQvIiwic291cmNlcyI6WyJjZXJ0aWZpY2F0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQTJCO0FBQzNCLDBEQUFnQztBQUNoQyxtQ0FBd0M7QUFDeEMsMkJBQXdDO0FBQ3hDLDJDQUF5RztBQUN6RyxtQ0FBa0M7QUFDbEMsbUVBQThFO0FBRTlFLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRWxEOzs7Ozs7R0FNRztBQUNILG1DQUF3RCxNQUFjOztRQUNwRSxhQUFNLENBQUMseUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyw4QkFBK0IsTUFBTyxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLGFBQWEsR0FBRyx5QkFBYSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUzQixLQUFLLENBQUMsOENBQStDLE1BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcseUJBQWEsQ0FBQyxNQUFNLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztRQUN2RSwwQ0FBOEIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNwRCxlQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyw4QkFBK0IsTUFBTyxnREFBZ0QsQ0FBQyxDQUFDO1FBQzlGLElBQUksY0FBYyxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFOUQsTUFBTSwyREFBbUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUU7WUFDdEUsdUNBQTJCLENBQUMsTUFBTSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsRUFBRTtnQkFDM0QsZUFBTyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUNoSyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBckJELDRDQXFCQztBQUVELDJGQUEyRjtBQUMzRixxQkFBNEIsUUFBZ0I7SUFDMUMsS0FBSyxDQUFDLGdCQUFpQixRQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLGVBQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUMsY0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBSkQsa0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyBzeW5jIGFzIG1rZGlycCB9IGZyb20gJ21rZGlycCc7XG5pbXBvcnQgeyBjaG1vZFN5bmMgYXMgY2htb2QgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBwYXRoRm9yRG9tYWluLCB3aXRoRG9tYWluU2lnbmluZ1JlcXVlc3RDb25maWcsIHdpdGhEb21haW5DZXJ0aWZpY2F0ZUNvbmZpZyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IG9wZW5zc2wgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHdpdGhDZXJ0aWZpY2F0ZUF1dGhvcml0eUNyZWRlbnRpYWxzIH0gZnJvbSAnLi9jZXJ0aWZpY2F0ZS1hdXRob3JpdHknO1xuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKCdkZXZjZXJ0OmNlcnRpZmljYXRlcycpO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgZG9tYWluIGNlcnRpZmljYXRlIHNpZ25lZCBieSB0aGUgZGV2Y2VydCByb290IENBLiBEb21haW5cbiAqIGNlcnRpZmljYXRlcyBhcmUgY2FjaGVkIGluIHRoZWlyIG93biBkaXJlY3RvcmllcyB1bmRlclxuICogQ09ORklHX1JPT1QvZG9tYWlucy88ZG9tYWluPiwgYW5kIHJldXNlZCBvbiBzdWJzZXF1ZW50IHJlcXVlc3RzLiBCZWNhdXNlIHRoZVxuICogaW5kaXZpZHVhbCBkb21haW4gY2VydGlmaWNhdGVzIGFyZSBzaWduZWQgYnkgdGhlIGRldmNlcnQgcm9vdCBDQSAod2hpY2ggd2FzXG4gKiBhZGRlZCB0byB0aGUgT1MvYnJvd3NlciB0cnVzdCBzdG9yZXMpLCB0aGV5IGFyZSB0cnVzdGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZURvbWFpbkNlcnRpZmljYXRlKGRvbWFpbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIG1rZGlycChwYXRoRm9yRG9tYWluKGRvbWFpbikpO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIHByaXZhdGUga2V5IGZvciAkeyBkb21haW4gfWApO1xuICBsZXQgZG9tYWluS2V5UGF0aCA9IHBhdGhGb3JEb21haW4oZG9tYWluLCAncHJpdmF0ZS1rZXkua2V5Jyk7XG4gIGdlbmVyYXRlS2V5KGRvbWFpbktleVBhdGgpO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIGNlcnRpZmljYXRlIHNpZ25pbmcgcmVxdWVzdCBmb3IgJHsgZG9tYWluIH1gKTtcbiAgbGV0IGNzckZpbGUgPSBwYXRoRm9yRG9tYWluKGRvbWFpbiwgYGNlcnRpZmljYXRlLXNpZ25pbmctcmVxdWVzdC5jc3JgKTtcbiAgd2l0aERvbWFpblNpZ25pbmdSZXF1ZXN0Q29uZmlnKGRvbWFpbiwgKGNvbmZpZ3BhdGgpID0+IHtcbiAgICBvcGVuc3NsKFsncmVxJywgJy1uZXcnLCAnLWNvbmZpZycsIGNvbmZpZ3BhdGgsICcta2V5JywgZG9tYWluS2V5UGF0aCwgJy1vdXQnLCBjc3JGaWxlXSk7XG4gIH0pO1xuXG4gIGRlYnVnKGBHZW5lcmF0aW5nIGNlcnRpZmljYXRlIGZvciAkeyBkb21haW4gfSBmcm9tIHNpZ25pbmcgcmVxdWVzdCBhbmQgc2lnbmluZyB3aXRoIHJvb3QgQ0FgKTtcbiAgbGV0IGRvbWFpbkNlcnRQYXRoID0gcGF0aEZvckRvbWFpbihkb21haW4sIGBjZXJ0aWZpY2F0ZS5jcnRgKTtcblxuICBhd2FpdCB3aXRoQ2VydGlmaWNhdGVBdXRob3JpdHlDcmVkZW50aWFscygoeyBjYUtleVBhdGgsIGNhQ2VydFBhdGggfSkgPT4ge1xuICAgIHdpdGhEb21haW5DZXJ0aWZpY2F0ZUNvbmZpZyhkb21haW4sIChkb21haW5DZXJ0Q29uZmlnUGF0aCkgPT4ge1xuICAgICAgb3BlbnNzbChbJ2NhJywgJy1jb25maWcnLCBkb21haW5DZXJ0Q29uZmlnUGF0aCwgJy1pbicsIGNzckZpbGUsICctb3V0JywgZG9tYWluQ2VydFBhdGgsICcta2V5ZmlsZScsIGNhS2V5UGF0aCwgJy1jZXJ0JywgY2FDZXJ0UGF0aCwgJy1kYXlzJywgJzgyNScsICctYmF0Y2gnXSlcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIEdlbmVyYXRlIGEgY3J5cHRvZ3JhcGhpYyBrZXksIHVzZWQgdG8gc2lnbiBjZXJ0aWZpY2F0ZXMgb3IgY2VydGlmaWNhdGUgc2lnbmluZyByZXF1ZXN0cy5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUtleShmaWxlbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGRlYnVnKGBnZW5lcmF0ZUtleTogJHsgZmlsZW5hbWUgfWApO1xuICBvcGVuc3NsKFsnZ2VucnNhJywgJy1vdXQnLCBmaWxlbmFtZSwgJzIwNDgnXSk7XG4gIGNobW9kKGZpbGVuYW1lLCA0MDApO1xufSJdfQ==