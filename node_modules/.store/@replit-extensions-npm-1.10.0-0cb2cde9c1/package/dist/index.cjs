"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ChangeEventType: () => ChangeEventType,
  ColorScheme: () => ColorScheme,
  Command: () => Command,
  CommandSymbol: () => CommandSymbol,
  ContributionType: () => ContributionType,
  FsNodeType: () => FsNodeType,
  HandshakeStatus: () => HandshakeStatus,
  UserSocialType: () => UserSocialType,
  commands: () => commands_exports,
  copyFile: () => copyFile,
  createDir: () => createDir,
  data: () => data_exports,
  debug: () => debug_exports,
  deleteDir: () => deleteDir,
  deleteFile: () => deleteFile,
  exec: () => exec_exports,
  experimental: () => experimental_exports,
  extensionPort: () => extensionPort,
  fs: () => fs_exports,
  init: () => init,
  internal: () => internal_exports,
  isCommandProxy: () => isCommandProxy,
  me: () => me_exports,
  messages: () => messages_exports,
  move: () => move,
  proxy: () => proxy2,
  readDir: () => readDir,
  readFile: () => readFile,
  replDb: () => replDb_exports,
  session: () => session_exports,
  themes: () => theme_exports,
  version: () => version,
  watchDir: () => watchDir,
  watchFile: () => watchFile,
  watchTextFile: () => watchTextFile,
  writeFile: () => writeFile
});
module.exports = __toCommonJS(src_exports);

// src/types/fs.ts
var FsNodeType = /* @__PURE__ */ ((FsNodeType2) => {
  FsNodeType2["File"] = "FILE";
  FsNodeType2["Directory"] = "DIRECTORY";
  return FsNodeType2;
})(FsNodeType || {});
var ChangeEventType = /* @__PURE__ */ ((ChangeEventType2) => {
  ChangeEventType2["Create"] = "CREATE";
  ChangeEventType2["Move"] = "MOVE";
  ChangeEventType2["Delete"] = "DELETE";
  ChangeEventType2["Modify"] = "MODIFY";
  return ChangeEventType2;
})(ChangeEventType || {});

// src/types/themes.ts
var ColorScheme = /* @__PURE__ */ ((ColorScheme2) => {
  ColorScheme2["Light"] = "light";
  ColorScheme2["Dark"] = "dark";
  return ColorScheme2;
})(ColorScheme || {});

// src/types/data.ts
var UserSocialType = /* @__PURE__ */ ((UserSocialType2) => {
  UserSocialType2["twitter"] = "twitter";
  UserSocialType2["github"] = "github";
  UserSocialType2["linkedin"] = "linkedin";
  UserSocialType2["website"] = "website";
  UserSocialType2["youtube"] = "youtube";
  UserSocialType2["twitch"] = "twitch";
  UserSocialType2["facebook"] = "facebook";
  UserSocialType2["discord"] = "discord";
  return UserSocialType2;
})(UserSocialType || {});

// src/types/index.ts
var HandshakeStatus = /* @__PURE__ */ ((HandshakeStatus2) => {
  HandshakeStatus2["Ready"] = "ready";
  HandshakeStatus2["Error"] = "error";
  HandshakeStatus2["Loading"] = "loading";
  return HandshakeStatus2;
})(HandshakeStatus || {});

// src/util/comlink.ts
var Comlink = __toESM(require("comlink"), 1);
var extensionPort = (() => typeof window !== "undefined" ? Comlink.wrap(
  Comlink.windowEndpoint(self.parent, self, "*")
) : null)();
var proxy2 = Comlink.proxy;

// src/util/handshake.ts
var handshakeStatus = "loading" /* Loading */;
var setHandshakeStatus = (status) => {
  handshakeStatus = status;
};
var getHandshakeStatus = () => handshakeStatus;

// src/api/fs/index.ts
var fs_exports = {};
__export(fs_exports, {
  copyFile: () => copyFile,
  createDir: () => createDir,
  deleteDir: () => deleteDir,
  deleteFile: () => deleteFile,
  move: () => move,
  readDir: () => readDir,
  readFile: () => readFile,
  watchDir: () => watchDir,
  watchFile: () => watchFile,
  watchTextFile: () => watchTextFile,
  writeFile: () => writeFile
});

