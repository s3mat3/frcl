/**
 * @file icon_font.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 * Using @material-design-icons/font
 * @author s3mat3
 */
'use strict';

import { Tag, tag, updateAttributes } from "../../../core/element"

const iconFontOptions = () => {
    return {
        icon_name: "face",
        family: "material-symbols-outlined",
        size: "2rem",
        color: "black",
        grade: 0,
        weight: 400,
        fill: true,
        clickable: false,
        attrs:{
            style: {},
        },
    };
}

class IconFont extends Tag {
    /**
     *  @param { String } n is name of icon
     *  @param { Object } o is options for icon
     */
    constructor(n, o = {}) {
        o.icon_name = n;
        const c = (o?.clickable) ? "pointer" : "default";
        o.attrs = {
            "class": o?.family ?? "material-symbols-outlined",
            style: {
                "cursor": c,
                "font-size": o?.size ?? "24px",
                "font-weight": o?.weight ?? 400,
                "color": o?.color,
            }
        }
        super("span", o, o.icon_name);
        this._props.attrs.style["font-variation-settings"] = this.#variation();
        this.build();
    }

    build() {
        return this._element = tag(this._props.name, this._props.attrs, this._props.icon_name)
    }

    changeIcon(n) {
        this._props.icon_name = n;
    }

    changeFill(n) {
        this._props.fill = n;
        this._props.attrs.style["font-variation-settings"] = this.#variation();
    }

    changeColor(n) {
        this._props.color = n;
        this._props.attrs.style.color = n;
    }

    #variation() {
        const f = (this._props.fill) ? 1 : 0;
        const g = (this._props.grade === -25) ? this._props.grade : (this._props.grade === 200) ? this._props.grade : 0
        return `'FILL' ${f}, 'GRAD' ${g}`
    }
    updateAttributs() {
        updateAttributes(this._element, this._props.attrs);
    }
}

export { iconFontOptions, IconFont, }

/* //<-- icon_font.js ends here*/
