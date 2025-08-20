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

const header = (o = {}, ...c) => {
    o = (o) ?? fr.defaultOption();
    return fr.nel("header", o, c);
}
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
        title: fr.defaultOption(),
        header: fr.defaultOption(),
    }
}

/**
 * <header class="row">
 *   <span class="col-11">t</span>
 *   <span class="col-1 icon ....">cancel</span> <= from icnFont
 * </header>
 */
class DialogHeader extends fr.NodeParts {
    icon = undefined;
    constructor(t, o) {
        super();
        o = o ?? dialogHeaderOption();
        const tl = (t) ? t : "no title";

        if (o.use_close) {
            o.header.class = ["row", ...o.header.class];
            o.title.class = ["col-11", ...o.title.class];
            o.icon.class = ["col-1", ...o.icon.class];
            o.icon.clickable = true;
            this.icon = createIconFont(o.icon);
        }
        this._node = header(o.header,
                            fr.nel("span", o.title, tl),
                            this.icon);
    }
}

/**
 * Create dialog header
 *  @param { String } t is dialog title
 */
const dialogHeader = (t, o) => {
    return new DialogHeader(t, o);
}


export {
    dialogHeaderOption,
    dialogHeader,
    header,
}
/* //<-- header.js ends here*/
