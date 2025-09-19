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

import * as fr from "../../core/fr";
import { dropdownItem, dropdownOption, dropdown } from "../../component/parts/fragment/dropdown";
import { iconFontOption, iconFont } from "../../component/parts/fragment/icon-font";
import { FilterInput } from "../../component/parts/filter-input";
import { DataTable } from '../../component/parts/data-table.js';
import { Pagination } from '../../component/parts/pagination.js';
import { EditDialog } from '../../component/edit-dialog.js';

console.log("Hello world");

const slt = $$("#test_filter");
const box = new FilterInput();
box._node.mount(slt);
fr.setEvent(box.node.element, "fr:filter-start", (e) => {
    console.log(e.detail);
});
fr.setEvent(box.node.element, "fr:filter-stop", (e) => {
    console.log("detect filter-stop event");
});

const home = $$("#home_button");
const attr = fr.defaultOption([], {});

let flg = false;
/** @param { Event } e - home */
function handler1(e) {
    e.stopPropagation();
    console.log(e);
    console.log("Icon clicked");
    if (flg === true) {
        flg = false;
        box.target = "name";
        box.occureError();
    } else {
        flg = true;
        box.target = "ID";
        box.clearError();
    }
}
/** @param { Event } e - hoge */
function handler2(e) {
    e.stopPropagation();
    console.log(e);
    console.log("Icon selected");
}

const iopt = iconFontOption("home");
iopt.style["font-size"] = "4.8rem";
const icon = iconFont(iopt);
icon.handlers = [{en: "click", eh: handler1}];

fr.pushEventHandlers(icon.handlers, "mouseover", handler2);

let f = true;
function func1(e) {
    console.log(e);
    if (f) {
        icon.changeIcon("settings");
        icon.update();
        console.log("settings");
        f = false;
    } else {
        icon.changeIcon("home");
        icon.update();
        console.log("home");
        f = true;
    }
}

attr.onclick = func1;
const home_test = fr.nel("div",
                         attr,
                         fr.nel("span",
                                fr.defaultOption(),
                                icon
                               )
                        )
home_test.mount(home);



// Sample data
const conf_list = [
    { field: 'id', name: 'ID', key: true, ro: true, hidden: false, sortable: true },
    { field: 'name', name: 'Name', requierd: true, hidden: false, sortable: true },
    { field: 'email', name: 'Email', requierd: true, hidden: false, sortable: true },
    { field: 'hidden_field', name: 'Hidden', hidden: true },
];

