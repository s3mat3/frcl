/**
 * @file edit-dialog.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";
import { labelDropdown, labelDropdownOption } from "./parts/fragment/dropdown";
import { Dialog, dialogOption } from "./parts/dialog";
import { LabelInput, labelInputOption } from "./parts/fragment/label-input";
import { ColumnConfiguration, ColumnType }  from "./view-model/column-configuration";
import * as fr from "../core/fr";
/**
 * 
 */
class EditDialog {
    /** @type { import("./view-model/column-configuration").ColumnConfigurationList } _config */
    _config = [];
    _data  = {};
    _keyList = [];
    _boxes = [];
    /** @type { Boolean } mode selector false is add mode / true is update and delete mode */
    #mode = false;
    #prev = {};
    // /** @type { Boolean } #active */
    // #active = false;
    #add = undefined;
    #mod = undefined;
    #del = undefined;
    #can = undefined;
    /**
     *  @param { String } t is dialog title
     *  @param { Stringg } w is dialog width
     *  @param { import("../../component/parts/dialog").DialogOption } o is dialog option
     */
    constructor(t, w = "80vw", o, target) {
        o = (! o) ? dialogOption(true) : o;
        o.dialog.style.width = w;
        this._data = { ...target?.data };
        this.#prev = { ...target?.data };
        this._config = [ ...target?.config ];
        this.#mode = (fr.isEmptyObj(this._data)) ? false : true;
        // create dialog contents
        this.#createEditBox();
        console.log(this._boxes);
        this.#createFooter();
        this.dialog = new Dialog(t, o, this._boxes, this.footer);
        // bind functions for event listener
        this.#add = this.onAdd.bind(this);
        this.#mod = this.onMod.bind(this);
        this.#del = this.onDel.bind(this);
        this.#can = this.onCancel.bind(this);
    } /* //<-- constructor ends here */

    selected() {
        for (const b of this._boxes) {
            if ("dropdown" in b) {
                b.dropdown.selected = b.dropdown.index;
            }
        }
    }

    open() {
        this.selected();
        fr.setEvent(this.add.element, "click", this.#add);
        fr.setEvent(this.mod.element, "click", this.#mod);
        fr.setEvent(this.del.element, "click", this.#del);
        fr.setEvent(this.can.element, "click", this.#can);
        this.dialog.open();
    }

    close() {
        this.add.element.removeEventListener("click", this.#add);
        this.mod.element.removeEventListener("click", this.#mod);
        this.del.element.removeEventListener("click", this.#del);
        this.can.element.removeEventListener("click", this.#can);
        this.dialog.close();
    }


    updateData() {
        this.#prev = { ...this._data } // simple object only
        for (const i of this._boxes) {
            console.log(i.name, i.value);
            this._data[i.name] = i.value;
            if ("dropdown" in i) {
                i.selected = i.selected;
            }
        }
    }

    onAdd(e) {
        e.preventDefault();
        this.updateData();
        fr.emit("fr:edit-add", this.#createEditedData());
        console.log(this._data, this._keyList);
        this.close();
    }

    onMod(e) {
        e.preventDefault();
        this.updateData();
        fr.emit("fr:edit-mod", this.#createEditedData());
        console.log(this._data, this._keyList);
        this.close();
    }

    onDel(e) {
        e.preventDefault();
        fr.emit("fr:edit-del", this.#createEditedData());
        console.log(this._data, this._keyList);
        this.close();
    }

    onCancel() {
        console.log("cancel");
        this.#revert();
        fr.emit("fr:edit-cancel", { ...this._data });
        this.close();
    }

    #revert() {
        this._data = { ...this.#prev };
        this.#createEditBox();
        const p = this.dialog.content.parent;
        this.dialog.content.mount(p);
    }

    #createEditedData() {
        return { k: [ ...this._keyList ], v: { ...this._data } };
    }

    #createEditBox() {
        this._boxes = [];
        for (const s of this._config) {
            const v = (s.field in this._data) ? this._data[s.field] : "";
            if (s.key) this._keyList.push({ k: s.field, v: v })
            let style = {};
            (s.hidden) ? (style.hidden = true) : $nop();
            (s.ro) ? (style.readonly = true) : $nop();

            if (s.type === "dropdown") {
                let lo = labelDropdownOption();
                lo.dropdown.name = s.field;
                for (const d of s.dropdown) {
                    if (d.v !== v) continue;
                    d.f = true;
                    break;
                }
                const l = labelDropdown(s.name, lo, s.dropdown)
                this._boxes.push(l);
            } else {
                let lo = labelInputOption();
                lo.input.placeholder = s.name;
                lo.input.name = s.field;
                lo.input.style = { ...lo.input.style, ...style };
                const l = new LabelInput(s.name, lo);
                l.input.value = v;
                this._boxes.push(l);
            }
        } /* //<-- _config for loop ends here */
    }

    #createFooter() {
        const aop = {class:["col-2", "is-primary", "is-normal"]};
        const mop = {class:["col-2", "is-warning", "is-normal"]};
        const dop = {class:["col-2", "is-danger", "is-normal"]};
        if (this.#mode) { // #mode === true -> modify / delete mode
            aop.disabled = true;
        } else { // #mode === false -> add mode
            mop.disabled = true;
            dop.disabled = true;
        }
        this.add = fr.nel("button", aop, fr.nel("span", {}, "ADD"));
        this.mod = fr.nel("button", mop, fr.nel("span", {}, "MOD"));
        this.can = fr.nel("button", {class:["col-3", "is-primary", "is-normal"]}, fr.nel("span", {}, "CANCEL"));
        this.del = fr.nel("button", dop,  fr.nel("span", {}, "DEL"));
        this.footer =  fr.nel("div", {class: ["row"]},
                              this.add,
                              this.mod,
                              this.can,
                              fr.element`<span class="col-3"></span>`,
                              this.del,
                             );
    }
} /* //<-- class EditDialog ends here */

export {
    EditDialog,
}

/* //<-- edit-dialog.js ends here*/
