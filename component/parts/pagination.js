/**
 * @file Simple pagination parts definition.
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

import { iconFontOption, iconFont } from "./fragment/icon-font";

/**
 * <pre>
 * |-----------------------------------|
 * | xxx to yyy of maxItems            | <-- number area
 * |-----------------------------------|
 * | |< <  > >|                        | <-- nav area
 * |-----------------------------------|
 * </pre>
 * Simple Pagination parts class
 */
class Pagination extends fr.NodeParts {
    /** Number of display per page.
     * @private
     * @type { fr.Reference } */
    #disp = undefined;
    /**
     * Number of items to display.
     * @type { fr.Reference } */
    #items = undefined;
    /**
     * Current page in display.
     * @type { fr.Reference }  */
    #current = undefined;
    /**
     * Currently displayed start position.
     * @type { fr.Reference } */
    #start = undefined;
    /**
     * Currently displayed end position.
     * @type { fr.Reference } */
    #end = undefined;
    /**
     * Number of max page.
     * @type { Integer }  */
    #pmax = 0;
    /** |< icon
     * @type { fr.Nel } */
    #first;
    /** < icon
     * @type { fr.Nel } */
    #backward;
    /** > icon
     * @type { fr.Nel } */
    #forward;
    /** >| icon
     * @type { fr.Nel } */
    #last;
    /**
     * @constructor
     * @param { Integer } [disp = 25] - Initial number of display per page
     * @param { Integer } [i = 100] - Initial number of item(s)
     */
    constructor(d = 25, i = 100) {
        super();
        this.#disp    = new fr.Reference(d);
        this.#items   = new fr.Reference(i);
        this.#current = new fr.Reference(0);
        this.#start   = new fr.Reference(0);
        this.#end     = new fr.Reference(0);
        this.#updateMaxPage();
        this.#updateCurrentPage();
        let numDispArea = this.#buildNumberArea();
        let navArea = this.#buildNavIcon();
        this._node = fr.nel("div",
                            {
                                style: {
                                    "grid-column":"5/span 8",
                                    "grid-template-rows": "50%"
                                },
                            },
                            numDispArea,
                            navArea
                           );
    }
    /** @returns {Integer} */
    get disp() {return this.#disp.value;}
    /** @param { Integer } d - Number of display per page. */
    set disp(d) {
        if (d === this.#disp.value) return;
        this.#disp.value = d;
        this.#updateMaxPage();
        this.#updateCurrentPage();
        this.#emitChange();
    }
    /** @returns {Integer} */
    get items() {return this.#items.value;}
    /** @param { Integer } i - Number of items. */
    set items(i) {
        if (i === this.#items.value) return;
        this.#items.value = i;
        this.#updateMaxPage();
        this.#updateCurrentPage();
        this.#emitChange();
    }
    /** @returns {Integer} */
    get current() {return this.#current.value;}
    /** @param { Integer } c - Current page number. */
    set current(c) {
        if (c === this.#current) return;
        this.#current.value = c;
        this.#updateCurrentPage();
        this.#emitChange();
    }
    /** @returns {Integer} */
    get start() {return this.#start.value;}
    /** @returns {Integer} */
    get end() {return this.#end.value;}
    /**
     * Build number area.
     * @private
     * @returns { fr.Nel }
     */
    #buildNumberArea() {
        return fr.nel("div",
                      {class:["upper"]},
                      fr.nel("span", {}, fr.useRef(this.#start), " to "),
                      fr.nel("span", {}, fr.useRef(this.#end), " of "),
                      fr.nel("span", {}, fr.useRef(this.#items))
                     );
    }
    /**
     * Build nav icon.
     * @private
     * @returns { fr.Nel }
     */
    #buildNavIcon() {
        // |< icon create
        let topt = iconFontOption("first_page", 0, false, false);
        topt.style["font-size"] = "4.8rem";
        this.#first = iconFont(topt);
        this.#first.handlers = [{en: "click", eh: this.handleFirst.bind(this)}];
        // < icon create
        const bopt = iconFontOption("chevron_backward", 0, false, false);
        bopt.style["font-size"] = "4.8rem";
        this.#backward = iconFont(bopt);
        this.#backward.handlers = [{en: "click", eh: this.handleBackward.bind(this)}];
        // > icon create
        const fopt = iconFontOption("chevron_forward", 0, false, true);
        fopt.style["font-size"] = "4.8rem";
        this.#forward = iconFont(fopt);
        this.#forward.handlers = [{en: "click", eh: this.handleForward.bind(this)}];
        // >| icon create
        const lopt = iconFontOption("last_page", 0, false, true);
        lopt.style["font-size"] = "4.8rem";
        this.#last = iconFont(lopt);
        this.#last.handlers = [{en: "click", eh: this.handleLast.bind(this)}];
        return fr.nel("nav",
                      {class: ["lower"]},
                      this.#first,
                      this.#backward,
                      this.#forward,
                      this.#last
                     );
    }
    /**
     * Emit page change.
     * @private
     * @fires Pagination#fr:page-change
     */
    #emitChange() {
        fr.emit("fr:page-change",
                {
                    current: this.current,
                    disp: this.disp,
                    start: this.start,
                },
                this.node.element);
    }
    /**
     * @event Pagination#fr:page-change
     * @type { Object }
     * @property { Integer } current - Number of current page.
     * @property { Integer } disp - Number of display per page. (limit)
     * @property { Integer } start - Currently displayed start position. (offset)
     */
    /**
     * Update current page.
     * @private
     */
    #updateCurrentPage() {
        this.#start.value = this.#current.value * this.#disp.value + 1;
        const e = (this.#start.value - 1) + this.#disp.value;
        this.#end.value = (e < this.#items.value) ? e : this.#items.value;
    }
    /**
     * Update max page.
     * @private
     *
     * @description When changed number of items or number of display per page.
     */
    #updateMaxPage() {
        this.#pmax = Math.ceil(this.#items.value / this.#disp.value);
    }
    /**
     * Handle > icon clicked.
     *
     * Effect forward next page.
     */
    handleForward() {
        let x = this.current + 1;
        if (x >= this.#pmax) return; // no work
        this.current = x;
    }
    /**
     * Handle < icon clicked.
     *
     * Effect backward previous page
     */
    handleBackward() {
        let x = this.current - 1;
        if (x < 0) return; // no work
        this.current = x;
    }
    /**
     * Handle >| icon clicked.
     *
     * Effect goto last page.
     */
    handleLast() {
        const m = this.#pmax - 1;
        if (this.current >= m) return;
        this.current = m;
    }
    /**
     * Handle |< icon clicked.
     *
     * Effect goto top page.
     */
    handleFirst() {
        if (this.current <= 0) return;
        this.current = 0;
    }

}


export {
    Pagination,
};
/* //<-- pagination.js ends here*/
