/**
 * @file element.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief Utilty for element operation
 *
 * @author s3mat3
 */
'use strict';
import { isMatchType } from "./misc";
/**
 * Escape HTML reserved special characters
 * in case 5 characters " ' & < >
 * Should use the entity name or entity number when you want to output any of these reserved characters.
 *  @see https://www.html.am/reference/html-special-characters.cfm
 *
 *  @param {String} target is string for output web browser
 */
function escapeHtmlSpecialChars(target) {
    return target.replace(/[\'\"&<>]/g, (match) => {
        const escapes = {
            '\'': '&#x27;',
            '\"': '&quot;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
        };
        return escapes[match];
  });
}
/**
 * Object type cheker.
 * @param { HTMLElement } obj
 * @returns { Boolean } true HTMLElement
 * @returns { Boolean } false Not HTMLElement
 */
function isElement(obj) {
    return (obj && typeof obj === 'object') ? (obj.nodeType === 1) : false;
}

/**
 * Build element from HTML markup string
 *  @param { String } h is html markup string
 *  @returns { HTMLElement }
 */
function buildElement(h) {
    const e = document.createElement('template');
    e.insertAdjacentHTML('afterbegin', h);
    return e.firstElementChild;
}
/**
 * Build html element from template literal. (Using taged template literal)
 *
 * This idea was referenced in the "Escape HTML Strings" section of'https://jsprimer.net/use-case/ajaxapp/display/'.
 *  @caution All placeholder variables included html special chars are escaped
 *  @usage element`<html-tag>${some_variable} | another-some-tags</html-tag>`;
 *  @param { String } s is string as tags
 *  @param { Array<String> } vs is string array from ${some_variable}
 *  @returns { HTMLElement }
 */
function element(s, ...vs) {
    const html = s.reduce((acc, current, index) => {
        const v = vs[index - 1];
        return (typeof v === 'string') ? acc + escapeHtmlSpecialChars(v) + current
            : acc + String(v) + current;
    });
    return buildElement(html);
} /* //<-- function element ends here */
/**
 * Attach element to container
 *  @param { HTMLElement } p is parent to attached
 *  @param { HTMLElement } e is element is attach target
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function attach(p, e) {
    if (p && isElement(p) && (e && isElement(e))) {
        p.replaceChildren(e);
        return p;
    }
    return null;
} /* //<-- function attach ends here */
/**
 * Detatch element from dom
 *  @param { HTMLElement } e is target element on removing
 */
function detach(e) {
    if (e && isElement(e)) {
        e.remove();
    }
} /* //<-- function detach ends here */

/**
 * Insert element to container
 *  @param { HTMLElement } p is container named parent as insert target
 *  @param { HTMLElement } e is element content(s) of inserted to container
 *  @param { Boolean } f is mode flag. when true, insert from back, else inser from front
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function insert(p, e, f = true) {
    const m = (f) ? "beforeend" : "afterbegin";
    if (p && isElement(p)) {
        (e && isElement(e))
            ? p.insertAdjacentElement(m, e)
            : (typeof e == "string") ? p.insertAdjacentHTML(m, e) : $fr_nop();
        return p;
    }
    return null;
} /* //<-- function insert ends here */
/**
 * Insert element to container
 *  @param { HTMLElement } p is container named parent as insert target
 *  @param { HTMLElement | STring } cr is child(ren) of inserted to container
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function add(p, ...cr) {
    cr.forEach((c) => {
        insert(p, c, true);
    });
}
/**
 * Update tag attributes
 *  @param { HTMLElement } e is target element
 *  @param { Object } a is atrributes object
 */
function updateAttributes(e, a) {
    if (e && isElement(e) && isMatchType(['Map', 'Object'], a)) {
        for (const [k, v] of Object.entries(a)) {
            let d = (k === "style" && typeof v === "object") ? toStyle(v) : v;
            e.setAttribute(k, d);
        }
    }
} /* //<-- function updateAttributes ends here */
/**
 * Convert style object TO style string for tag attributes
 *  @param { Object } s is style object
 *  @returns { String } converted style field string
 */
function toStyle(s) {
    return Object.entries(s).map(([k, v]) => `${k}: ${v};`).join("");
}

export{
    escapeHtmlSpecialChars,
    isElement,
    buildElement,
    element,
    attach,
    detach,
    insert,
    add,
    updateAttributes,
    toStyle,
}

/* //<-- element.js ends here*/