// src/api/fs/watching.ts
var import_state = require("@codemirror/state");
function changeSetToSimpleTextChange(changes) {
  const simpleChanges = [];
  changes.iterChanges((fromA, toA, _fromB, _toB, text) => {
    const change = { from: fromA };
    if (toA > fromA) {
      change.to = toA;
    }
    if (text.length) {
      change.insert = text.sliceString(0);
    }
    simpleChanges.push(change);
  });
  return simpleChanges;
}
var TextFileWatcher = class {
  constructor(path, listeners) {
    this.path = path;
    this.listeners = listeners;
    this.state = null;
    this.isDisposed = false;
    this.dispose = () => {
      this.isDisposed = true;
    };
    if (!extensionPort) {
      throw new Error("Expected extensionPort");
    }
    extensionPort.watchTextFile(
      this.path,
      proxy2({
        onReady: this.handleReady.bind(this),
        // wrongly typed at extensionPort
        onChange: this.handleChange.bind(this),
        onMoveOrDelete: (event) => {
          listeners.onMoveOrDelete(event);
        },
        onError: (error2) => {
          listeners.onError(error2);
        }
      })
    ).then((portDispose) => {
      if (this.isDisposed) {
        portDispose();
        return;
      }
      this.dispose = () => {
        this.isDisposed = true;
        portDispose();
      };
    });
  }
  /*
   * TODO: what do we do with out of order messages, postMessage has no guarantees of order
   * TODO: we need versioning to guarantee correctness. Related to above, using async/await doesn't guarantee that our change got applied before the next incoming change and vice versa
   */
  state;
  isDisposed;
  dispose;
  writeChange(changes) {
    if (this.isDisposed) {
      throw new Error("Wrote change on a disposed TextFileWatcher");
    }
    if (!this.state) {
      throw new Error("Tried to write changes before ready");
    }
    const changeSet = import_state.ChangeSet.of(changes, this.state.localText.length);
    this.state.localText = changeSet.apply(this.state.localText);
    this.enqueueChangeSet(changeSet);
  }
  getLatestContent() {
    if (this.isDisposed) {
      throw new Error("Cannot get content of a disposed TextFileWatcher");
    }
    if (!this.state) {
      throw new Error("Called getLatestContent on an unready TextFileWatcher");
    }
    return this.state.localText.sliceString(0);
  }
  getIsReady() {
    if (this.isDisposed) {
      throw new Error("Cannot get isReady of a disposed TextFileWatcher");
    }
    return Boolean(this.state);
  }
  async handleReady({
    writeChange,
    initialContent
  }) {
    if (this.isDisposed) {
      return;
    }
    const content = import_state.Text.of((await initialContent).split("\n"));
    this.state = {
      requestWriteChange: writeChange,
      localText: content,
      remoteText: content,
      unconfirmedChanges: /* @__PURE__ */ new Set()
    };
    this.listeners.onReady();
  }
  handleChange({ changes: changeJSON }) {
    if (this.isDisposed) {
      return;
    }
    if (!this.state) {
      throw new Error("unexpected handleOnChange called before handleOnReady");
    }
    let changes = import_state.ChangeSet.fromJSON(changeJSON);
    this.state.remoteText = changes.apply(this.state.remoteText);
    for (const unconfirmed of this.state.unconfirmedChanges) {
      const unconfirmedUpdated = unconfirmed.changes.map(changes);
      changes = changes.map(unconfirmed.changes, true);
      unconfirmed.changes = unconfirmedUpdated;
    }
    this.state.localText = changes.apply(this.state.localText);
    this.listeners.onChange({
      changes: changeSetToSimpleTextChange(changes),
      latestContent: this.getLatestContent()
    });
  }
  async enqueueChangeSet(changes) {
    if (this.isDisposed) {
      throw new Error("Wrote change on a disposed TextFileWatcher");
    }
    if (!this.state) {
      throw new Error("Tried to write changes before ready");
    }
    const ref = { changes };
    this.state.unconfirmedChanges.add(ref);
    await this.state.requestWriteChange(
      changeSetToSimpleTextChange(ref.changes)
    );
    this.state.unconfirmedChanges.delete(ref);
    this.state.remoteText = ref.changes.apply(this.state.remoteText);
  }
};
var FileWatcherManager = class {
  files;
  constructor() {
    this.files = /* @__PURE__ */ new Map();
  }
  watch(path, listeners) {
    if (this.files.has(path)) {
      this.watchExisting(path, listeners);
    } else {
      this.watchNew(path, listeners);
    }
    return () => {
      const file = this.files.get(path);
      if (!file) {
        return;
      }
      file.listeners.delete(listeners);
      if (file.listeners.size === 0) {
        this.dispose(path);
      }
    };
  }
  dispose(path) {
    const file = this.files.get(path);
    if (!file) {
      return;
    }
    file.watcher.dispose();
    this.files.delete(path);
  }
  watchNew(path, listeners) {
    const watcher = new TextFileWatcher(path, {
      onReady: () => {
        this.handleReady(path);
      },
      onChange: (changeEvent) => {
        this.handleChange(path, changeEvent);
      },
      onMoveOrDelete: (event) => {
        this.handleMoveOrDelete(path, event);
      },
      onError: (error2) => {
        this.handleError(path, error2);
      }
    });
    this.files.set(path, {
      listeners: /* @__PURE__ */ new Set([listeners]),
      watcher
    });
  }
  watchExisting(path, listeners) {
    const file = this.files.get(path);
    if (!file) {
      throw new Error("file is not watched");
    }
    file.listeners.add(listeners);
  }
  handleChange(path, changeEvent) {
    const file = this.files.get(path);
    if (!file) {
      throw new Error("Unexpected change on a non-watched file");
    }
    if (!file.watcher.getIsReady()) {
      throw new Error("Unexpected change on a non-ready file");
    }
    for (const { onChange } of file.listeners) {
      if (!onChange) {
        continue;
      }
      onChange(changeEvent);
    }
  }
  handleReady(path) {
    const file = this.files.get(path);
    if (!file) {
      throw new Error("Unexpected change on a non-watched file");
    }
    if (!file.watcher.getIsReady()) {
      throw new Error("Got ready on a non-ready file :/");
    }
    const initialContent = file.watcher.getLatestContent();
    for (const { onReady, onChange } of file.listeners) {
      onReady({
        initialContent,
        getLatestContent: () => file.watcher.getLatestContent(),
        writeChange: (changes) => {
          file.watcher.writeChange(changes);
          for (const { onChange: otherOnChange } of file.listeners) {
            if (onChange === otherOnChange) {
              continue;
            }
            if (!otherOnChange) {
              continue;
            }
            otherOnChange({
              changes: Array.isArray(changes) ? changes : [changes],
              latestContent: file.watcher.getLatestContent()
            });
          }
        }
      });
    }
  }
  handleError(path, error2) {
    const file = this.files.get(path);
    if (!file) {
      throw new Error("Unexpected error on a non-watched file");
    }
    for (const { onError } of file.listeners) {
      if (!onError) {
        continue;
      }
      onError(error2);
    }
    this.dispose(path);
  }
  handleMoveOrDelete(path, event) {
    const file = this.files.get(path);
    if (!file) {
      throw new Error("Unexpected move or delete event on a non-watched file");
    }
    for (const { onMoveOrDelete } of file.listeners) {
      if (!onMoveOrDelete) {
        continue;
      }
      onMoveOrDelete(event);
    }
    this.dispose(path);
  }
};
var fileWatcherManager = new FileWatcherManager();

