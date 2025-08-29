/**
 * @file session-storage.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import KVStorage from './kv-storage'

export default class SessionStorage extends KVStorage {
    constructor() {
        super();
    }
    /**
     * Load saved value by key
     * @param {String} key
     * @returns {Object} when value is json string
     * @returns {Any} when value is not json string
     */
    load(key) {
        const value = sessionStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    /**
     * Save value at key
     * @param {String} key
     * @param {Any} To serialize when value is Object
     * @returns {Void}
     */
    save(key, value) {
        const v = (typeof value === 'object') ? JSON.stringify(value) : value;
        sessionStorage.setItem(key, v);
    }
    /**
     * Remove key/value set at key
     * @param {String} key
     * @returns {Void}
     */
    remove(key) {
        sessionStorage.removeItem(key);
    }
    /**
     * Clear session storage
     */
    clear() {
        sessionStorage.clear();
    }
}

/* //<-- session-storage.js ends here*/
