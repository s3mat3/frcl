/**
 * @file dialog.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import * as fr from "../../core/fr";
import { dialogHeader, dialogHeaderOption } from "./fragment/header";
import { footer, footerOption } from "./fragment/footer";
import { iconFont, iconFontOption } from "./fragment/icon-font";
/**
 * @typedef { Object } DialogOption
 * @property { import("../../core/fr").DefaultOption } dialog - attribute(s) for dialog html tag
 * @property { import("./fragment/header").DialogHeaderOption }
 */
/**
 *
 *  @returns { DialogOption }
 */
const dialogOption = (u = false) => {
    return {
        dialog: {
            class: [],
            style: {}
        },
        header: dialogHeaderOption(u),
        content: {
            class: [],
        },
        footer: footerOption(),
    }
}
/**
 * <dialog class="admon notice">
 *  <header class="row">
 *    <span class="col-11">title</span>
 *    <span class="col-1 icon material-symbols-outlined" style="cursol:pointer;">icon_name</span>
 *  </header>
 *  <div class="content row">
 *   content
 *  </div>
 *  <footer>
 *  </footer>
 * </dialog>
 */
class Dialog extends fr.NodeParts {
    /** @type { fr.Nel } header - dilog header */
    header  = undefined;
    /** @type { fr.Nel } content - dilog content */
    content = undefined;
    /** @type { fr.Nel } footer - dilog footer */
    footer  = undefined;
    /**
     *  @param { String } t is dialog title
     *  @param { DialogOption } o is dialog option
     *  @param { fr.Nel } f is footer, if need
     *  @param { fr.Nel } c is dialog content
     */
    constructor(t, o = undefined, c = undefined, f = undefined) {
        o = (o) ?? dialogOption();
        super();
        this.header = dialogHeader(t, o.header);
        o.content.class.push("content");
        this.content = fr.nel("div", o.content, c);
        if (f) {
            this.footer = footer(o.footer, f);
        }
        this._node = fr.nel("dialog",
                            o.dialog,
                            this.header.node,
                            this.content,
                            this.footer);
    }

    open() {
        this._node.element.showModal();
    }
    close() {
        this._node.element.close();
    }
}

const dialog = (t, o, c, f) => {
    return new Dialog(t, o, c, f);
}

/**
 * @typedef { Object } MessageType
 */
const _MessageType = {
    status: {
        info: {
            name: "info",
        },
        success: {
            name: "check_circle",
        },
        error: {
            name: "error",
        },
    },
    admon: {
        warning: {
            name: "warning"
        },
        caution: {
            name: "warning",
        },
        notice: {
            name: "notifications"
        },
    }
}
/**
 * @class MessageDialog
 */
class MessageDialog extends Dialog {
    constructor(t, l,  o = undefined, c = undefined) {
        o = (o) ?? dialogOption(true);
        t = _MessageType.hasOwnProperty(t) ? t : "admon";
        l = _MessageType[t].hasOwnProperty(l) ? l
            : (t === "admon") ? "warning" : "error";
        const n = _MessageType[t][l];
        o.dialog.class = [t, l,];

        const iop = iconFontOption(n.name);
        iop.style["font-size"] = "7.2rem";
        super(l, o,
              fr.nel("div", {class:["icon", "col-3"]}, iconFont(iop)),
              fr.nel("div", {class:["body", "col-9"]}, c))
    }
}

const dialogContent = ( ...c ) => {
    return fr.nel("div", {class: ["content"]}, c);
}

/**
 *  @param { String } t is type of message "status" || "admon"
 *  @param { String } l is level of message
 *                       when type is "status" "info" || "success" || "error"
 *                       when type is "admon"  "warning" || "caution" || "notice"
 *  @param { DialogOption } o is dialog option
 *  @param { fr.Nel || HTMLElement || String } c is dialog content
 *  @returns { Dialog }
 */
const messageDialog = (t, l, o, c) => {
    o = (o) ?? dialogOption(true);
    t = _MessageType.hasOwnProperty(t) ? t : "admon";
    l = _MessageType[t].hasOwnProperty(l) ? l
        : (t === "admon") ? "warning" : "error";
    const n = _MessageType[t][l];
    o.dialog.class = [t, l,];

    const iop = iconFontOption(n.name);
    iop.style["font-size"] = "7.2rem"
    const icon = iconFont(iop);
    const iw = fr.nel("div", {class: ["icon", "col-3"]}, icon);
    const cw = fr.nel("div", {class: ["body", "col-9"]}, c);
    const cc = dialogContent(iw, cw);
    cc.attrs.class.push("row");
    return dialog(l, o, cc);
}

export {
    dialogOption,
    Dialog,
    dialog,
    dialogContent,
    messageDialog,
}
/* //<-- dialog.js ends here*/
