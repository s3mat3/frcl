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
import * as fr from "../../core/fr";
import { iconFontOption, IconFont } from "../../component/parts/fragment/icon-font";
const app = $$("#app");



const iconOption = iconFontOption();
const ico = new fr.Reference({name: "toggle_off", color: "green", size: "4rem"});
iconOption.name               = fr.useRef(ico, "name");
iconOption.style.color        = fr.useRef(ico, "color");
iconOption.style["font-size"] = fr.useRef(ico, "size");
const msg = new fr.Reference(0);
const stl = new fr.Reference({size: "4rem", color: "red"});
const cls = new fr.Reference(["is-small", "hiden"])
const attrs = {
    class: [ cls.value[0], cls.value[1] ],
    style: {
        "font-size": fr.useRef(stl, "size"),
        "background": fr.useRef(stl, "color")
    }
}
msg.value = 100;
const icon = new IconFont(iconOption);
const tag = new fr.Nel(fr.NType.tagname, "span", {}, "Hello ", fr.useRef(msg));
const div = new fr.Nel(fr.NType.tagname, "div", attrs, tag, icon);
// const div = new fr.Nel(1, "div", {});
div.mount(app);
setTimeout(() => {
    msg.value = 300;
    stl.value =  {size:"4rem", color:"green"};
    cls.value = ["is-large", "visible"];
    ico.value = {name: "toggle_on", color: "red", size: "8rem"}
}, 5000);

icon.element.addEventListener("click", (e) => {
    console.log(e);
})
/* //<-- main.js ends here*/
