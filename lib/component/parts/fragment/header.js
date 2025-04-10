/**
 * @file header.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief contents header use div
 *
 * @author s3mat3
 */
'use strict';
import * as fr from "../../../core/fr";
/**
 * @typedef { Object } HeaderOptions
 * @property { Boolean } use_close - flag, when true use close icon,
 * @property { String } icon_name - icon name default close
 * @property { Object } style - attribute of headder style
 */
/**
 *  @returns { HeaderOptions }
 */
const headerOptions = () => {
    return {
        use_icon: true,
        icon_name: "cancel",
        icon_class: [],
        style: {"background-color": "#bfe4ff", "color": "black"},
    }
}

const createHeader = (t, o = {}, ...children) => {
    t = t ? t : "No title";
    const ah = {
        style: { ...o?.style }
    };
    const ap = {};
    let ch = undefined;
    if (o?.use_icon) {
        ah["class"] = (o?.use_icon) ? ["grid", "row"] : ["no-icon"];
        ch = children;
        ap["class"] = (o?.use_icon) ? ["col-10"] : ["empty"];
    }
    // const f = (o?.use_close) ? true : false;
    return new fr.Nel(1, "header", ah, new fr.Nel(1, "span", ap, t), ch);
}

export {
    createHeader, headerOptions
}
/* //<-- header.js ends here*/
