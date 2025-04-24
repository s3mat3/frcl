/**
 * @file misc.js
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
 * Extract type name came from string made by object.tostring.call()
 * let arr = [];
 * Object.call(arr) result => [object Array] => slice(8, -1) => 'Array' 
 *                            12345678     -1
 * @param {any} target is Type name extraction target
 * @return {String} cf Array Object ... etc
 */
function extractTypeName(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}
/**
 * Test if the target type is in the given type list.
 * @param {array} types is list(array) of types to match. cf.['Array', 'String', ...] or ['Object'] etc.
 * @param {any} target is inspect target
 * @return {bool} true match types and target, false unmatch types and target.
 */
function isMatchType(types, target) {
    return types.includes(extractTypeName(target));
}
function isEmptyObj(o) {
    return Object.keys(o).length === 0;
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


export {
    extractTypeName,
    isMatchType,
    isEmptyObj,
    isElement,
}
/* //<-- misc.js ends here*/