// src/api/fs/index.ts
async function readFile(path, encoding = "utf8") {
  return extensionPort.readFile(path, encoding);
}
async function writeFile(path, content) {
  return extensionPort.writeFile(path, content);
}
async function readDir(path) {
  return extensionPort.readDir(path);
}
async function createDir(path) {
  return extensionPort.createDir(path);
}
async function deleteFile(path) {
  return extensionPort.deleteFile(path);
}
async function deleteDir(path) {
  return extensionPort.deleteDir(path);
}
async function move(path, to) {
  return extensionPort.move(path, to);
}
async function copyFile(path, to) {
  return extensionPort.copyFile(path, to);
}
async function watchFile(path, listeners, encoding = "binary") {
  return extensionPort.watchFile(
    path,
    proxy2({
      onMoveOrDelete: () => {
      },
      onError: () => {
      },
      ...listeners
    }),
    encoding
  );
}
async function watchDir(path, listeners) {
  return extensionPort.watchDir(
    path,
    proxy2({
      onMoveOrDelete: () => {
      },
      ...listeners
    })
  );
}
function watchTextFile(path, listeners) {
  return fileWatcherManager.watch(path, listeners);
}

// src/api/replDb.ts
var replDb_exports = {};
__export(replDb_exports, {
  del: () => del,
  get: () => get,
  list: () => list,
  set: () => set
});
async function set(args) {
  return extensionPort.setReplDbValue(args.key, args.value);
}
async function get(args) {
  return extensionPort.getReplDbValue(args.key);
}
async function list(args = {}) {
  return extensionPort.listReplDbKeys(args?.prefix || "");
}
async function del(args) {
  return extensionPort.deleteReplDbKey(args.key);
}

// src/api/me.ts
var me_exports = {};
__export(me_exports, {
  filePath: () => filePath
});
function filePath() {
  return extensionPort.filePath;
}

// src/api/theme.ts
var theme_exports = {};
__export(theme_exports, {
  getCurrentTheme: () => getCurrentTheme,
  getCurrentThemeValues: () => getCurrentThemeValues,
  onThemeChange: () => onThemeChange,
  onThemeChangeValues: () => onThemeChangeValues
});
var import_comlink5 = require("comlink");
async function getCurrentTheme() {
  return await extensionPort.getCurrentTheme();
}
async function getCurrentThemeValues() {
  return await extensionPort.getCurrentThemeValues();
}
async function onThemeChange(callback) {
  return await extensionPort.onThemeChange((0, import_comlink5.proxy)(callback));
}
async function onThemeChangeValues(callback) {
  return await extensionPort.onThemeChangeValues((0, import_comlink5.proxy)(callback));
}

