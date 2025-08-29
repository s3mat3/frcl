/**
 * @file crypto.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";
import {str2ab} from './util';

var $crypto = window.crypto.subtle;

class AesGCMKeyGenarator {
    constructor() {}
    /**
     *  @returns {JsonWebKey}
     */
    async genarate() {
        try {
            let naisho_no_kagi = await $crypto.generateKey(
                { name: 'AES-GCM', length: 256, },
                true,
                ["encrypt", "decrypt"]
            );
            let jwk = await $crypto.exportKey('jwk', naisho_no_kagi);
            return jwk;
        } catch (err) {
            return null;
        }
    }
}

/**
 * Import RSA public key from pem string to subtle.key type
 *  @param {String}
 *  @returns {Promise<importKey>}
 */
async function importRsaOAEPPublicKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // console.log(binaryDerString);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);
    // console.log(binaryDer);
    return await window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true,
        ['encrypt'],
    );
}

/**
 * Encrypt by RSA OAEP
 *  @param {CryptoKey} publickey imported
 *  @param {Uint8Array} message
 *  @returns {Promise<Uint8Array>} encrypted
 */
async function encryptRsaOAEP(publicKey, message) {
    const enc = new TextEncoder();
    const encoded = enc.encode(message);
    // console.log(publicKey);
    // console.log(encoded);
    const encrypted = await $crypto.encrypt(
        {name: 'RSA-OAEP'},
        publicKey,
        encoded
    );
    return new Uint8Array(encrypted);
}

/**
 * Encrypt AES by GCM
 *  @param {CryptoKey} key
 *  @param {Uint8Array} iv initial vector (12 byte)
 *  @param {String} message encript target
 *  @returns {Promise<Uint8Array>} encrypted
 */
async function encryptAesGCM(key, iv, message) {
    const enc = new TextEncoder();
    const encoded = enc.encode(message);
    // console.log(publicKey);
    // console.log(encoded);
    const encrypted = await $crypto.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );
    return new Uint8Array(encrypted);
}

export {
    $crypto,
    AesGCMKeyGenarator,
    importRsaOAEPPublicKey,
    encryptRsaOAEP,
    encryptAesGCM,
}

/* //<-- crypto.js ends here*/
