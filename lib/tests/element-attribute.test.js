/**
 * @file element-attribute.test.js
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

import {updateAttributes, toStyle, element, attach } from "../core/element";

describe("attribute manipulate", () => {
    let browser = null;
    let window;
    let document;
    const content_simple = "Hello world";
    const top_element = element`<div id="app"></div>`;
    const sec_element = element`<p id="p_01" class="hoge">${content_simple}</p>`
    beforeAll(() => {
        browser = new JSDOM();
        window = browser.window;
        document = window.document;
    });
    //
    test("update attribute", () => {
        const d = attach(document.body, top_element);
        let p = attach(d, sec_element);
        p = document.querySelector(".hoge");
        expect((p)).toBeTruthy();
        p = document.querySelector("#p_01");
        const a = {class: "fuga"};
        updateAttributes(p, a);
        p = document.querySelector(".hoge");
        expect((p)).toBeFalsy();
        p = document.querySelector(".fuga");
        expect((p)).toBeTruthy();
        a["class"] = "hero";
        a["data-id"] = "kerokero";
        a["id"] = "P_05";
        updateAttributes(p, a);
        p = document.querySelector(".fuga");
        expect((p)).toBeFalsy();
        p = document.querySelector(".hero");
        expect((p)).toBeTruthy();
        p = document.querySelector("#p_01");
        expect((p)).toBeFalsy();
        p = document.querySelector("#P_05");
        expect((p)).toBeTruthy();
        p = document.querySelector("[data-id='kerokero']");
        expect((p)).toBeTruthy();
    });
    test("toStyle test", () =>{
        const s = {boder: "1px", color: "red", background: "black"};
        const ss = toStyle(s);
        expect(ss).toEqual("boder: 1px;color: red;background: black;");
    });
})
/* //<-- element-attribute.test.js ends here*/
