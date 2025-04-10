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
import { createIconFont } from "./fragment/icon-font";
import { createHeader, headerOptions } from "./fragment/header";
import { createFooter } from "./fragment/footer";
/**
 * @typedef { DialogOptions }
 */
/**
 * @typedef { ModalOptions }
 */
const modalOptions = () => {
    return {
        dialog: {
            style: {width: "40vw", height: "40vh", "background-color": "white"}
        },
        header: headerOptions(),
        content: {
            use_icon: false,
            icon_name: "warning",
        }
    }
}
/**
 * Create modal dialog
 *  @param { String } t is dialog title
 *  @param { ModalOptions } o is options for modal dialog
 *  @param { String } c is message contents
 */
const createModal = (t, o = {}, c) => {

    return new fr.Nel(1, "dialog", {}
        , createHeader(t, { ...o?.header }, createIconFont({ icon_name: "close", clickable: true }))
        , new fr.Nel(1, "div", { class: "content" }, c)
        , createFooter());
}

class Modal extends fr.Nel {
    constructor(t, o = {}, ...c) {
        let ico = undefined;
        if (o?.header?.use_icon) {
            ico = createIconFont({icon_name: "cancel", clickable: true, class: [ "col-2", ...o?.header.icon_class]});
        }
        const args = (ico) ? [t, o?.header, ico] : [t, o?.header];
        const h    = createHeader( ...args );
        const cont = new fr.Nel(1, "div", {class:["content"],}, c);
        const f = createFooter();
        const a = (o?.dialog) ? o.dialog : {style: {width: "40vw", height: "40vh", "background-color": "white"}}
        super(1, "dialog", a, h, cont, f);
        this.ico = ico;
        this.attrs = a;
    }

    open() {
        this._elm.showModal();
    }

    close() {
        this._elm.close();
    }
}

const IconNames = {
    admon: {
        notice: "",
        warning: "",
        caution: ""
    },
    status: {
        info: "",
        success: "",
        error: ""
    }
};


/**
 * @typedef { Object } DialogOptions
 * @property { String } type - dialog type "normal" | "admon" | "status" | ""
 * @property { String } stype - dialog type
 *    (type == "admon"  stype = "notice" | "warning" | "caution")
 *    (type == "status" stype = "info" | "success" | "error")
 *    (type == "" || "normal" stype is no effect)
 * @property { String } width - dialog width default 40vw
 * @property { String } height - dialog height default empty (maybe stylesheet min-height 10vh)
 * @property { String } bg - background color default empty
 * @property { Boolean } icon_close - flag for icon close button default false
 * @property { String }  icon_name - close icon name default "close"
 * @property { import("./fragment/header").HeaderOptions }
 */
/**
 *   @returns { DialogOptions }  
 */
const dialogOptions = () => {
    return {
        type: "",
        stype: "",
        width: "40vhw",
        height: "",
        bg: "",
        icon_close: false,
        icon_name: "close",
        header: headerOptions(),
        attrs: {}
    }
}

class Dialog extends fr.Nel {
    /** constructor
     * Create header and dialog struct
     *  @param { String } t is dialog title
     *  @param { DialogOptions } o is dialog options
     *  @param { fr.Nel } f is footer object
     *  @param { Array<fr.Nel> } c is dialog content(s) 
     */
    constructor(t, o = {}, f,...c) {
        let ico = undefined;
        if (o?.icon_close) {
            const n = (o.icon_name) ? o.icon_name : "close";
            ico = createIconFont({icon_name: n, clickable: true});
        }
        const h = (ico) ? createHeader(t, o?.header ?? {}, ico) : createHeader(t, o?.header ?? {});
        if (o.type) {
            
        }
        super(1, o.attrs, h, c, f);
    }
}
export { modalOptions, createModal, Modal }
/* //<-- modal.js ends here*/
