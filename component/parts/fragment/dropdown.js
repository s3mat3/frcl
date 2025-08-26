/**
 * @file dropdown.js
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
 * @typedef { Object } DropdownOption
 * @property { String } name -- name selector
 * @property { DefaultOption }
 */
/**
 *  @returns { DropdownOption }
 */
const dropdownOption = (n = "no-name", c = [], s = {}) => {
    return {
        name: n,
        class: c,
        style: s,
    };
}

class DropdownItem {
    /** @type { String } [k = ""] -  key of item */
    k = "";
    /** @type { String } [v = ""] - value of item */
    v = "";
    /** @type { Boolean } [f = false] - marker of selected */
    f = false;
    /**
     * constructor
     *  @param { String } k is key
     *  @param { String } v is value
     *  @param { Boolean } f is selected flag
     */
    constructor(k, v, f = false) {
        this.k = k;
        this.v = v;
        this.f = f;
    }
}

const dropdownItem = (k, v, f = false) => {
    return new DropdownItem(k, v, f);
}

/**
 * @typedef { Array<DropdownItem> } DropdownItems
 */


class Dropdown extends fr.Nel {
    _cnt = 0;
    /**
     *  @param { SelectOption } o
     *  @param { DropdownItems } d
     */
    constructor(o, d) {
        o = (!o) ? selectOption() : o;
        let op = [];
        let cnt = 0;
        let x = 0;
        for (let c of d) {
            let el = fr.element`<option value="${c.k}">${c.v}</option>`;
            (c.f) ?  (cnt = x) : $nop
            op.push(el);
            // op.unshift(el);
            ++x;
        }
        super(fr.NType.tagname, "select", o, op);
        this._cnt = cnt;
        this._list = d;
        this.id = "select";
        this.selected = this._cnt;
    }

    get name_attr() {
        return this.attrs.name;
    }

    get index() {
        return this._cnt;
    }

    get value() {
        return this._elm.value;
    }

    get selected() {
        return this._cnt = this._elm.selectedIndex;
    }

    set selected(i) {
        i = (i < 0) ? -1 : i;
        this._cnt = i;
        this._elm.selectedIndex = i;
    }
    //
    // external control
    //
    enable() {
        this._elm.removeAttribute("disable");
    }

    disable() {
        this._elm.serAttribute("disable", true);
    }

    required(m = false) {
        (m) ? this._elm.serAttribute("required", true)
            : this._elm.removeAttribute("required");
    }
}

/**
 * @typedef { Array<DropdownItem> } DropdownItems
 */
/**
 *  @param { DropdownOption } o
 *  @param { DropdownItems } d
 */
const dropdown = (o = undefined, d) => {
    return new Dropdown(o, d);
}

export {
    dropdownItem,
    dropdownOption,
    Dropdown,
    dropdown,
};

/* //<-- dropdown.js ends here*/
