/**
 * @file main.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';
import "material-symbols/outlined.css";
import "../../../styles/css/reset.css";
import "../../../styles/css/fr.css";

import * as fr from "../../core/fr";
import { modalOptions, Modal } from "../../component/parts/modal";

const md  = $$("#modal_1");
const btn = $$("#modal_1_open");

const hello = new fr.Nel(1, "p", {}, "Hello!!!");
const world = new fr.Nel(1, "p", {}, "world!!!");
const mo = modalOptions();
const modal = new Modal("Hogehoge", mo, hello, world);

modal.mounted = {
    open: function () {
        btn.removeEventListener("click", () => {
            modal.open();
        });
        btn.addEventListener("click", () => {
            modal.open();
        });
    },
    close: function () {
        modal.ico.element.addEventListener("click", () => {
            modal.close()
        });
    }
}

modal.mount(md);

/* //<-- main.js ends here*/
