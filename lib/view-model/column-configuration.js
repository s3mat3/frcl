/**
 * @file column-configuration.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

class ColumnTypes {
    text = "text";
    textarea = "textarea";
    drop = "dropdown";
}

const ColumnType = new ColumnTypes();

Object.freeze(ColumnType);

/**
 *
 */
class ColumnConfiguration {
    /**
     * constructor
     *  @param { String } f is field name of data structure (maybe Database table column name)
     *  @param { String } n is an alias for the field name for display
     *  @param { String } t is edit box type (chose from ColumnTypes)
     *  @param { String } d is default value for add mode
     *  @param { DropDownList } l is dropdown list
     *  @param { Boolean } k is a flag that determines whether this field is a table key
     *  @param { Boolean } req is reqired flag
     *  @param { Boolean } ro is readonly flag (No editable)
     *  @param { Boolean } h is hidden flag
     *  @param { Boolean } s is sortable flag
     */
    constructor(f, n, t, d = "", l = undefined, k = false, req = true, ro = false, h = false, s = true) {
        this.field = f;
        this.name = n;
        this.key = k;
        this.required = req;
        this.ro = ro;
        this.hidden = h;
        this.sortable = s;
        this.type = t;
        this.dropdown = l;
        this.default = d;
    }
}

/**
 * @typedef { Array<ColumnConfiguration> } ColumnConfigurationList
 */

export {
    ColumnConfiguration,
    ColumnType,
}
/* //<-- column-configuration.js ends here*/
