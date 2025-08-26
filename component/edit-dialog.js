/**
 * @file Provides a dialog for creating, editing, and deleting data records.
 * @copyright 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details.
 * @author s3mat3
 */
"use strict";

import { labelDropdown, labelDropdownOption } from "./parts/label-dropdown";
import { Dialog, dialogOption } from "./parts/dialog";
import { LabelInput, labelInputOption } from "./parts/label-input";
import { ColumnConfiguration } from "@/lib/view-model/column-configuration";
import * as fr from "../core/fr";

/**
 * A dialog for creating, updating, and deleting data based on a provided
 * data object and column configuration.
 *
 * It operates in two modes:
 * - **Add Mode:** When no initial data is provided. The "Mod" and "Del" buttons are disabled.
 * - **Edit Mode:** When initial data is provided. The "Add" button is disabled.
 */
class EditDialog {
    /** @type { import("../../lib/view-model/column-configuration").ColumnConfigurationList } */
    _config = [];
    /** @type {Object.<string, any>} */
    _data = {};
    /** @type {Array<{k: string, v: any}>} */
    _keyList = [];
    /** @type {Array<LabelInput|LabelDropdown>} */
    _boxes = [];
    /** @type {boolean} mode selector: false is add mode, true is update/delete mode */
    #mode = false;
    /** @type {Object.<string, any>} */
    #prev = {};

    #addClickHandler;
    #modClickHandler;
    #delClickHandler;
    #canClickHandler;

    /**
     * Creates an instance of EditDialog.
     * @param {string} t - The title for the dialog.
     * @param {string} [w="80vw"] - The width of the dialog.
     * @param {import("./parts/dialog").DialogOption} [o] - Options for the dialog.
     * @param {{data: Object, config: ColumnConfiguration[]}} target - The data and configuration for the dialog.
     */
    constructor(t, w = "80vw", o, target) {
        o = o ?? dialogOption(true);
        o.dialog.style.width = w;

        this._data = { ...target?.data };
        this.#prev = { ...target?.data };
        this._config = [ ...target?.config ];
        this.#mode = !fr.isEmptyObj(this._data);

        this.#createEditBox();
        this.#createFooter();

        this.dialog = new Dialog(t, o, this._boxes, this.footer);

        // Bind functions for event listeners
        this.#addClickHandler = this.onAdd.bind(this);
        this.#modClickHandler = this.onMod.bind(this);
        this.#delClickHandler = this.onDel.bind(this);
        this.#canClickHandler = this.onCancel.bind(this);
    }

    /**
     * Opens the dialog and attaches event listeners.
     */
    open() {
        fr.setEvent(this.add.element, "click", this.#addClickHandler);
        fr.setEvent(this.mod.element, "click", this.#modClickHandler);
        fr.setEvent(this.del.element, "click", this.#delClickHandler);
        fr.setEvent(this.can.element, "click", this.#canClickHandler);
        this.dialog.open();
    }

    /**
     * Closes the dialog and removes event listeners.
     */
    close() {
        this.add.element.removeEventListener("click", this.#addClickHandler);
        this.mod.element.removeEventListener("click", this.#modClickHandler);
        this.del.element.removeEventListener("click", this.#delClickHandler);
        this.can.element.removeEventListener("click", this.#canClickHandler);
        this.dialog.close();
    }

    /**
     * Updates the internal data object with the current values from the form fields.
     */
    updateData() {
        this.#prev = { ...this._data }; // backup previous state
        for (const box of this._boxes) {
            this._data[box.name] = box.value;
        }
    }

    /**
     * Handles the 'Add' button click event.
     * @param {Event} e - The click event.
     * @fires fr:edit-add
     */
    onAdd(e) {
        e.preventDefault();
        this.updateData();
        fr.emit("fr:edit-add", this.#createEditedData());
        this.close();
    }

    /**
     * Handles the 'Mod' button click event.
     * @param {Event} e - The click event.
     * @fires fr:edit-mod
     */
    onMod(e) {
        e.preventDefault();
        this.updateData();
        fr.emit("fr:edit-mod", this.#createEditedData());
        this.close();
    }

    /**
     * Handles the 'Del' button click event.
     * @param {Event} e - The click event.
     * @fires fr:edit-del
     */
    onDel(e) {
        e.preventDefault();
        fr.emit("fr:edit-del", this.#createEditedData());
        this.close();
    }

    /**
     * Handles the 'Cancel' button click event.
     * @fires fr:edit-cancel
     */
    onCancel() {
        this._data = { ...this.#prev };
        this.#createEditBox();
        fr.emit("fr:edit-cancel", {});
        this.close();
    }

    /**
     * Creates the data payload for events.
     * @returns {{k: Array<{k: string, v: any}>, v: Object.<string, any>}}
     */
    #createEditedData() {
        return { k: [ ...this._keyList ], v: { ...this._data } };
    }

    /**
     * Creates the form elements (inputs and dropdowns) based on the column configuration.
     * @private
     */
    #createEditBox() {
        this._boxes = [];
        this._keyList = [];

        for (const s of this._config) {
            const value = this.#mode ? (this._data[s.field] ?? "") : s.default ?? "";
            if (this.#mode && s.key) {
                this._keyList.push({ k: s.field, v: value });
            }

            const isReadOnly = s.ro && this.#mode;

            if (s.type === "dropdown") {
                const lo = labelDropdownOption();
                lo.dropdown.name = s.field;
                if (isReadOnly) {
                    lo.dropdown.disabled = true;
                }

                // Set selected flag for dropdown
                s.dropdown.forEach(d => d.f = d.k === value);

                const l = labelDropdown(s.name, lo, s.dropdown);
                this._boxes.push(l);
            } else {
                const lo = labelInputOption();
                lo.input.placeholder = s.name;
                lo.input.name = s.field;
                if (isReadOnly) {
                    lo.input.readonly = true;
                }
                if (s.hidden) {
                    lo.style = { display: "none" };
                }

                const l = new LabelInput(s.name, lo);
                l.value = value;
                this._boxes.push(l);
            }
        }
    }

    /**
     * Creates the footer with Add, Mod, Can, and Del buttons.
     * @private
     */
    #createFooter() {
        const addBtnOpts = { class: ["col-2", "is-primary"] };
        if (this.#mode) {
            addBtnOpts.disabled = true;
        }
        const modBtnOpts = { class: ["col-2", "is-warning"] };
        if (!this.#mode) {
            modBtnOpts.disabled = true;
        }
        const delBtnOpts = { class: ["col-2", "is-danger"] };
        if (!this.#mode) {
            delBtnOpts.disabled = true;
        }
        const canBtnOpts = { class: ["col-3", "is-primary"] };

        this.add = fr.nel("button", addBtnOpts, "ADD");
        this.mod = fr.nel("button", modBtnOpts, "MOD");
        this.can = fr.nel("button", canBtnOpts, "CANCEL");
        this.del = fr.nel("button", delBtnOpts, "DEL");

        this.footer = fr.nel("div", { class: ["row"] },
            this.add,
            this.mod,
            this.can,
            fr.element`<span class="col-3"></span>`, // Spacer
            this.del
        );
    }
} /* //<-- class EditDialog ends here */

export {
    EditDialog,
};

/* //<-- edit-dialog.js ends here*/
