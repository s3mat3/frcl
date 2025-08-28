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
    let opt = inputOption("text", "filter", l, "", "filter", c, o);
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
        this.#icon = iconFont(iconFontOption("filter_alt_off", EmphasisGrade.normal, false, true));
        this.#input = new Input(o);
        this._node = fr.nel("p",
                            {
                                class:["input-wrapper", "with-icon"],
                                style: {width: w}
                            },
                            this.#input,
                            this.#icon);
        // element life cycle
        this.#input.created = [
            this.#attachEvents.bind(this),
        ];
        this.#icon.beforeMount = [
            this.removeIconEvents.bind(this),
        ];
        this.#icon.beforeUnmount = [
            this.removeIconEvents.bind(this),
        ];
        this.#icon.created = [
            this.addIconEvents.bind(this),
        ];
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
    }

    get element() {
        return this._node.element;
    }

    removeIconEvents() {
        this.#icon.element.removeEventListener('click', this.#handleIconClick.bind(this));
    }

    addIconEvents() {
        this.#icon.element.addEventListener('click', this.#handleIconClick.bind(this));
    }
    /**
     * redraw icon
     *  @param { String } [n] - icon font name. (nessesary defined in material symbols)
     */
    #updateIcon(n) {
        this.#icon.changeIcon(n);
        this.#icon.update();
    }
    // event handlers (when entry in listeners, must .bind(this))
    /**
     *  @param { String } [v] - input value
     *  @fires { fr:req-filtering } Request start filtering
     */
    #reqFiltering(v) {
        if (v.length > 0) {
            fr.emit("fr:req-filtering",
                    {v: v, target: this.#target},
                    this.node.element);
        }
    }
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
     *  @fires { fr:stop-filtering } Request stop filter.
     *  @param { Event } [evt] - event source
     */
    #handleIconClick(evt) {
        evt.stopPropagation();
        if (this.#filter === true) {
            this.#filter = false;
            this.#updateIcon("filter_alt_off");
            this.value = "";
        }
        fr.emit("fr:stop-filtering", {}, this.node.element);
    }
    /**
     *  @param { Event } [evt] - event source
     */
    #handleInput(evt) {
        evt.stopPropagation();
        if (this.value.length >= 3 && !this.value.startsWith("@") && this.#filter) {
            this.#reqFiltering(this.value);
        }
    }
    /**
     *  @param { Event } [evt] - event source
     */
    #handleKeydown(evt) {
        evt.stopPropagation();
        if (evt.key === "Enter" || evt.key === "@") {
            this.#reqFiltering(this.value);
        }
    }
    //
    /**
     *  @listens { click } when filter icon clicked.
     *  @listens { click } when input field clicked for value input.
     *  @listens { input } when value input
     *  @listens { keydown } when "return key" or "@ key" pressed.
     */
    #attachEvents() {
        fr.setEvent(this.#input.element, "click", this.#handleInputClick.bind(this));
        fr.setEvent(this.#input.element, "input",   this.#handleInput.bind(this));
        fr.setEvent(this.#input.element, "keydown", this.#handleKeydown.bind(this));
    }
}

export {
    FilterInput,
    filterInputOption,
};
/* //<-- filter-input.js ends here*/
