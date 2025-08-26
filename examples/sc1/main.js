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
"use strict";

import "material-symbols/outlined.css";
import "@styles/frcl.scss";
import * as fr from "../../index";
import { dropdownItem, } from "../../component/parts/fragment/dropdown";
import { labelDropdown, labelDropdownOption } from "../../component/parts/label-dropdown";
import { dialogOption } from "../../component/parts/dialog";
import { ColumnConfiguration, ColumnType } from "../../lib/view-model/column-configuration";
import { EditDialog } from "../../component/edit-dialog"

const md  = $$("#app");
const btn = $$("#edit_open");

const x = [
    dropdownItem("101", "hoge"),
    dropdownItem("102", "geko", true),
    dropdownItem("3", "pero"),
    dropdownItem("4", "fuga"),
    dropdownItem("5", "kero"),
];

const sel = labelDropdown("combo 1", labelDropdownOption(), x);
sel.mount($$("#hoge"));
sel.dropdown.selected = sel.dropdown.index;
sel.dropdown.element.addEventListener("change", (e) => {
    sel.dropdown.selected = sel.dropdown.selected;
    console.log(sel.index);
    console.log(sel.value);
})


$$("#toast_open").addEventListener("click", () => {
    $toast("Error access denied", "is-warning", 2);
});

const status_list = [
    {k: 1, v: "ent", f: false},
    {k: 2, v: "open", f: false},
    {k: 3, v: "progress", f: false},
    {k: 4, v: "done", f: false},
    {k: 5, v: "reject", f: false},
];

const dummy_data = [
    { id: "1", name: "good", status: "ent" },
    { id: "2", name: "good", status: "open" },
    { id: "3", name: "good", status: "progress" },
    { id: "4", name: "good", status: "done" },
    { id: "5", name: "good", status: "reject" },
    {},
];

const test_data_set = {
    config: [
        new ColumnConfiguration("id", "ID", ColumnType.text, "", undefined, true),
        new ColumnConfiguration("name", "name", ColumnType.text, "", undefined, false),
        new ColumnConfiguration("status", "status", ColumnType.drop, "", status_list, false),
    ],
    data: dummy_data[4],
}
const edit = new EditDialog("Hogehoge", "40vw", dialogOption(true), test_data_set);
function eedit() {
    fr.setEvent(btn, "click", () => {
        edit.open();
    });
    fr.setEvent(edit.dialog.icon.element, "click", () => {
        edit.close();
    });
}

document.addEventListener('fr:edit-mod', (e) => {console.log(e.detail);});

edit.dialog.node.mounted = [eedit, ];
edit.dialog.mount(md);

/* //<-- main.js ends here*/
