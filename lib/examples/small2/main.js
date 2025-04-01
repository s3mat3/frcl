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
import * as fr from "../../core/fr";
import { iconFontOptions, IconFont } from "../../component/parts/fragment/icon-font";
const app = $$("#app");



const iconOptions = iconFontOptions();
const ico = new fr.Reference({name: "toggle_off", color: "green", size: "4rem"});
iconOptions.icon_name = fr.useRef(ico, "name");
iconOptions.color     = fr.useRef(ico, "color");
iconOptions.size      = fr.useRef(ico, "size");
const msg = new fr.Reference(0);
const stl = new fr.Reference({size: "20px", color: "red"});
const cls = new fr.Reference(["is-small", "hiden"])
const attrs = {
    class: [ cls.value[0], cls.value[1] ],
    style: {
        "font-size": fr.useRef(stl, "size"),
        "background": fr.useRef(stl, "color")
    }
}
msg.value = 100;
const icon = new IconFont(iconOptions);
const tag = new fr.Nel(1, "span", {}, "Hello ", fr.useRef(msg));
const div = new fr.Nel(1, "div", attrs, tag, icon);
// const div = new fr.Nel(1, "div", {});
div.mount(app);
setTimeout(() => {
    msg.value = 300;
    stl.value =  {size:"40px", color:"green"};
    cls.value = ["is-large", "visible"];
    ico.value = {name: "toggle_on", color: "red", size: "8rem"}
}, 5000);

icon.element.addEventListener("click", (e) => {
    console.log(e);
})
/* //<-- main.js ends here*/
