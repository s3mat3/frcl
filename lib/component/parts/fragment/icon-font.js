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
/**
 * @typedef IconFontOptions
 *  @property { String }  icon_name is material icon name @default "home"
 *  @property { String }  family is material symbols family @default "material-symbols-outlined"
 *  @property { String }  size is material symbol size (font size)
 *  @property { String }  color is symbol color (font color)
 *  @property { Number }  grade for font variation (only 3 value, -25, 0 , 200)
 *  @property { Number }  weight is font weight
 *  @property { Boolean } fill is flag for material symbol
 *  @property { Boolean } clickable flag
 */
/**
 * Generate default IconFontOptions
 *  @returns { IconFontOptions }  
 */
const iconFontOptions = () => {
    return {
        icon_name : "home",
        family    : "material-symbols-outlined",
        size      : "2rem",
        color     : "black",
        grade     : 0,
        weight    : 400,
        fill      : true,
        clickable : false,
    }
}
/**
 * @private
 * create font variation property for material symboles
 *  @param { Bool } f is fill/true, no fill/false
 *  @param { Number } g is grade, only 3 value, -25, 0 , 200
 */
const _createVariations = (f, g) => {
    f = (f) ? 1 : 0;
    g = (g === -25) ? g : (g === 200) ? g : 0;
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
        // o.icon_name = n;
        const attrs = {
            class: o.family ?? "material-symbols-outlined",
            style: {
                "cursor": (o.clickable) ? "pointer" : "default",
                "font-size": o.size ?? "24px",
                "font-weight": o.weight ?? 400,
                "color": o.color ?? "black",
                "font-variation-settings": _createVariations(o.fill, o.grade),
            }
        }
        super(1, "span", attrs);
        this.options = { ...o };
        this.attrs = { ...attrs };
        this.children.push(this.options.icon_name);
        this.build();
    }
}
/**
 * Create IconFont
 *  @param { IconFontOptions } o is options
 *  @returns { Nel } NodeElement
 */
const createIconFont = (o = {}) => {
    o.icon_name = (o.icon_name) ? o.icon_name : "home";
    const attrs = {
        class: o.family ?? "material-symbols-outlined",
        style: {
            "cursor": (o.clickable) ? "pointer" : "default",
            "font-size": o.size ?? "24px",
            "font-weight": o.weight ?? 400,
            "color": o.color ?? "black",
            "font-variation-settings": _createVariations(o.fill, o.grade),
        }
    }
    return new Nel(1, "span", attrs, o.icon_name)
}

export {
    iconFontOptions,
    IconFont,
    createIconFont,
}
/* //<-- icon-font.js ends here*/
