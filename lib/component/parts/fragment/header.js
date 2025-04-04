/**
 * @file header.js
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

const headerOptions = () => {
    return {
        use_close: true,
        icon_name: "close",
        style: {"background-color": "blue", "color": "black"},
    }
}

const createHeader = (t, o = {}, ...children) => {
    t = t ? t : "No title";
    const ah = {
        style: { ...o?.style }
    };
    const ap = {};
    let ch = undefined;
    if (o?.use_close) {
        ah["class"] = (o?.use_close) ? ["grid", "row"] : ["no-icon"];
        ch = children;
        ap["class"] = (o?.use_close) ? ["col-11"] : ["empty"];
    }
    const f = (o?.use_close) ? true : false;
    return new fr.Nel(1, "header", ah, new fr.Nel(1, "p", ap, t), ch);
}

export {
    createHeader, headerOptions
}
/* //<-- header.js ends here*/