let data = [
    { id: 1, name: 'Alice', email: 'alice@example.com', hidden_field: 'secret1' },
    { id: 2, name: 'Bob', email: 'bob@example.com', hidden_field: 'secret2' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', hidden_field: 'secret3' },
    { id: 4, name: 'David', email: 'david@example.com', hidden_field: 'secret4' },
    { id: 5, name: 'HjklDavid', email: 'david@example.com', hidden_field: 'naisho1' },
    { id: 6, name: 'QweDavid', email: 'david@example.com', hidden_field: 'naisho2' },
    { id: 7, name: 'AsdDavid', email: 'david@example.com', hidden_field: 'naisho3' },
    { id: 8, name: 'ZxcDavid', email: 'david@example.com', hidden_field: 'naisho4' },
    { id: 9, name: 'RtyDavid', email: 'david@example.com', hidden_field: 'naisho5' },
    { id: 10, name: 'HogeDavid', email: 'david@example.com', hidden_field: 'naisho6' },
    { id: 11, name: 'FugaDavid', email: 'david@example.com', hidden_field: 'naisho7' },
    { id: 12, name: 'HeroDavid', email: 'david@example.com', hidden_field: 'naisho8' },
    { id: 13, name: 'PiyoDavid', email: 'david@example.com', hidden_field: 'naisho9' },
    { id: 14, name: 'AAADavid', email: 'david@example.com', hidden_field: 'naisho10' },
    { id: 15, name: 'BBBDavid', email: 'david@example.com', hidden_field: 'naisho11' },
    { id: 16, name: 'XXXDavid', email: 'david@example.com', hidden_field: 'naisho12' },
    { id: 17, name: 'ZZZDavid', email: 'david@example.com', hidden_field: 'naisho13' },
    { id: 18, name: 'EchoDavid', email: 'david@example.com', hidden_field: 'naisho14' },
    { id: 19, name: 'DeltaDavid', email: 'david@example.com', hidden_field: 'naisho15' },
    { id: 20, name: 'AlphaDavid', email: 'david@example.com', hidden_field: 'naisho16' },
    { id: 21, name: 'BlaboDavid', email: 'david@example.com', hidden_field: 'naisho17' },
    { id: 22, name: 'ZooDavid', email: 'david@example.com', hidden_field: 'naisho18' },
    { id: 23, name: 'TeheDavid', email: 'david@example.com', hidden_field: 'naisho19' },
    { id: 24, name: 'KeroDavid', email: 'david@example.com', hidden_field: 'naisho20' },
    { id: 25, name: 'PokoDavid', email: 'david@example.com', hidden_field: 'naisho21' },
    { id: 26, name: 'QooDavid', email: 'david@example.com', hidden_field: 'naisho22' },
];

// Table initialization
const dialogContainer = $$('#edit_dialog');
const dataTableContainer = $$('#data_table');
const dataTable = new DataTable({
    title: 'User Data',
    nod: 25,
    width: "100%",
    confList: conf_list,
    data: data,
});

dataTable.mount(dataTableContainer);

// Event listener for row edit requests
document.addEventListener('fr:table-row-dblclick', (e) => {
    console.log('fr:request-row-edit caught:', e.detail);
    const { confList, data } = e.detail;
    const edit = new EditDialog('Edit Row', '60vw', null, { data, config: confList });
    edit.dialog.mount(dialogContainer);
    edit.open();
});

document.addEventListener("fr:table-row-selected", (e) => {
    console.log(e.detail);
});

// Event listener for sort requests
document.addEventListener('fr:table-col-sort', (e) => {
    const { sort_key, direction } = e.detail;
    data.sort((a, b) => {
        if (a[sort_key] < b[sort_key]) {
            return direction === 'asc' ? -1 : 1;
        }
        if (a[sort_key] > b[sort_key]) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    dataTable.updateData([...data]);
});

// Event listeners for dialog actions
document.addEventListener('fr:edit-add', (e) => {
    console.log('ADD:', e.detail.v);
    // In a real app, you would send this to a server and then update the table
});

document.addEventListener('fr:edit-mod', (e) => {
    console.log('MOD:', e.detail.v);
    const index = data.findIndex(item => item.id === e.detail.k[0].v);
    if (index !== -1) {
        data[index] = e.detail.v;
        dataTable.updateData([...data]);
    }
});

document.addEventListener('fr:edit-del', (e) => {
    console.log('DEL:', e.detail.k);
    data = data.filter(item => item.id !== e.detail.k[0].v);
    dataTable.updateData([...data]);
});


const na = new Pagination(10, 1000);
na.node.mount($$("#number_area"));
// document.addEventListener("fr:pagination-change", (e) => {
//     console.log(e.detail);
// })

fr.setEvent(na.node.element, "fr:page-change",(e) => {
    console.log(e.detail);
});

let numbers = [
    dropdownItem("10", "10", false),
    dropdownItem("15", "15", false),
    dropdownItem("20", "20", true),
    dropdownItem("25", "25", false),
    dropdownItem("30", "30", false),
    dropdownItem("50", "50", false),
    dropdownItem("70", "70", false),
    dropdownItem("100", "100", false),
];
let dop = dropdownOption("numbers", ["is-primary", "is-normal"], {});
const numDisp = dropdown(dop, numbers);
numDisp.mount($$("#num_disp"));

/* //<-- main.js ends here*/
