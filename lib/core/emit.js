/**
 * @file emit.js
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
 * Emit custom event with context
 *  @param { String } n is name as event trigger
 *  @param { Any } d is detail of event (event data)
 *  @param { HTMLElement } c is event source element named context
 */
export function emit(n, d, c = document) {
    let options = {
        cancelable: true,
        buble: true,
        detail: d,
    }
    c.dispatchEvent(new CustomEvent(n, options));
}

/* //<-- emit.js ends here*/
