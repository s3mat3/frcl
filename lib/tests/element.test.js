/**
 * @file element.test.js
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

import {isElement, escapeHtmlSpecialChars, element, buildElement} from "../core/element";

describe('util test in with', () => {
    let browser = null;
    let window;
    let document;
    const content_simple = "Hello world";
    const content_escape = "&<>";
    beforeAll(() => {
        browser = new JSDOM();
        window = browser.window;
        document = window.document;
    });

    test('isElement', () => {
        const t1 = document.createElement('div');
        const t2 = document.createElement('template');
        const o = {};
        const a = [];
        const s = 'div';
        expect(isElement(t1)).toBeTruthy();
        expect(isElement(t2)).toBeTruthy();
        expect(isElement(element`<div></div>`)).toBeTruthy();
        expect(isElement(o)).toBeFalsy();
        expect(isElement(a)).toBeFalsy();
        expect(isElement(s)).toBeFalsy();
    });

    test('build element simple', () => {
        const elm = element`<div>${content_simple}</div>`;
        expect(elm.innerHTML).toBe("Hello world");
    });

    test('build element escaped', () => {
        const elm = element`<div>${content_escape}</div>`;
        expect(elm.innerHTML).toBe('&amp;&lt;&gt;');
    });

    test('build element', () => {
        // let parent = browser.window.document.createElement('div');
        let elm = buildElement(`<p>${content_simple}</p>`);
        expect(isElement(elm)).toBeTruthy();
        expect(elm.innerHTML).toBe('Hello world');
        elm = buildElement(`<p>${content_simple}</p>`);
        expect(isElement(elm)).toBeTruthy();
        expect(elm.innerHTML).toBe('Hello world');
    });
});

describe('escapeHtmlSpecialChars', () => {
    test('simple string', () => {
        const mesg = 'Hello world';
        expect(escapeHtmlSpecialChars(mesg)).toBe('Hello world');
    });
    test('escape quote', () => {
        const mesg = '"Hello world"';
        const escaped = escapeHtmlSpecialChars(mesg);
        expect(escaped).toContain('&quot;');
        expect(escaped).toBe('&quot;Hello world&quot;');
    })
    test('escape single quote', () => {
        const mesg = "'Hello world'";
        const escaped = escapeHtmlSpecialChars(mesg);
        expect(escaped).toContain('&#x27;');
        expect(escaped).toBe('&#x27;Hello world&#x27;');
    })
    test('escape &', () => {
        const mesg = "Hello & world";
        const escaped = escapeHtmlSpecialChars(mesg);
        expect(escaped).toContain('&amp;');
        expect(escaped).toBe('Hello &amp; world');
    })
    test('escape <>', () => {
        const mesg = '<Hello world>';
        const escaped = escapeHtmlSpecialChars(mesg);
        expect(escaped).toContain('&lt;');
        expect(escaped).toContain('&gt;');
        expect(escaped).toBe('&lt;Hello world&gt;');
    })
});


/* //<-- element.test.js ends here*/
