/**
 * @file footer.js
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

const createFooter = (o = {}, ...children) => {
    const attrs = {
        class: ["footer", "grid", "row"],
        style: { ...o?.style }
    }
    return new fr.Nel(fr.NType.tagname, "footer", attrs, children);
}

export {
    createFooter,
}
/* //<-- footer.js ends here*/