// src/api/messages.ts
var messages_exports = {};
__export(messages_exports, {
  hideAllMessages: () => hideAllMessages,
  hideMessage: () => hideMessage,
  showConfirm: () => showConfirm,
  showError: () => showError,
  showNotice: () => showNotice,
  showWarning: () => showWarning
});
var showConfirm = async (str, length = 4e3) => {
  if (typeof str !== "string") {
    throw new Error("Messages must be strings");
  }
  return extensionPort.showConfirm(str, length);
};
var showError = async (str, length = 4e3) => {
  if (typeof str !== "string") {
    throw new Error("Messages must be strings");
  }
  return extensionPort.showError(str, length);
};
var showNotice = async (str, length = 4e3) => {
  if (typeof str !== "string") {
    throw new Error("Messages must be strings");
  }
  return extensionPort.showNotice(str, length);
};
var showWarning = async (str, length = 4e3) => {
  if (typeof str !== "string") {
    throw new Error("Messages must be strings");
  }
  return extensionPort.showWarning(str, length);
};
var hideMessage = async (id) => {
  return extensionPort.hideMessage(id);
};
var hideAllMessages = async () => {
  return extensionPort.hideAllMessages();
};

// src/api/data.ts
var data_exports = {};
__export(data_exports, {
  currentRepl: () => currentRepl,
  currentUser: () => currentUser,
  replById: () => replById,
  replByUrl: () => replByUrl,
  userById: () => userById,
  userByUsername: () => userByUsername
});
async function currentUser(args = {}) {
  return await extensionPort.currentUser(args);
}
async function userById(args) {
  if (typeof args.id !== "number") {
    throw new Error(
      `Query parameter "id" must be a number.  Found type ${typeof args.id} instead.`
    );
  }
  return await extensionPort.userById(args);
}
async function userByUsername(args) {
  if (typeof args.username !== "string") {
    throw new Error(
      `Query parameter "username" must be a string.  Found type ${typeof args.username} instead.`
    );
  }
  return await extensionPort.userByUsername(args);
}
async function currentRepl(args = {}) {
  return await extensionPort.currentRepl(args);
}
async function replById(args) {
  if (typeof args.id !== "string") {
    throw new Error(
      `Query parameter "id" must be a string.  Found type ${typeof args.id} instead.`
    );
  }
  return await extensionPort.replById(args);
}
async function replByUrl(args) {
  if (typeof args.url !== "string") {
    throw new Error(
      `Query parameter "url" must be a string.  Found type ${typeof args.url} instead.`
    );
  }
  return await extensionPort.replByUrl(args);
}

// src/api/session.ts
var session_exports = {};
__export(session_exports, {
  getActiveFile: () => getActiveFile,
  onActiveFileChange: () => onActiveFileChange
});
function onActiveFileChange(listener) {
  let dispose = () => {
    console.log("disposing existing watcher");
  };
  extensionPort.watchActiveFile(proxy2(listener)).then((d) => {
    dispose = d;
  });
  return () => {
    dispose();
  };
}
async function getActiveFile() {
  return await extensionPort.getActiveFile();
}

// src/api/experimental/index.ts
var experimental_exports = {};
__export(experimental_exports, {
  auth: () => auth_exports,
  commands: () => commands_exports,
  editor: () => editor_exports
});

// src/api/experimental/auth.ts
var auth_exports = {};
__export(auth_exports, {
  authenticate: () => authenticate,
  getAuthToken: () => getAuthToken,
  verifyAuthToken: () => verifyAuthToken
});

