"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var test_helpers_1 = require("../test-helpers");
describe('list', function () {
    var pinecone, index, ns, namespace, prefix;
    var recordIds = [];
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var recordsToUpsert, upsertedIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pinecone = new index_1.Pinecone();
                    return [4 /*yield*/, pinecone.createIndex({
                            name: test_helpers_1.INDEX_NAME,
                            dimension: 5,
                            metric: 'cosine',
                            spec: {
                                serverless: {
                                    region: 'us-west-2',
                                    cloud: 'aws',
                                },
                            },
                            waitUntilReady: true,
                            suppressConflicts: true,
                        })];
                case 1:
                    _a.sent();
                    namespace = (0, test_helpers_1.randomString)(16);
                    index = pinecone.index(test_helpers_1.INDEX_NAME);
                    ns = index.namespace(namespace);
                    prefix = 'preTest';
                    recordsToUpsert = (0, test_helpers_1.generateRecords)({
                        dimension: 5,
                        quantity: 120,
                        prefix: prefix,
                    });
                    upsertedIds = recordsToUpsert.map(function (r) { return r.id; });
                    return [4 /*yield*/, ns.upsert(recordsToUpsert)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_helpers_1.waitUntilRecordsReady)(ns, namespace, upsertedIds)];
                case 3:
                    _a.sent();
                    recordIds.concat(upsertedIds);
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ns.deleteAll()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('listPaginated', function () {
        test('test listPaginated with no arguments', function () { return __awaiter(void 0, void 0, void 0, function () {
            var listResults;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, index.listPaginated()];
                    case 1:
                        listResults = _b.sent();
                        expect(listResults).toBeDefined();
                        expect(listResults.pagination).not.toBeDefined();
                        expect((_a = listResults.vectors) === null || _a === void 0 ? void 0 : _a.length).toBe(0);
                        expect(listResults.namespace).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
        test('test listPaginated with prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var listResults;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ns.listPaginated({ prefix: prefix })];
                    case 1:
                        listResults = _c.sent();
                        expect(listResults.namespace).toBe(namespace);
                        expect((_a = listResults.vectors) === null || _a === void 0 ? void 0 : _a.length).toBe(100);
                        expect((_b = listResults.pagination) === null || _b === void 0 ? void 0 : _b.next).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        test('test listPaginated with limit and pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            var listResults, listResultsPg2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, ns.listPaginated({ prefix: prefix, limit: 60 })];
                    case 1:
                        listResults = _e.sent();
                        expect(listResults.namespace).toBe(namespace);
                        expect((_a = listResults.vectors) === null || _a === void 0 ? void 0 : _a.length).toBe(60);
                        expect((_b = listResults.pagination) === null || _b === void 0 ? void 0 : _b.next).toBeDefined();
                        return [4 /*yield*/, ns.listPaginated({
                                prefix: prefix,
                                limit: 60,
                                paginationToken: (_c = listResults.pagination) === null || _c === void 0 ? void 0 : _c.next,
                            })];
                    case 2:
                        listResultsPg2 = _e.sent();
                        expect(listResultsPg2.namespace).toBe(namespace);
                        expect((_d = listResultsPg2.vectors) === null || _d === void 0 ? void 0 : _d.length).toBe(60);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=list.test.js.map