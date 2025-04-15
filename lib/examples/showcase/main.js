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

import {Nel, nel, element, setEvent} from "../../index";
import { dialogOption, modalDialog, messageDialog, dialogContent } from "../../component/parts/modal";

const md1  = $$("#modal_1");
const btn1 = $$("#modal_1_open");

/** @type { import("../../component/parts/modal").DialogOption } mo */
const mo = dialogOption(true);
const hello = element`<p><span>Hello!!!</span></p>`;
const world = element`<p><span>World !!</span></p>`;

const simple = modalDialog("Hello simple", mo, dialogContent(hello, world));

function esim() {
    setEvent(btn1, "click", () => {
        simple.open();
    });
    setEvent(simple.header.icon.element, "click", () => {
        simple.close();
    });
}
simple.mounted = [esim, ];
simple.mount(md1);

const md2  = $$("#modal_2");
const btn2 = $$("#modal_2_open");
const msg2 = messageDialog("admon", "warning", dialogOption(true), nel("div", {}, element`<p><span>warning</span></p>`)); 
function emsg2() {
    setEvent(btn2, "click", () => {
        msg2.open();
    });
    setEvent(msg2.header.icon.element, "click", () => {
        msg2.close();
    });
}
msg2.mounted = [emsg2,];
msg2.mount(md2);

const md3  = $$("#modal_3");
const btn3 = $$("#modal_3_open");
const msg3 = messageDialog("admon", "caution", dialogOption(true), nel("div", {}, element`<p><span>caution</span></p>`)); 
function emsg3() {
    setEvent(btn3, "click", () => {
        msg3.open();
    });
    setEvent(msg3.header.icon.element, "click", () => {
        msg3.close();
    });
}
msg3.mounted = [emsg3,];
msg3.mount(md3);

const md4  = $$("#modal_4");
const btn4 = $$("#modal_4_open");
const msg4 = messageDialog("admon", "notice", dialogOption(true), nel("div", {}, element`<p><span>notice</span></p>`)); 
function emsg4() {
    setEvent(btn4, "click", () => {
        msg4.open();
    });
    setEvent(msg4.header.icon.element, "click", () => {
        msg4.close();
    });
}
msg4.mounted = [emsg4,];
msg4.mount(md4);

const md5  = $$("#modal_5");
const btn5 = $$("#modal_5_open");
const msg5 = messageDialog("status", "error", dialogOption(true), nel("div", {}, element`<p><span>error</span></p>`)); 
function emsg5() {
    setEvent(btn5, "click", () => {
        msg5.open();
    });
    setEvent(msg5.header.icon.element, "click", () => {
        msg5.close();
    });
}
msg5.mounted = [emsg5,];
msg5.mount(md5);

const md6  = $$("#modal_6");
const btn6 = $$("#modal_6_open");
const msg6 = messageDialog("status", "success", dialogOption(true), nel("div", {}, element`<p><span>error</span></p>`)); 
function emsg6() {
    setEvent(btn6, "click", () => {
        msg6.open();
    });
    setEvent(msg6.header.icon.element, "click", () => {
        msg6.close();
    });
}
msg6.mounted = [emsg6,];
msg6.mount(md6);

const md7  = $$("#modal_7");
const btn7 = $$("#modal_7_open");
const msg7 = messageDialog("status", "info", dialogOption(true), nel("div", {}, element`<p><span>error</span></p>`)); 
function emsg7() {
    setEvent(btn7, "click", () => {
        msg7.open();
    });
    setEvent(msg7.header.icon.element, "click", () => {
        msg7.close();
    });
}
msg7.mounted = [emsg7,];
msg7.mount(md7);

/* //<-- main.js ends here*/
