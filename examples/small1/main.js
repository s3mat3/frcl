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

import "@styles/frcl.scss";
import "material-symbols/outlined.css";
// import { attach, tag, setEvent } from "../../core/element";
import { monitor,
         createReaction,
         element,
         setEvent,
         nel,
       } from "../../index";

import { IconFont, iconFontOption } from "../../component/parts/fragment/icon-font"

const swState = monitor({icon_name: "toggle_off", fill: false, color: "blue"});

let _flag = false;
function toggle(e) {
    e.preventDefault();
    _flag = !_flag;
    swState.icon_name = (_flag === true) ? "toggle_on" : "toggle_off";
    swState.color = (_flag === true) ? "red" : "blue";
    swState.fill = _flag;
}

const iopts = iconFontOption();
iopts.name               = swState.icon_name;
iopts.fill               = swState.fill;
iopts.style.color        = swState.color;
iopts.style["font-size"] = "7.2rem";
iopts.clickable          = true;

console.log(iopts);

const icon = new IconFont(iopts);
const p    = nel("p", {class: "is-center", style:{margin: "auto"}});

icon.mount($$("#toggle"));

createReaction(() => {
    icon.changeFill(swState.fill);
    icon.changeIcon(swState.icon_name);
    icon.changeColor(swState.color);
    icon.update();
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
up_btn = nel("button",
             {
                 class: ["is-danger", "is-large"],
                 style: {display: "inline", margin: "auto", width: "20vw", height: "10vh"},
                 onclick: up
             },
             element`<span>+</span>`);
///
dn_btn = nel("button",
             {
                 class: ["is-danger", "is-large"],
                 style: {display: "inline", margin: "auto", width: "20vw", height: "10vh"},
                 onclick: dn
             },
             element`<span>-</span>`);

const btn_cont = nel("span", {}, up_btn, dn_btn);
btn_cont.mount(pa)
result = nel("span", {style: {"font-size": "4rem", "text-align": "center",},}, `${count.value}`);
result.mount(re);

createReaction(() => {
    // result.children[0] = `${count.value}`;
    result.updateChild(0, `${count.value}`);
    result.update();
});


/* //<-- main.js ends here*/
