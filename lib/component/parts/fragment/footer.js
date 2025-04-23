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

const footerOption = () => {
    return fr.defaultOption();
}

const footer = (o = {}, ...c) => {
    o = (o) ?? footerOption();
    const attrs = {
        class: ["footer", ...o.class ],
        style: { ...o.style }
    }
    return fr.nel("footer", attrs, c);
}

export {
    footerOption,
    footer,
}
/* //<-- footer.js ends here*/
