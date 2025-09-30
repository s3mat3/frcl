// @ts-check
/*!
 * The misc.js is part of Fake Reactivity Component oriented Libray
 * Copyright (c) 2025 s3mat3
 * Licensed under the MIT License, see the LICENSE file for details
 */
/**
 * @file Defines various other utility functions.
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @author s3mat3
 */
"use strict";

/**
 * Extract type name came from string made by object.tostring.call()
 * let arr = [];
 * Object.call(arr) result => [object Array] => slice(8, -1) => 'Array'
 *                            12345678     -1
 * @param { any } target - Type name extraction target.
 * @return { String } cf Array Object ... etc
 */
function extractTypeName(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}
/**
 * Test if the target type is in the given type list.
 * @param { Array } types - List(array) of types to match. cf.['Array', 'String', ...] or ['Object'] etc.
 * @param { any } target - Inspect target.
 * @return { Boolean } true match types and target, false unmatch types and target.
 */
function isMatchType(types, target) {
    return types.includes(extractTypeName(target));
}
/**
 * Check empty object
 *  @param { Object } o - Check target.
 *  @returns { Boolean }
 */
function isEmptyObj(o) {
    if (! isMatchType(['Object'], o)) return true; // if not Object isEmptyObj == true
    return Object.keys(o).length === 0;
}
/**
 * Check Element object.
 * @param { Element } obj - Check target.
 * @returns { Boolean } true: Element ,false: Not Element
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
