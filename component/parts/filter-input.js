/**
 * @file filter-input.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import * as fr from "../../core/fr";
import { iconFont, iconFontOption, EmphasisGrade } from "./fragment/icon-font";
import { inputOption, Input } from "./fragment/input";
/**
 * @typedef { import("./fragment/input").InputOption } FilterInputOption
 */
/** @type { FilterInputOption } */
/**
 * Create option attributes for FilteInput parts
 *  @param { String } [l = "25"] - size of input field.
 *  @param { String } [s = "is-normal"] - input field font size.
 *  @returns { FilterInputOption }
 */
function filterInputOption(l = 25, s = "is-normal") {
    let c = [s, "icon-pos-right"];
    let o = {};
    let opt = inputOption("text", "filter: ", l, "", "filter", c, o);
    return opt;
}
/**
 * FilterInput
 *
 * Creates a filter input field with filter icon.
 */
class FilterInput extends fr.NodeParts {
    /** @private @type { Input } [#input] - Input instance. */
    #input = undefined;
    /** @private @type { import("./fragment/icon-font").IconFont } [#icon] - IconFont instance. */
    #icon = undefined;
    /** @private @type { Boolean } [#filter] - mode switch for icon name. */
    #filter = false;
    /** @private @type { String } [#target] - field name for filter target. */
    #target = '';
    /**
     *  @param { FilterInputOption } o - option
     *  @param { String } [t = 'id'] - target index of the filtering
     */
    constructor(o, t = 'id', w = "20vw") {
        o = (o) ? o : filterInputOption();
        super();
        this.#filter = false;
        this.#target = t;
        o.placeholder = `filter: ${this.#target}`;
        this.#icon = iconFont(iconFontOption("filter_alt_off", EmphasisGrade.normal, false, true));
        /**
         * Setup icon event handlers.
         * @listens { click } when filter icon clicked.
         */
        this.#icon.handlers = [{en:'click', eh: this.#handleIconClick.bind(this)}];
        this.#input = new Input(o);
        /**
         * Setup input field event handlers
         *  @listens { click } when input field clicked for value input.
         *  @listens { input } when value input
         *  @listens { keydown } when "return key" or "@ key" pressed.
         */
        this.#input.handlers = [
            {en: "click", eh: this.#handleInputClick.bind(this)},
            {en: "input", eh: this.#handleInput.bind(this)},
            {en: "keydown", eh: this.#handleKeydown.bind(this)}
        ];
        this._node = fr.nel("p",
                            {
                                class:["input-wrapper", "with-icon"],
                                style: {width: w}
                            },
                            this.#input,
                            this.#icon);
    }
    // getter setter
    get value() {
        return this.#input.value;
    }

    set value(v) {
        this.#input.value = v;
    }

    get target() {
        return this.#target;
    }

    set target(t) {
        this.#target = t;
        this.#stopFilter();
        this.#input.attrs.placeholder = `filter: ${this.#target}`;
        this.#input.updateAttributes();
    }

    get element() {
        return this._node.element;
    }
    /**
     * change to error color
     */
    occureError() {
        this.#input.element.classList.add("is-error");
    }
    /**
     * change normal color
     */
    clearError() {
        this.#input.element.classList.remove("is-error");
    }
    /**
     * redraw icon
     *  @param { String } [n] - icon font name. (nessesary defined in material symbols)
     */
    #updateIcon(n) {
        this.#icon.changeIcon(n);
        this.#icon.update();
    }
    #startFilter() {
        fr.emit("fr:filter-start",
                {
                    v: this.value,
                    target: this.#target
                },
                this.node.element);
    }
    #stopFilter() {
        if (this.#filter === true) {
            this.#filter = false;
            this.#updateIcon("filter_alt_off");
            this.value = "";
            fr.emit("fr:filter-stop", {}, this.node.element);
        }
    }
    // event handlers (when entry in listeners, must .bind(this))
    /**
     *  @param { Event } [evt] - event source
     */
    #handleInputClick(evt) {
        evt.stopPropagation();
        if (this.#filter === false) {
            this.#filter = true;
            this.#updateIcon("filter_alt");
        }
    }
    /**
     *  @fires { fr:filter-stop } Request stop filter.
     *  @param { Event } [evt] - event source
     */
    #handleIconClick(evt) {
        evt.stopPropagation();
        this.#stopFilter();
    }
    /**
     *  @fires { fr:filter-start } Request start filtering
     *  @param { Event } [evt] - event source
     */
    #handleInput(evt) {
        evt.stopPropagation();
        if (this.value.length >= 3 && !this.value.startsWith("@") && this.#filter) {
            this.#startFilter();
        }
    }
    /**
     *  @param { Event } [evt] - event source
     */
    #handleKeydown(evt) {
        evt.stopPropagation();
        if (evt.key === "Enter" || evt.key === "@") {
            if (this.value.length > 0) {
                this.#startFilter();
            }
        }
    }
    //
}

export {
    FilterInput,
    filterInputOption,
};
/* //<-- filter-input.js ends here*/