// src/auth/ed25519.ts
var import_ed25519 = require("@noble/curves/ed25519");
var import_utils = require("@noble/curves/abstract/utils");
var asn1 = __toESM(require("@root/asn1"), 1);
var import_b64u_lite = require("b64u-lite");
var C = {
  wicgAlgorithm: "Ed25519",
  nodeAlgorithm: "NODE-ED25519",
  nodeNamedCurve: "NODE-ED25519",
  kty: "OKP",
  crv: "Ed25519",
  oid: "2B6570".toLowerCase()
};
function isEd25519Algorithm(a) {
  return a === C.wicgAlgorithm || a === C.nodeAlgorithm || a.name === C.wicgAlgorithm || a.name === C.nodeAlgorithm && a.namedCurve === C.nodeNamedCurve;
}
var Ed25519Algorithm = {
  name: C.wicgAlgorithm
};
function asUint8Array(b) {
  if (b instanceof Uint8Array) {
    return b;
  }
  if (b instanceof ArrayBuffer) {
    return new Uint8Array(b);
  }
  return new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
}
function asArrayBuffer(b) {
  if (b.byteLength === b.buffer.byteLength) {
    return b.buffer;
  }
  return b.buffer.slice(b.byteOffset, b.byteLength);
}
var slot = "8d9df0f7-1363-4d2c-8152-ce4ed78f27d8";
var Ponyfill = class {
  constructor(super_) {
    this.super_ = super_;
    this.orig_ = {};
    for (const method of [
      "generateKey",
      "exportKey",
      "importKey",
      "encrypt",
      "decrypt",
      "wrapKey",
      "unwrapKey",
      "deriveBits",
      "deriveKey",
      "sign",
      "verify",
      "digest"
    ]) {
      if (this[method]) {
        this.orig_[method] = super_[method];
      } else {
        this[method] = super_[method].bind(super_);
      }
    }
  }
  orig_;
  async generateKey(algorithm, extractable, keyUsages) {
    if (isEd25519Algorithm(algorithm)) {
      const pvt = import_ed25519.ed25519.utils.randomPrivateKey();
      const pub = await import_ed25519.ed25519.getPublicKey(pvt);
      const usages = Array.from(keyUsages);
      const privateKey = {
        algorithm,
        extractable,
        type: "private",
        usages,
        [slot]: pvt
      };
      const publicKey = {
        algorithm,
        extractable: true,
        type: "public",
        usages,
        [slot]: pub
      };
      return { privateKey, publicKey };
    }
    return this.orig_.generateKey.apply(this.super_, arguments);
  }
  async exportKey(format, key) {
    if (isEd25519Algorithm(key.algorithm) && key.extractable) {
      const raw = key[slot];
      switch (format) {
        case "jwk": {
          const jwk = {
            kty: C.kty,
            crv: C.crv
          };
          if (key.type === "public") {
            jwk.x = (0, import_b64u_lite.toBase64Url)(raw);
          } else {
            jwk.d = (0, import_b64u_lite.toBase64Url)(raw);
            jwk.x = (0, import_b64u_lite.toBase64Url)(await import_ed25519.ed25519.getPublicKey(raw));
          }
          return jwk;
        }
        case "spki": {
          return asArrayBuffer(
            asn1.pack([
              "30",
              [
                ["30", [["06", "2B6570"]]],
                ["03", raw]
              ]
            ])
          );
        }
      }
    }
    return this.orig_.exportKey.apply(this.super_, arguments);
  }
  async importKey(format, keyData, algorithm, extractable, keyUsages) {
    if (isEd25519Algorithm(algorithm)) {
      const usages = Array.from(keyUsages);
      switch (format) {
        case "jwk": {
          const jwk = keyData;
          if (jwk.kty !== C.kty || jwk.crv !== C.crv || !jwk.x) {
            break;
          }
          const key = {
            algorithm,
            extractable,
            type: jwk.d ? "private" : "public",
            usages,
            [slot]: (0, import_b64u_lite.toBuffer)(jwk.d ?? jwk.x)
          };
          return key;
        }
        case "spki": {
          const der = asn1.parseVerbose(asUint8Array(keyData));
          const algo = der.children?.[0]?.children?.[0]?.value;
          const raw = der.children?.[1]?.value;
          if (!(algo instanceof Uint8Array) || (0, import_utils.bytesToHex)(algo) !== C.oid || !(raw instanceof Uint8Array)) {
            break;
          }
          const key = {
            algorithm,
            extractable: true,
            type: "public",
            usages,
            [slot]: raw
          };
          return key;
        }
      }
    }
    return this.orig_.importKey.apply(this.super_, arguments);
  }
  async sign(algorithm, key, data) {
    if (isEd25519Algorithm(algorithm) && isEd25519Algorithm(key.algorithm) && key.type === "private" && key.usages.includes("sign")) {
      return asArrayBuffer(
        await import_ed25519.ed25519.sign(asUint8Array(data), key[slot])
      );
    }
    return this.orig_.sign.apply(this.super_, arguments);
  }
  async verify(algorithm, key, signature, data) {
    if (isEd25519Algorithm(algorithm) && isEd25519Algorithm(key.algorithm) && key.type === "public" && key.usages.includes("verify")) {
      const s = asUint8Array(signature);
      const m = asUint8Array(data);
      const p = key[slot];
      return import_ed25519.ed25519.verify(s, m, p);
    }
    return this.orig_.verify.apply(this.super_, arguments);
  }
};
function ponyfillEd25519(subtle = crypto.subtle) {
  if (!subtle) {
    console.warn(`polyfill ed25519: crypto.subtle is not available`);
    return null;
  }
  return new Ponyfill(subtle);
}

