/**
 * @file util.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";
/**
 * create space separate string from comma separeted arguments
 *  @param {any}
 *  @returns {String} space separated
 */
function toStringFromArgs(...args) {return args.filter((arg) => arg != undefined).join(" ");}
/**
 * Convert to base64 with mode select
 * https://developer.mozilla.org/ja/docs/Glossary/Base64
 *  @param {Uint8Array} bytes
 *  @param {Bool} urlSafe if true encode Base64 as url safe
 *  @returns {String}  Base64 converted string
 */
function convertBytesToBase64(bytes, urlSafe = false) {
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");
    let b64 = btoa(binString); // std Base64encoding
    if (urlSafe) { // remove padding =, convert + to -, / to _
        return b64.replace(/[\/+=]/g, (match) => {
            const safe = {
                '\/': '_',
                '+': '_',
                '=': '',
            };
            return safe[match];
        });
    }
    return b64;
}
/**
 * Convert string to ArrayBuffer
 * https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 *  @param {STring} str convert target
 *  @returns {ArrayBuffer} converted target
 */
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export {
    toStringFromArgs,
    convertBytesToBase64,
    str2ab
}
/* //<-- util.js ends here*/
