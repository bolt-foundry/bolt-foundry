import * as uuid from "uuid";
export function assertUuid(str, which) {
    if (!uuid.validate(str)) {
        const msg = which !== undefined
            ? `Invalid UUID for ${which}: ${str}`
            : `Invalid UUID: ${str}`;
        throw new Error(msg);
    }
    return str;
}
