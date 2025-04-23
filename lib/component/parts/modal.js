/**
 * @file modal.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

import * as fr from "../../core/fr";
import { dialogHeader, dialogHeaderOption } from "./fragment/header";
import { createIconFont, iconFontOption } from "./fragment/icon-font";
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
    }
}

const dialogContent = ( ...c ) => {
    return fr.nel("div", {class: ["content"]}, c);
}

class ModalDialog extends fr.Nel {
    /**
     *  @param { String } t is dialog title
     *  @param { DialogOption } o is dialog option
     *  @param { fr.Nel } c is dialog content
     *  @param { fr.Nel | fr.Reference | HTMLElement } f is footer, if need
     */
    constructor(t, o = {}, c, f) {
        o = (o) ?? dialogOption();
        const h = dialogHeader(t, o.header);
        o.content.class = ["content", ...o.content.class ];
        super(fr.NType.tagname, "dialog", o.dialog, h, c, f);
        this.header = h;
        this.footer = f;
    }

    open() {
        this._elm.showModal();
    }

    close() {
        this._elm.close();
    }
} /* //<-- class ModalDialog ends here */
/**
 * Create modal dialog
 *  @param { String } t is dialog title
 *  @param { ModalOptions } o is options for modal dialog
 *  @param { String } c is message contents
 */
const modalDialog = (t, o = {}, c, f) => {
    return new ModalDialog(t, o, c, f);
} /* //<-- function modalDIalog ends here */

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
 *
 *  @param { DialogOption } o is dialog option
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
    const icon = createIconFont(iop);
    const iw = fr.nel("div", {class: ["icon", "col-3"]}, icon);
    const cw = fr.nel("div", {class: ["body", "col-9"]}, c);
    const cc = dialogContent(iw, cw);
    cc.attrs.class.push("row");
    return modalDialog(l, o, cc);
}

export {
    dialogOption,
    dialogContent,
    ModalDialog,
    modalDialog,
    messageDialog,
}
/* //<-- modal.js ends here*/
