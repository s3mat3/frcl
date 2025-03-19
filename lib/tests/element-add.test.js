/**
 * @file element-add.test.js
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

import { attach, detach, insert, add, element } from "../core/element";

describe("element manipulate test add/insert/attach/detach", () => {
    let browser = null;
    let window;
    let document;
    const content_simple = "Hello world";
    const top_element = element`<div id="app"></div>`;
    const sec_element = element`<p id="p_01">${content_simple}</p>`
    beforeAll(() => {
        browser = new JSDOM();
        window = browser.window;
        document = window.document;
    });
    //
    test("attac/detach test", () => {
        const d = attach(document.body, top_element);
        let e = document.querySelector("#app");
        expect((e)).toBeTruthy();
        expect(e).toBeInstanceOf(HTMLDivElement);
        e = attach(e, sec_element);
        let p = document.querySelector("#p_01");
        expect((p)).toBeTruthy();
        expect(p).toBeInstanceOf(HTMLParagraphElement);
        expect(p.textContent).toEqual(content_simple);
        // detach
        detach(sec_element);
        p = document.querySelector("#p_01");
        expect((p)).toBeFalsy();
        detach(top_element);
        e = document.querySelector("#app");
        expect((e)).toBeFalsy();
    });
    //
    test("insert forward oder test", () => {
        const e1 = element`<p id="01">${content_simple}1</p>`;
        const e2 = element`<p id="02">${content_simple}2</p>`;
        const e3 = element`<p id="03">${content_simple}3</p>`;
        const a = attach(document.body, top_element);
        insert(a, e1, true);
        insert(a, e2, true);
        insert(a, e3, true);
        let pl = document.querySelectorAll("p");
        let c = 1;
        pl.forEach((p) => {
            expect(p.textContent).toEqual(content_simple + String(c));
            c++;
        });
    });
    //
    test("insert reverse oder test", () => {
        const e1 = element`<p id="01">${content_simple}1</p>`;
        const e2 = element`<p id="02">${content_simple}2</p>`;
        const e3 = element`<p id="03">${content_simple}3</p>`;
        const a = attach(document.body, top_element);
        insert(a, e3, false);
        insert(a, e2, false);
        insert(a, e1, false);
        let pl = document.querySelectorAll("p");
        let c = 1;
        pl.forEach((p) => {
            expect(p.textContent).toEqual(content_simple + String(c));
            c++;
        });
    });

    //
    test("add test", () => {
        const e1 = element`<p id="01">${content_simple}1</p>`;
        const e2 = element`<p id="02">${content_simple}2</p>`;
        const e3 = element`<p id="03">${content_simple}3</p>`;
        const a = attach(document.body, top_element);
        add(a, e1, e2, e3);
        let pl = document.querySelectorAll("p");
        let c = 1;
        pl.forEach((p) => {
            expect(p.textContent).toEqual(content_simple + String(c));
            c++;
        });
    });
});
/* //<-- element-add.test.js ends here*/
