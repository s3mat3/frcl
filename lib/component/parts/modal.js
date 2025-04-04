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

const createModal = (t, o = {}, c) => {

    return new fr.Nel(1, "dialog", {}
        , createHeader(t, { ...o?.header }, createIconFont({ icon_name: "close", clickable: true }))
        , new fr.Nel(1, "div", { class: "content" }, c)
        , createFooter());
}

class Modal extends fr.Nel {
    constructor(t, o = {}, ...c) {
        let ico = undefined;
        if (o?.header?.use_close) {
            ico = createIconFont({icon_name: "close", clickable: true});
        }
        const h = (ico) ? createHeader(t, o?.header, ico) : createHeader(t, o?.header);
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

export { modalOptions, createModal, Modal }
/* //<-- modal.js ends here*/
