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

import {nel, element, setEvent} from "../../index";
import { dialog, messageDialog, dialogContent, dialogOption } from "../../component/parts/dialog";
import { loginDialog } from "../../component/parts/login-dialog"
const md1  = $$("#modal_1");
const btn1 = $$("#modal_1_open");

const mo = dialogOption(true);
const hello = element`<p><span>Hello!!!</span></p>`;
const world = element`<p><span>World !!</span></p>`;
const simple = dialog("Hello simple", mo, dialogContent(hello, world));

function esim() {
    setEvent(btn1, "click", () => {
        simple.open();
    });
    setEvent(simple.header.icon.element, "click", () => {
        simple.close();
    });
}
simple.node.mounted = [esim, ];
simple.node.mount(md1);

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
msg2.node.mounted = [emsg2,];
msg2.node.mount(md2);

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
msg3.node.mounted = [emsg3,];
msg3.node.mount(md3);

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
msg4.node.mounted = [emsg4,];
msg4.node.mount(md4);

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
msg5.node.mounted = [emsg5,];
msg5.node.mount(md5);

const md6  = $$("#modal_6");
const btn6 = $$("#modal_6_open");
const msg6 = messageDialog("status", "success", dialogOption(true), nel("div", {}, element`<p><span>success</span></p>`)); 
function emsg6() {
    setEvent(btn6, "click", () => {
        msg6.open();
    });
    setEvent(msg6.header.icon.element, "click", () => {
        msg6.close();
    });
}
msg6.node.mounted = [emsg6,];
msg6.node.mount(md6);

const md7  = $$("#modal_7");
const btn7 = $$("#modal_7_open");
const msg7 = messageDialog("status", "info", dialogOption(true), nel("div", {}, element`<p><span>info</span></p>`)); 
function emsg7() {
    setEvent(btn7, "click", () => {
        msg7.open();
    });
    setEvent(msg7.header.icon.element, "click", () => {
        msg7.close();
    });
}
msg7.node.mounted = [emsg7,];
msg7.node.mount(md7);

const md8  = $$("#modal_8");
const btn8 = $$("#modal_8_open");

const login = loginDialog();
function elog() {
    setEvent(btn8, "click", () => {
        login.open();
    });
    setEvent(login.icon.element, "click", () => {
        login.close();
    });
}
document.addEventListener("fr:login-request", (e) => {
    alert(`id = ${e.detail.id}
pw = ${e.detail.pw}`);
});
login.parts.node.mounted = [elog, ];
login.mount(md8);

/* //<-- main.js ends here */
