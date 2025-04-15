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
import { createIconFont, iconFontOption } from "./icon-font";
/**
 * @typedef { Object } DialogHeaderOption
 * @property { Boolean } use_close - flag, when true use close icon,
 * @property { import("./icon-font").IconFontOption } icon icon font option
 * @property { import("../../../core/fr").DefaultOption } title is decorative attribute for dialog title
 * @property { import("../../../core/fr").DefaultOption } header is decorative attribute for header html tag
 */
/** create default dialog header option
 *  @param { Boolean } u is use close icon flag. default true: use, false: no use
 *  @returns { DialogHeaderOption }
 */
const dialogHeaderOption = (u = false) => {
    return {
        use_close: u,
        icon: iconFontOption("cancel"),
        title: {
            class: [],
            style: {},
        },
        header: {
            class: [],
            style: {},
        },
    }
}

class DialogHeader extends fr.Nel {
    constructor(t, o) {
        o = o ?? dialogHeaderOption();
        let i = undefined;
        const tl = (t) ? t : "no title";

        if (o.use_close) {
            o.header.class = ["row", ...o.header.class];
            o.title.class = ["col-11", ...o.title.class];
            o.icon.class = ["col-1", ...o.icon.class];
            o.icon.clickable = true;
            i = createIconFont(o.icon);
        }
        super(fr.NType.tagname, "header", o.header, fr.nel("span", o.title, tl), i);
        this.icon = i;
    }
}

/**
 * Create dialog header
 */
const dialogHeader = (t, o) => {
    return new DialogHeader(t, o);
}

export {
    dialogHeaderOption,
    dialogHeader,
}
/* //<-- header.js ends here*/