// src/auth/base64.ts
var decoder = new TextDecoder();
var decodeBrowser = (input) => {
  const decodeBase64 = (encoded2) => {
    const binary = atob(encoded2);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};
var decodeNode = (input) => {
  function normalize(input2) {
    let encoded = input2;
    if (encoded instanceof Uint8Array) {
      encoded = decoder.decode(encoded);
    }
    return encoded;
  }
  return Buffer.from(normalize(input), "base64");
};
function decode(input) {
  if (typeof process === "undefined") {
    return decodeBrowser(input);
  } else {
    return decodeNode(input);
  }
}

// src/auth/verify.ts
var TOLERANCE = 60;
function decodeComponentToJSON(component) {
  try {
    return JSON.parse(decoder2.decode(decode(component)));
  } catch (e) {
    throw new Error("Invalid JWT. Failed to parse component");
  }
}
function decodeProtectedHeader(token) {
  const { 0: protectedHeader } = token.split(".");
  if (typeof protectedHeader !== "string") {
    throw new Error("Invalid JWT. JWT must have 3 parts");
  }
  return decodeComponentToJSON(protectedHeader);
}
var encoder = new TextEncoder();
var decoder2 = new TextDecoder();
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  buffers.forEach((buffer) => {
    buf.set(buffer, i);
    i += buffer.length;
  });
  return buf;
}
async function verifyJWTAndDecode(token, key) {
  if (typeof token !== "string") {
    throw new TypeError("JWT must be a string");
  }
  const {
    0: protectedHeader,
    1: payload,
    2: signature,
    length
  } = token.split(".");
  if (length !== 3 || typeof protectedHeader !== "string" || typeof payload !== "string" || typeof signature !== "string") {
    throw new Error("Invalid Token. Token must have 3 parts");
  }
  let parsedProt = decodeComponentToJSON(protectedHeader);
  const { alg, typ } = parsedProt;
  if (!typ || typeof typ !== "string") {
    throw new Error("Invalid Token. Missing typ in protected header");
  }
  if (typ !== "JWT") {
    throw new Error("Invalid JWT. Expected typ to be JWT");
  }
  if (!alg || typeof alg !== "string") {
    throw new Error("Invalid JWT. Missing alg in protected header");
  }
  if (alg !== "EdDSA") {
    throw new Error("Invalid JWT. Expected alg to be EdDSA");
  }
  const data = concat(
    encoder.encode(protectedHeader ?? ""),
    encoder.encode("."),
    encoder.encode(payload ?? "")
  );
  const decodedSignature = decode(signature);
  const verified = await verifySignature(key, decodedSignature, data);
  if (!verified) {
    throw new Error("Invalid JWT. Signature verification failed");
  }
  let parsedPayload = decodeComponentToJSON(payload);
  const now = Math.floor(Date.now() / 1e3);
  let iat = parsedPayload.iat;
  if (typeof iat !== "number") {
    throw new Error("Invalid JWT. Missing claim iat in payload");
  }
  if (iat > now + TOLERANCE) {
    throw new Error("Invalid JWT. iat claim must be in the past");
  }
  let exp = parsedPayload.exp;
  if (typeof exp !== "number") {
    throw new Error("Invalid JWT. Missing claim exp in payload");
  }
  if (exp < now + TOLERANCE) {
    throw new Error("Expired JWT. exp claim must be in the future");
  }
  return {
    protectedHeader: parsedProt,
    payload: parsedPayload
  };
}
var verifySignature = async (key, sig, data) => {
  if (typeof process === "undefined") {
    return verifyBrowser(key, sig, data);
  } else {
    return verifyNode(key, sig, data);
  }
};
var verifyBrowser = async (key, signature, data) => {
  const subtle = ponyfillEd25519(crypto.subtle);
  if (!subtle) {
    throw new Error("Ed25519 is not supported in this browser");
  }
  let decodedKey = decode(
    key.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "")
  );
  const cryptoKey = await subtle.importKey(
    "spki",
    decodedKey,
    { name: "Ed25519" },
    false,
    ["verify"]
  );
  const res = await subtle.verify(
    { name: "Ed25519" },
    cryptoKey,
    signature,
    data
  );
  return res;
};
var verifyNode = async (key, signature, data) => {
  try {
    const crypto2 = require("crypto");
    const keyObject = crypto2.createPublicKey(key);
    if (keyObject.type !== "public") {
      throw new TypeError("The key is not a public key");
    }
    if (keyObject.asymmetricKeyType !== "ed25519") {
      throw new TypeError("The key is not of type ed25519");
    }
    return await crypto2.verify(void 0, data, keyObject, signature);
  } catch {
    return false;
  }
};

