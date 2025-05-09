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
const dropdownOption = () => {
    return {
        name: "no-name",
        ...fr.defaultOption()
    };
}

class DropdownItem {
    /** @type { String } k is key of item */
    k = "";
    /** @type { String } v is value of item */
    v = "";
    /** @type { Boolean } f is marker of selected */
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
/**
 * @typedef { Object } LabelDropdownOption
 * @property { String } s - size (internal font size)
 * @property { DropdownOption }
 * @property { import("../../../core/fr").DefaultOption }
 */
/**
 *  @returns { LabelSelectOption }
 */
const labelDropdownOption = (s = "is-normal") => {
    return {
        size: s,
        dropdown: dropdownOption(),
        label: fr.defaultOption()
    }
}

/**
 * <p class="label-select">
 *   <label for="select_xxxx">hogehoge</label>
 *   <p class="input-wrapper">
 *     <select id="select_xxxx">
 *       <option value="aaa">hoge</option>
 *                      |
 *       <option value="aax">piyo</option>
 *     </select>
 *   </p>
 * </p>
 */
class LabelDropdown extends fr.NodeParts {
    /** @type { fr.Nel } dropdown */
    dropdown = undefined;
    /** @type { fr.Nel } label */
    label = undefined;
    /**
     *  @param { LabelDropdownOption } o is option
     *  @param { DropdownItems } d is dropdown items
     */
    constructor(n, o = undefined, d = undefined) {
        o = (! o) ? labelDropdownOption() : o;
        n = (n) ? n : "no name";
        super();
        o.dropdown.class.push(o.size);
        this.dropdown = dropdown(o.dropdown, d);
        o.label.class.push(o.size);
        o.label.for = this.dropdown.id;
        this.label = fr.nel("label", o.label, n);
        this._node = fr.nel("p",
                            {class: ["label-select"]},
                            this.label,
                            fr.nel("p",
                                   {class: ["input-wrapper"]},
                                   this.dropdown
                                  )
                           );
    } /* //<-- constructor ends here */

    get name() {
        return this.dropdown.name_attr;
    }
    get value() {
        return this.dropdown.value;
    }

    get index() {
        return this.dropdown.index;
    }

    get selected() {
        return this.dropdown.selected;
    }

    set selected(i) {
        this.dropdown.selected = i;
    }

    enable() {
        this.dropdown.element.removeAttribute("disable");
    }

    disable() {
        this.dropdown.element.serAttribute("disable", true);
    }
}

const labelDropdown = (n, o, d) => {
    return new LabelDropdown(n, o, d);
}

export {
    dropdownItem,
    dropdownOption,
    labelDropdownOption,
    Dropdown,
    dropdown,
    LabelDropdown,
    labelDropdown,
}

/* //<-- dropdown.js ends here*/
