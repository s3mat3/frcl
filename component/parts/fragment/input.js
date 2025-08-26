/**
 * @file input.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import * as fr from "../../../core/fr";
/**
 *  @param { Array<String> } [c = []] - class attribute
 *  @param { Object } [s = {}] - style attribute
 *  @returns { fr.DefaultOption }
 */
const labelOption = (c = [], s = {}) => {
    return fr.defaultOption(c, s);
}
/**
 * @typedef { Object } InputOption
 * @property { String } value - input value
 * @property { String } placeholder - placeholder text in input box
 * @property { string } type - input box type
 * @property { string } size - input value size (length)
 * @property { string } name - name attribute
 * @property { Array<String> } class - class attribute
 * @property { Object } style - style attribute
 */
/**
 *  @param { String } [t = "text"] - input type
 *  @param { String } [p = "input"] - placeholder text
 *  @param { String } [s = 25] - input value length
 *  @param { String } [v = ""] - input default value
 *  @param { Array<String> } [c =[]] - class attribute
 *  @property { Object } [so = {}] - style attribute
 *  @returns { InputOption }
 */
const inputOption = (t = "text", p = "input", s = "25", v = "", n = "no-name", c = [],  so = {}) => {
    return {
        value: v,
        placeholder: p,
        type: t,
        size: s,
        name: n,
        class: c,
        style: so,
    }
}

class Input extends fr.Nel {
    constructor(o) {
        super(fr.NType.tagname, "input", o);
        this.id = "input";
    }

    get value() {
        this.attrs.value = fr.escapeHtmlSpecialChars(this._elm.value);
        return this.attrs.value;
    }

    set value(v) {
        this.attrs.value = this._elm.value = v;
        this._elm.setAttribute("value", this.attrs.value);
    }

    get name_attr() {
        return this.attrs.name;
    }

    set name_attr(n) {
        this.attrs.name = n;
        this._elm.setAttribute("name", this.attrs.name);
    }

}

export {
    labelOption,
    inputOption,
    Input,
};

/* //<-- input.js ends here*/
