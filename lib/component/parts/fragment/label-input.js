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

const inputOption = () => {
    return {
        value: "",
        placeholder: "input",
        type: "text",
    }
}

class Input extends fr.Nel {
    constructor(o) {
        super(fr.NType.tagname, "input", o);
        this.id = "input";
    }

    get value() {
        return this.attrs.value;
    }
}

const labelInputOption = () => {
    return {
        input: inputOption(),
        label: {},
    }
}

const labelInput = (n, o) => {
    const i = new Input(o.input);
    const l = fr.nel("label", {for: i.id, ...o.label }, n);
    return fr.nel("span", {}, l, i);
}

export {
    inputOption,
    Input,
    labelInputOption,
    labelInput,
}

/* //<-- label-input.js ends here*/