// src/api/experimental/auth.ts
async function getAuthToken() {
  return extensionPort.experimental.auth.getAuthToken();
}
async function verifyAuthToken(token) {
  const tokenHeaders = decodeProtectedHeader(token);
  if (tokenHeaders.typ !== "JWT") {
    throw new Error("Expected typ: JWT");
  }
  if (tokenHeaders.alg !== "EdDSA") {
    throw new Error("Expected alg: EdDSA");
  }
  if (!tokenHeaders.kid) {
    throw new Error("Expected `kid` to be defined");
  }
  const res = await fetch(
    `https://replit.com/data/extensions/publicKey/${tokenHeaders.kid}`
  );
  const { ok, value: publicKey } = await res.json();
  if (!ok) {
    throw new Error("Extension Auth: Failed to fetch public key");
  }
  try {
    const decodedToken = await verifyJWTAndDecode(token, publicKey);
    return decodedToken;
  } catch (e) {
    throw new Error("Extension Auth: Failed to verify token");
  }
}
async function authenticate() {
  const token = await getAuthToken();
  const decodedToken = await verifyAuthToken(token);
  if (typeof decodedToken.payload.userId !== "number" || typeof decodedToken.payload.installationId !== "string" || typeof decodedToken.payload.extensionId !== "string") {
    throw new Error("Failed to authenticate");
  }
  return {
    user: {
      id: decodedToken.payload.userId
    },
    installation: {
      id: decodedToken.payload.installationId,
      extensionId: decodedToken.payload.extensionId
    }
  };
}

// src/api/experimental/editor.ts
var editor_exports = {};
__export(editor_exports, {
  getPreferences: () => getPreferences
});
async function getPreferences() {
  return await extensionPort.experimental.editor.getPreferences();
}

// src/api/commands.ts
var commands_exports = {};
__export(commands_exports, {
  add: () => add
});

// src/commands/index.ts
var ContributionType = /* @__PURE__ */ ((ContributionType3) => {
  ContributionType3["CommandBar"] = "commandbar";
  ContributionType3["FiletreeContextMenu"] = "filetree-context-menu";
  ContributionType3["SidebarSearch"] = "sidebar-search";
  ContributionType3["EditorContextMenu"] = "editor-context-menu";
  return ContributionType3;
})(ContributionType || {});
function validateCommandArgs(cmdArgs) {
  if (typeof cmdArgs !== "object") {
    throw new Error("Command arguments must be an object");
  }
  if (cmdArgs === null) {
    throw new Error("Command arguments must not be null");
  }
  if (!("commands" in cmdArgs) && !("run" in cmdArgs)) {
    throw new Error("One of `commands` or `run` must be defined");
  }
  if ("commands" in cmdArgs && cmdArgs.commands && "run" in cmdArgs && cmdArgs.run) {
    throw new Error("Only one of `commands` or `run` must be defined");
  }
  if ("commands" in cmdArgs && typeof cmdArgs.commands !== "function") {
    throw new Error("`commands` must be a function");
  }
  if ("run" in cmdArgs && typeof cmdArgs.run !== "function") {
    throw new Error("`run` must be a function");
  }
  for (let entry of Object.entries(cmdArgs)) {
    if (entry[0] === "commands" || entry[0] === "run") {
      continue;
    }
    try {
      JSON.stringify({ [entry[0]]: entry[1] });
    } catch (e) {
      throw new Error(`Command argument '${entry[0]}' is not serializable`);
    }
  }
}
var CommandSymbol = Symbol("Command");
function isCommandProxy(cmd) {
  return CommandSymbol in cmd && cmd[CommandSymbol] === true;
}
function Command(cmdArgs) {
  if (isCommandProxy(cmdArgs)) {
    throw new Error("Command is already wrapped");
  }
  validateCommandArgs(cmdArgs);
  if ("commands" in cmdArgs) {
    const { commands, ...props } = cmdArgs;
    let cmdProxy = proxy2({
      data: {
        ...props,
        type: "context"
      },
      commands: async (args) => {
        let subCmds = await commands(args);
        if (!subCmds || !Array.isArray(subCmds)) {
          return proxy2([]);
        }
        const commandProxyArray = subCmds.map((subCmd) => {
          if (isCommandProxy(subCmd)) {
            return subCmd;
          }
          return Command(subCmd);
        });
        return proxy2(commandProxyArray);
      },
      // Attach CommandSymbol to identify a wrapped command
      [CommandSymbol]: true
    });
    return cmdProxy;
  } else {
    const { run, ...props } = cmdArgs;
    let cmdProxy = proxy2({
      data: {
        ...props,
        type: "action"
      },
      run,
      // Attach CommandSymbol to identify a wrapped command
      [CommandSymbol]: true
    });
    return cmdProxy;
  }
}

// src/api/commands.ts
function add({ id, contributions, command }) {
  if (typeof command === "function") {
    let createCommand = proxy2(async (cmdFnArgs) => {
      const cmd = await command(cmdFnArgs);
      if (!cmd) {
        return null;
      }
      return isCommandProxy(cmd) ? cmd : Command(cmd);
    });
    extensionPort.commands.registerCreateCommand(
      { commandId: id, contributions },
      createCommand
    );
  } else {
    let createCommand = proxy2(async () => {
      return isCommandProxy(command) ? command : Command(command);
    });
    extensionPort.commands.registerCreateCommand(
      { commandId: id, contributions },
      createCommand
    );
  }
}

