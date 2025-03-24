/**
 * @file index.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

// export { $$, $a } from "./core/global";
import "./core/global";
export { SerialID } from "./core/serial_id";
export { isMatchType } from "./core/misc"
export { emit } from "./core/emit";
export { Notificator } from "./core/notificator";
export { monitor, createReaction, reactive } from "./core/reactive"

export { escapeHtmlSpecialChars,
         isElement,
         buildElement,
         element,
         attach,
         detach,
         insert,
         add,
         updateAttributes,
         toStyle,
         setEvent,
         tag,
         Tag,
         TagLiteral,
         options,} from "./core/element";
// export { Element, Component } from "./core/component"
// export { App } from "./core/app"

/* //<-- index.js ends here*/
