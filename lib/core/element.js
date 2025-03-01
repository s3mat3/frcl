/**
 * @file element.js
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
 * Shortcut alias
 *  cf. bodyElement = document.querySelector("body") ==> bodyElement = $$("body");
 *  @type { Function } $$ is same document.querySelector(query)
 */
const $$ = document.querySelector.bind(document);
/**
 * Shortcut alias
 *  cf. buttons = document.querySelectorAll(".button") ==> buttons = $a(".button");
 *  @type { Function } $a is same document.querySelectorAll(query)
 */
const $a = document.querySelectorAll.bind(document);

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
 *  @usage element`<html-tag>${some_variable}</html-tag>`;
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
 * Attach element to parent element
 *  @param { HTMLElement } p is parent to attached
 *  @param { HTMLElement } e is element is attach target
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function attach(p, e) {
    if (p && isElement(p)) {
        (e) ? p.replaceChildren(e) : "";
        return p;
    }
    return null;
} /* //<-- function attach ends here */

export{
    $$,
    $a,
    escapeHtmlSpecialChars,
    isElement,
    buildElement,
    element,
}

/* //<-- element.js ends here*/