// src/api/internal/index.ts
var internal_exports = {};

// src/api/exec.ts
var exec_exports = {};
__export(exec_exports, {
  exec: () => exec,
  spawn: () => spawn
});
function spawn(options) {
  let execResult = extensionPort.exec(
    proxy2({
      args: options.args,
      env: options.env || {},
      splitStderr: options.splitStderr ?? false,
      onOutput: (output) => {
        if (options.splitStderr) {
          options.onStdOut?.(output);
        } else {
          options.onOutput?.(output);
        }
      },
      onStdErr: (stderr) => {
        if (options.splitStderr) {
          options.onStdErr?.(stderr);
        } else {
          options.onOutput?.(stderr);
        }
      },
      onError: (err) => {
        throw err;
      }
    })
  );
  let dispose = async () => {
    (await execResult).dispose();
  };
  const resultPromise = new Promise(async (resolve) => {
    const { exitCode, error: error2 } = await (await execResult).promise;
    resolve({
      error: error2,
      exitCode: exitCode ?? 0
    });
  });
  return {
    resultPromise,
    dispose
  };
}
async function exec(command, options = {}) {
  let output = "";
  const { resultPromise } = spawn({
    args: ["bash", "-c", command],
    env: options.env ?? {},
    splitStderr: false,
    onOutput: (newOutput) => {
      output += newOutput;
    }
  });
  const result = await resultPromise;
  if (result.error) {
    throw new Error(result.error);
  }
  return {
    output,
    exitCode: result.exitCode
  };
}

// src/api/debug.ts
var debug_exports = {};
__export(debug_exports, {
  error: () => error,
  info: () => info,
  log: () => log,
  warn: () => warn
});
function isSerializable(thing) {
  if (["string", "number", "boolean", "undefined"].includes(typeof thing)) {
    return true;
  }
  if (thing === null) {
    return true;
  }
  return false;
}
async function info(message, data) {
  if (!isSerializable(message)) {
    extensionPort.debug.warn(
      "Attempted to log non-serializable message. See your browser devtools to access the logged object."
    );
    return;
  }
  return await extensionPort.debug.info(message, data);
}
async function warn(message, data) {
  if (!isSerializable(message)) {
    extensionPort.debug.warn(
      "Attempted to log non-serializable message. See your browser devtools to access the logged object."
    );
    return;
  }
  return await extensionPort.debug.warn(message, data);
}
async function error(message, data) {
  if (!isSerializable(message)) {
    extensionPort.debug.warn(
      "Attempted to log non-serializable message. See your browser devtools to access the logged object."
    );
    return;
  }
  return await extensionPort.debug.error(message, data);
}
var log = info;

// package.json
var version = "1.10.0";

// src/util/patchConsole.ts
var consoleIsPatchedSymbol = Symbol("consoleIsPatched");
function patchConsole() {
  if (isConsolePatched()) {
    return;
  }
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;
  console.log = (...args) => {
    originalLog(...args);
    log(args[0], { args: args.slice(1) });
  };
  console.warn = (...args) => {
    originalWarn(...args);
    warn(args[0], { args: args.slice(1) });
  };
  console.error = (...args) => {
    originalError(...args);
    error(args[0], { args: args.slice(1) });
  };
  console.info = (...args) => {
    originalInfo(...args);
    info(args[0], { args: args.slice(1) });
  };
  console[consoleIsPatchedSymbol] = true;
}
function isConsolePatched() {
  return Boolean(console[consoleIsPatchedSymbol]);
}

// src/index.ts
function promiseWithTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise(
      (_resolve, reject) => setTimeout(() => reject(new Error("timeout")), timeout)
    )
  ]);
}
async function windowIsReady() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    const loadHandler = () => {
      resolve();
      window.removeEventListener("load", loadHandler);
    };
    window.addEventListener("load", loadHandler);
  });
}
async function init(args) {
  if (extensionPort === null) {
    throw new Error("Extension must be initialized in a browser context");
  }
  const onExtensionClick = () => {
    extensionPort.activatePane();
  };
  const windDown = () => {
    window.document.removeEventListener("click", onExtensionClick);
  };
  try {
    if (window) {
      await windowIsReady();
    }
    await promiseWithTimeout(
      extensionPort.handshake({
        clientName: "@replit/extensions",
        clientVersion: version
      }),
      args?.timeout || 2e3
    );
    patchConsole();
    setHandshakeStatus("ready" /* Ready */);
    if (window) {
      window.document.addEventListener("click", onExtensionClick);
    }
  } catch (e) {
    setHandshakeStatus("error" /* Error */);
    console.error(e);
    windDown();
    throw e;
  }
  return {
    dispose: windDown,
    status: getHandshakeStatus()
  };
}
//# sourceMappingURL=index.cjs.map