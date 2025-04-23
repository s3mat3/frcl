/**
 * @file label-input.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

import * as fr from "../../../core/fr";
import { iconFont, iconFontOption } from "./icon-font";
const labelOption = () => {
    return fr.defaultOption();
}

/**
 * @typedef { Object } InputOption
 * @property { String } value - input value
 * @property { String } placeholder - placeholder text in input box
 * @property { string } size - input value size (length)
 * @property { string } type - input box type
 */
/**
 *  @returns { InputOption }
 */
const inputOption = (t = "text", p = "input", s = "25", v = "") => {
    return {
        value: "",
        placeholder: p,
        type: t,
        size: s,
        class: [],
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
        this.update();
    }
}

/**
 * @typedef { Object } LabelInputOption
 * @property { String } size - input and label size only 4patern (is-small, is-normal, is-midume, is-large)
 * @property { String } icon - icon name
 * @property { String } pos  - icon position in input box
 * @property { InputOption } input
 * @property { LabelOption } label
 */
/**
 *  @param { String } s is input and label size, select is-small, is-normal, is-medium, is-large
 *  @param { String } i is icon name
 *  @param { String } p is icon position
 *  @return { LabelInputOption }
 */
const labelInputOption = (s = "is-normal", i = "", p = "right") => {
    return {
        size: s,
        icon: i,
        pos: p,
        input: inputOption(),
        label: labelOption(),
    }
}
/**
 * <p class="label-input">
 *   <label for="input_xxxx">hogehoge</label>
 *   <p class="input-wrapper">
 *     <input id="input_xxxx" value=""/>
 *     <span class="icon">icon<span>
 *   </p>
 * </p>
 */
class LabelInput extends fr.NodeParts {
    /** @type { Input } input extended fr.Nel*/
    input = undefined;
    /** @type { fr.Nel } label */
    label = undefined;
    /** @type { fr.Nel } icon */
    icon = undefined;
    /**
     *  @param { String } n is label name
     *  @param { LabelInputOption } o is option 
     */
    constructor(n, o) {
        o = (o) ? o : labelInputOption();
        super();
        let wop = ["input-wrapper"];
        if (o.icon) {
            const iop = iconFontOption(o.icon);
            iop.clickable = true;
            this.icon = (o.icon) ? iconFont(iop) : undefined;
            wop.push("with-icon");
        }
        const pos = (o.pos === "left") ? "icon-pos-left" : "icon-pos-right";
        o.input.class.push(o.size);
        o.input.class.push(pos);
        this.input = new Input(o.input);
        o.label.class.push(o.size);
        o.label.for = this.input.id;
        this.label = fr.nel("label", o.label, n);
        this._node = fr.nel("p",
                           {class:["label-input"]},
                           this.label,
                           fr.nel("p",
                                  {class: [ ...wop ]},
                                  this.input,
                                  this.icon));
    }

    get value() {
        return this.input.value;
    }

    set value(v) {
        this.input.value = v;
        this.input.update();
    }

    updateIcon(n) {
        this.icon.changeIcon(n);
        this.icon.update();
    }
}

class PasswordInput extends LabelInput {
    #is_mask = false;
    constructor(n, o) {
        o.icon = "password_2";
        o.pos  = "right";
        super(n, o);
        this.icon.created = [this.clickEvent.bind(this)];
        this.#is_mask = false;
    }

    clickEvent() {
        const s = this;
        fr.setEvent(this.icon.element, "click", () => {
            s.toggle();
        });
    }

    init(iv = true) {
        this.#is_mask = iv;
        this.toggle();
    }

    toggle() {
        let a = this.input.attrs.class;
        let i;
        if (this.#is_mask) {
            this.#is_mask = false;
            this.input.attrs.type = "password";
            this.input.attrs.class = a.map((c) => {
                if (typeof c !== "string") return c;
                return c.replace("danger", "primary");
            });
            i = "password_2";
        } else {
            this.#is_mask = true;
            this.input.attrs.type = "text";
            this.input.attrs.class = a.map((c) => {
                if (typeof c !== "string") return c;
                return c.replace("primary", "danger");
            });
            i = "password_2_off";
        }
        this.input.element.setAttribute("type", this.input.attrs.type);
        this.input.element.setAttribute("class",
                                        this.input.attrs.class.reduce((a, c) => {
                                            return `${a} ${c}`;
                                        }));
        this.updateIcon(i);
    }
}

export {
    inputOption,
    Input,
    labelInputOption,
    LabelInput,
    PasswordInput,
}

/* //<-- label-input.js ends here*/
