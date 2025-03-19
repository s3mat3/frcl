/**
 * @file element-tag.test.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';
import { test, expect, describe, beforeAll } from "vitest";
import { JSDOM } from "jsdom";

import {options, Tag, TagLiteral, element, attach, updateAttributes } from "../core/element";

describe("element tag test", () => {
    let browser = null;
    let window;
    let document;
    let holder;
    const content_simple = "Hello world";
    const top_element = element`<div id="app"></div>`;
    beforeAll(() => {
        browser = new JSDOM();
        window = browser.window;
        document = window.document;
        attach(document.body, top_element);
        holder = document.querySelector("#app");
    });
    //
    test("class Tag test simple", () => {
        const e = new Tag("p", options({}, {id:"p_01"}, {}), content_simple);
        attach(holder, e.element);
        let t = document.querySelector("#p_01");
        expect((t)).toBeTruthy();
        expect(t).toBeInstanceOf(HTMLParagraphElement);
        expect(t.textContent).toEqual(content_simple);
    });
    //
    test("class Tag test with children", () => {
        const e1 = element`<p id="01">${content_simple}1</p>`;
        const e2 = element`<p id="02">${content_simple}2</p>`;
        const e3 = element`<p id="03">${content_simple}3</p>`;
        const e = new Tag("div", options({}, {id:"div_01"}, {}), content_simple, e1, e2, e3);
        attach(holder, e.element);
        let t = document.querySelector("#div_01");
        expect((t)).toBeTruthy();
        expect(t.textContent).toEqual(content_simple+"Hello world1Hello world2Hello world3");
        let pl = document.querySelectorAll("p");
        let c = 1;
        pl.forEach((p) => {
            expect(p.textContent).toEqual(content_simple + String(c));
            c++;
        });
    });
    //
    test("TagLiteral extends test", () => {
        class Pra extends TagLiteral {
            constructor(o) {
                super(o);
                this.build();
            }
            build() {
                this._element = element`<p>${content_simple}</p>`;
                if (this._attrs) updateAttributes(this._element, this._attrs);
                return this._element;
            }
        }
        const e = new Pra(options({}, {id:"p_01"}, {}));
        attach(holder, e.element);
        let t = document.querySelector("#p_01");
        expect((t)).toBeTruthy();
        expect(t).toBeInstanceOf(HTMLParagraphElement);
        expect(t.textContent).toEqual(content_simple);
    });
})

/* //<-- element-tag.test.js ends here*/
