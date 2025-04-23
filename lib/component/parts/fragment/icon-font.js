/**
 * @file icon-font.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 * Using @material-design-icons/font
 * @author s3mat3
 */
'use strict';

import * as fr from "../../../core/fr"

/** For Icon font options grade property only rhs use. @readonly
 * @typedef { Object } EmphasisGrade
 * @property { Number } low emphasis
 * @property { Number } normal emphasis
 * @property { Number } high emphasis
 */
const EmphasisGrade = {
    low    : -25,
    normal :   0,
    high   : 200,
};
/**
 * @typedef IconFontOption
 *  @property { String }  name is material icon name @default "home"
 *  @property { EmphasisGrade }  grade for font variation (only 3 value, -25, 0 , 200)
 *  @property { Number }  weight is font weight
 *  @property { Boolean } fill is flag for material symbol
 *  @property { Boolean } clickable flag
 */
/**
 * Genarate IconFontOption
 *  @returns { IconFontOption }
 */
const iconFontOption = (n = "home", g = EmphasisGrade.normal, f = true, c = false) => {
    return {
        name: n,
        grade: g,
        fill: f,
        clickable: c,
        class: ["icon", "material-symbols-outlined",],
        style: {
            // "font-size": "4.8rem",
            // "font-weight": 400,
            // "color" : "black",
        },
    }
};
/**
 * @private
 * create font variation property for material symboles
 *  @param { Bool } f is fill/true, no fill/false
 *  @param { Number } g is grade, only 3 value, -25, 0 , 200
 */
const _variations = (f, g) => {
    f = (f) ? 1 : 0;
    g = (g === EmphasisGrade.low || g === EmphasisGrade.high) ? g : 0;
    return `'FILL' ${f}, 'GRAD' ${g}`;
}
/**
 * IconFont class
 */
class IconFont extends fr.Nel {
    /**
     *
     *  @param { IconFontOptions } o is IconFontOptions 
     */
    constructor(o = {}) {
        const attrs = {
            class: [ ...o.class ],
            style: {
                "cursor": (o.clickable) ? "pointer" : "default",
                "font-variation-settings": _variations(o.fill, o.grade),
                ...o.style,
            }
        }
        super(fr.NType.tagname, "span", attrs, o.name);
        this.options = { ...o };
        this.attrs = { ...attrs };
        this.build();
    }

    changeIcon(n) {
        this.options.name = n;
        this.children[0] = n;
    }

    changeFill(n) {
        this.options.fill = n;
        this.attrs.style["font-variation-settings"] = _variations(n, this.options.grade);
    }

    changeColor(n) {
        this.options.color = n;
        this.attrs.style.color = n;
    }
} /* //<-- class IconFont  ends here */
/**
 * Create IconFont
 *  @param { IconFontOptions } o is options
 *  @returns { Nel } NodeElement
 */
const createIconFont = (o = {}) => {
    return new IconFont(o);
}

const iconFont = (o = {}) => {
    return new IconFont(o);
}

export {
    iconFontOption,
    IconFont,
    createIconFont,
    iconFont,
    EmphasisGrade,
}
/* //<-- icon-font.js ends here*/
