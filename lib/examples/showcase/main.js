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
import "@styles/frcl.scss";

import {Nel} from "../../index";
import { modalOptions, Modal } from "../../component/parts/modal";

const md  = $$("#modal_1");
const btn = $$("#modal_1_open");

const hello = new Nel(1, "p", {}, "Hello!!!");
const world = new Nel(1, "p", {}, "world!!!");
const mo = modalOptions();
console.log(mo);
mo.header.icon_class = ["icon", "col-2"];
const modal = new Modal("Hogehoge", mo, hello, world);

modal.mounted = [
    () => {
        btn.removeEventListener("click", () => {
            modal.open();
        });
        btn.addEventListener("click", () => {
            modal.open();
        });
        modal.ico.element.removeEventListener("click", () => {
            modal.close()
        });
        modal.ico.element.addEventListener("click", () => {
            modal.close()
        });
    },
];

modal.mount(md);

/* //<-- main.js ends here*/
