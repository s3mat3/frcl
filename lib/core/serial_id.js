/**
 * @file serial_id.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';
/**
 * Classes that generate serial numbers
 */
export class SerialID {
    #value = {};
    constructor(i = 1000) {
        this.#value = new Proxy({ count: i }, {
            set(t, k, v, r) {
                Reflect.set(t, k, v, r); // dummy
                return false; // readonly 
            },
            get(t, k) {
                return String(t[k]++);
            }
        });
    }
    get value() { return this.#value.count; }
}

/* //<-- serial_id.js ends here*/
