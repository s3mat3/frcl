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
import { attach, tag, setEvent } from "../../core/element";
import { monitor, createReaction } from "../../index";
import { IconFont, iconFontOptions } from "../../component/parts/fragment/icon_font"

const swState = monitor({icon_name: "toggle_off", fill: false, color: "blue"});

let _flag = false;
function toggle(e) {
    e.preventDefault();
    _flag = !_flag;
    swState.icon_name = (_flag === true) ? "toggle_on" : "toggle_off";
    swState.color = (_flag === true) ? "red" : "blue";
    swState.fill = _flag;
}

const iopts     = iconFontOptions();
iopts.icon_name = swState.icon_name;
iopts.fill      = swState.fill;
iopts.color     = swState.color;
iopts.size      = "72pt";
iopts.clickable = true;

const icon = new IconFont("toggle_off", iopts);
const p    = tag("p", {class: "is-center", style:{meargin: "auto"}});
attach(p, icon.build());
attach($$("#toggle"), p);

createReaction(() => {
    icon.changeFill(swState.fill);
    icon.changeIcon(swState.icon_name);
    icon.changeColor(swState.color);
    attach(p, icon.build());
    setEvent(icon.element, "click", toggle);
});

let count = monitor(0);
function up() {
    count.value++
}
function dn() {
    count.value--
}
// console.log(count);
let up_btn = undefined;
let dn_btn = undefined;
let result = undefined;
let pa = $$("#button");
let re = $$("#result");
up_btn = tag("button",
             {
                 class: ["is-danger", "is-large"],
                 style: {display: "inline", mergin: "auto", width: "20vw", height: "10vh"},
                 onclick: up
             },
             `<span>+</span>`);
dn_btn = tag("button",
             {
                 class: ["is-danger", "is-large"],
                 style: {display: "inline", width: "20vw", height: "10vh"},
                 onclick: dn
             },
             `<span>-</span>`);

const btn_cont = tag("span", {}, up_btn, dn_btn);
attach(pa, btn_cont);

createReaction(() => {
    result = tag("span", {style: {"font-size": "4rem",},}, `${count.value}`);
    attach(re, result);
});


/* //<-- main.js ends here*/
