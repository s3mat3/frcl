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
import * as fr from "../../core/fr";
import { dropdown, dropdownOption } from "./fragment/dropdown";
/**
 * @typedef { Object } LabelDropdownOption
 * @property { String } s - size (internal font size)
 * @property { import("./fragment/dropdown").DropdownOption }
 * @property { fr.DefaultOption }
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
        this._node = fr.nel("div",
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
    labelDropdownOption,
    LabelDropdown,
    labelDropdown,
}

/* //<-- dropdown.js ends here*/
