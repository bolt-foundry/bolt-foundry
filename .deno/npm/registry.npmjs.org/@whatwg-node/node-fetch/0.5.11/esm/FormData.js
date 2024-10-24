import { PonyfillReadableStream } from './ReadableStream.js';
export class PonyfillFormData {
    constructor() {
        this.map = new Map();
    }
    append(name, value, fileName) {
        let values = this.map.get(name);
        if (!values) {
            values = [];
            this.map.set(name, values);
        }
        const entry = isBlob(value)
            ? getNormalizedFile(name, value, fileName)
            : value;
        values.push(entry);
    }
    delete(name) {
        this.map.delete(name);
    }
    get(name) {
        const values = this.map.get(name);
        return values ? values[0] : null;
    }
    getAll(name) {
        return this.map.get(name) || [];
    }
    has(name) {
        return this.map.has(name);
    }
    set(name, value, fileName) {
        const entry = isBlob(value)
            ? getNormalizedFile(name, value, fileName)
            : value;
        this.map.set(name, [entry]);
    }
    *[Symbol.iterator]() {
        for (const [key, values] of this.map) {
            for (const value of values) {
                yield [key, value];
            }
        }
    }
    entries() {
        return this[Symbol.iterator]();
    }
    keys() {
        return this.map.keys();
    }
    *values() {
        for (const values of this.map.values()) {
            for (const value of values) {
                yield value;
            }
        }
    }
    forEach(callback) {
        for (const [key, value] of this) {
            callback(value, key, this);
        }
    }
}
export function getStreamFromFormData(formData, boundary = '---') {
    const entries = [];
    let sentInitialHeader = false;
    return new PonyfillReadableStream({
        start: controller => {
            formData.forEach((value, key) => {
                if (!sentInitialHeader) {
                    controller.enqueue(Buffer.from(`--${boundary}\r\n`));
                    sentInitialHeader = true;
                }
                entries.push([key, value]);
            });
            if (!sentInitialHeader) {
                controller.enqueue(Buffer.from(`--${boundary}--\r\n`));
                controller.close();
            }
        },
        pull: async (controller) => {
            const entry = entries.shift();
            if (entry) {
                const [key, value] = entry;
                if (typeof value === 'string') {
                    controller.enqueue(Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`));
                    controller.enqueue(Buffer.from(value));
                }
                else {
                    let filenamePart = '';
                    if (value.name) {
                        filenamePart = `; filename="${value.name}"`;
                    }
                    controller.enqueue(Buffer.from(`Content-Disposition: form-data; name="${key}"${filenamePart}\r\n`));
                    controller.enqueue(Buffer.from(`Content-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`));
                    const entryStream = value.stream();
                    for await (const chunk of entryStream) {
                        controller.enqueue(chunk);
                    }
                }
                if (entries.length === 0) {
                    controller.enqueue(Buffer.from(`\r\n--${boundary}--\r\n`));
                    controller.close();
                }
                else {
                    controller.enqueue(Buffer.from(`\r\n--${boundary}\r\n`));
                }
            }
            else {
                controller.enqueue(Buffer.from(`\r\n--${boundary}--\r\n`));
                controller.close();
            }
        },
    });
}
function getNormalizedFile(name, blob, fileName) {
    Object.defineProperty(blob, 'name', {
        configurable: true,
        enumerable: true,
        value: fileName || blob.name || name,
    });
    return blob;
}
function isBlob(value) {
    return value?.arrayBuffer != null;
}
