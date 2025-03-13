/**
 * @file global.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

import { SerialID } from "./serial_id"

// const frcl_id = new SerialID(1000);
// Object.defineProperty(window, "$fr_id", {
//     get() {
//         return frcl_id.value;
//     },
// });
// // access window.$fr_id

const FR_CID = new SerialID(1000);
/**
 * window.$fr_cid (read only)
 * This global is readed per increment number as string 
 */
Object.defineProperty(window, "$fr_cid", {
    get() {
        return FR_CID.value;
    },
    // no setter
});
/**
 * Global object FREmitter
 */
window.__proto__.FRemitter = {
    /**
     * Emit custom event in some element with event data
     * This emitted event is can cancelable and can bubbling
     *  @param { String } e is event name(event type)
     *  @param { Object } o is event data
     *  @param { HTMLElement } c is context of element(Node) 
     */
    emit: function (e, o = {}, c = document) {
        c.dispatchEvent(new CustomEvent(e, {buble: true, cancelable: true, detail: o}));
    },
}

/**
 * Shortcut alias
 *  cf. bodyElement = document.querySelector("body") ==> bodyElement = $$("body");
 *  @type { Function } $$ is same document.querySelector(query)
 */
const $$ = document.querySelector.bind(document);
window.__proto__.$$ = $$;
/**
 * Shortcut alias
 *  cf. buttons = document.querySelectorAll(".button") ==> buttons = $a(".button");
 *  @type { Function } $a is same document.querySelectorAll(query)
 */
const $a = document.querySelectorAll.bind(document);
window.__proto__.$a = $a;

window.$fr_nop = () => {}
// export {
//     $$, $a,
// }
/* //<-- global.js ends here*/
