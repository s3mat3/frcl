/**
 * @file nel.test.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import { test, expect, describe, beforeAll } from "vitest";
import { JSDOM } from "jsdom";

import { element, nel, Nel, NType } from "../core/fr";


describe("Node element test", () => {
    let browser = null;
    let window;
    let document;
    let holder;
    let marker = "not mount";
    const content_simple = "Hello world";
    const top_element = element`<div id="app"></div>`;
    beforeAll(() => {
        browser = new JSDOM();
        window = browser.window;
        document = window.document;
        document.body.replaceChildren(top_element);
        holder = document.querySelector("#app");
    });

    test("class Nel test mountable/unmountable", () => {
        const e = new Nel(NType.tagname,"p", {id:"p_01"}, content_simple);
        e.mount(holder);
        let t = document.querySelector("#p_01");
        expect((t)).toBeTruthy();
        expect(t).toBeInstanceOf(HTMLParagraphElement);
        expect(t.textContent).toEqual(content_simple);
        e.unmount();
        t = document.querySelector("#p_01");
        expect((t)).toBeFalsy();
    });

    test("class Nel test with children", () => {
        const e1 = element`<p id="01">${content_simple}1</p>`;
        const e2 = element`<p id="02">${content_simple}2</p>`;
        const e3 = element`<p id="03">${content_simple}3</p>`;
        const e = nel("div",{id:"div_01"}, e1, e2, e3);
        e.mount(holder);
        let t = document.querySelector("#div_01");
        expect((t)).toBeTruthy();
        expect(t.textContent).toEqual("Hello world1Hello world2Hello world3");
        let pl = document.querySelectorAll("p");
        let c = 1;
        pl.forEach((p) => {
            expect(p.textContent).toEqual(`Hello world${String(c++)}`);
        });
        e.unmount();
    });

    const bm = () => { marker = "beforeMount" };
    const bu = () => { marker = "beforeUnmount" };
    const m = () => { marker = "mounted" };
    const u = () => { marker = "unmounted" };

    test("class Nel test invokable beforMount/mounted", () => {
        const e = new Nel(NType.tagname,"p", {id:"p_01"}, content_simple);
        expect(marker).toEqual("not mount");
        e.beforeMount.push(bm);
        e.beforeUnmount.push(bu);
        e.mount(holder);
        expect(marker).toEqual("beforeMount");
        e.unmount();
        expect(marker).toEqual("beforeUnmount");
        e.mounted = [m];
        e.unmounted = [u];
        e.mount(holder);
        expect(marker).toEqual("mounted");
        e.unmount();
        expect(marker).toEqual("unmounted");
    });
});
/* //<-- nel.test.js ends here*/
