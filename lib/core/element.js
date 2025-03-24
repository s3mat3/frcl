/**
 * @file element.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief Utilty for element operation
 *
 * @author s3mat3
 */
'use strict';
import { isMatchType } from "./misc";
/**
 * Escape HTML reserved special characters
 * in case 5 characters " ' & < >
 * Should use the entity name or entity number when you want to output any of these reserved characters.
 *  @see https://www.html.am/reference/html-special-characters.cfm
 *
 *  @param {String} target is string for output web browser
 */
function escapeHtmlSpecialChars(target) {
    return target.replace(/[\'\"&<>]/g, (match) => {
        const escapes = {
            '\'': '&#x27;',
            '\"': '&quot;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
        };
        return escapes[match];
  });
}
/**
 * Object type cheker.
 * @param { HTMLElement } obj
 * @returns { Boolean } true HTMLElement
 * @returns { Boolean } false Not HTMLElement
 */
function isElement(obj) {
    return (obj && typeof obj === 'object') ? (obj.nodeType === 1) : false;
}

/**
 * Build element from HTML markup string
 *  @param { String } h is html markup string
 *  @returns { HTMLElement }
 */
function buildElement(h) {
    const e = document.createElement('template');
    e.insertAdjacentHTML('afterbegin', h);
    return e.firstElementChild;
}
/**
 * Build html element from template literal. (Using taged template literal)
 *
 * This idea was referenced in the "Escape HTML Strings" section of'https://jsprimer.net/use-case/ajaxapp/display/'.
 *  @caution All placeholder variables included html special chars are escaped
 *  @usage element`<html-tag>${some_variable} | another-some-tags</html-tag>`;
 *  @param { String } s is string as tags
 *  @param { Array<String> } vs is string array from ${some_variable}
 *  @returns { HTMLElement }
 */
function element(s, ...vs) {
    const html = s.reduce((acc, current, index) => {
        const v = vs[index - 1];
        return (typeof v === 'string') ? acc + escapeHtmlSpecialChars(v) + current
            : acc + String(v) + current;
    });
    return buildElement(html);
} /* //<-- function element ends here */
/**
 * Attach element to container
 *  @param { HTMLElement } p is parent to attached
 *  @param { HTMLElement } e is element is attach target
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function attach(p, e) {
    if (p && isElement(p) && (e && isElement(e))) {
        p.replaceChildren(e);
        return p;
    }
    return null;
} /* //<-- function attach ends here */
/**
 * Detatch element from dom
 *  @param { HTMLElement } e is target element on removing
 */
function detach(e) {
    if (e && isElement(e)) {
        e.remove();
    }
} /* //<-- function detach ends here */

/**
 * Insert element to container
 *  @param { HTMLElement } p is container named parent as insert target
 *  @param { HTMLElement } e is element content(s) of inserted to container
 *  @param { Boolean } f is mode flag. when true, insert from back, else inser from front
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function insert(p, e, f = true) {
    const m = (f) ? "beforeend" : "afterbegin";
    if (p && isElement(p)) {
        (e && isElement(e))
            ? p.insertAdjacentElement(m, e)
            : (typeof e == "string") ? p.insertAdjacentHTML(m, e) : $fr_nop();
        return p;
    }
    return null;
} /* //<-- function insert ends here */
/**
 * Insert element to container
 *  @param { HTMLElement } p is container named parent as insert target
 *  @param { HTMLElement | STring } cr is child(ren) of inserted to container
 *  @returns { HTMLElement } attached
 *  @returns { null } no container attached
 */
function add(p, ...cr) {
    cr.flat(Infinity).forEach((c) => {
        insert(p, c, true);
    });
    return p;
}
/**
 * Convert class array to class string for attributes
 *  @param { Array<String> } a is array of class names
 *  @returns { String }  class names string
 *  e.g. class: toClass(["bomb", "button", "is-danger", "heart-attack"]) => class: "bomb button is-danger heart-attack"
 */
function toClass(a) {
    return a.flat(Infinity).reduce((a, c) => {return `${a} ${c}`;});
}
/**
 * Convert style object TO style string for tag attributes
 *  @param { Object } s is style object
 *  @returns { String } converted style field string
 *  e.g. style: toStyle({boder: "1px", color: "red", background: "black"}) => style: "boder: 1px;color: red;background: black;"
 */
function toStyle(s) {
    return Object.entries(s).map(([k, v]) => `${k}: ${v};`).join("");
}
/**
 * Remove and add event listener
 *  @param { HTMLElement } s is event souce (context)
 *  @param { String } e is event name
 *  @param { Function } l is function of event listener
 */
function setEvent(s, e, l) {
    s.removeEventListener(e, l);
    s.addEventListener(e, l);
}
/**
 * Update tag attributes
 *  @param { HTMLElement } e is target element
 *  @param { Object } a is atrributes object
 */
function updateAttributes(e, a) {
    if (e && isElement(e) && isMatchType(['Map', 'Object'], a)) {
        for (const [k, v] of Object.entries(a)) {
            if (k.startsWith("on")) {
                let ev = k.slice(2);
                let fn = (typeof v === "function") ? v : (typeof v === "string") ? new Function(v) : $fr_void; 
                setEvent(e, ev, fn);
                e.setAttribute(k, fn);
                continue;
            }
            let d = (k === "style" && typeof v === "object") ? toStyle(v) :
                (k === "class" && Array.isArray(v)) ? toClass(v) : v;
            e.setAttribute(k, d);
        }
    }
} /* //<-- function updateAttributes ends here */
/**
 * Interface for tag class
 */
class TagBase {
    build() {}
}
/**
 *  @param { String } name is tag name
 *  @param { Object } attrs is attributes of this tag element
 *  @param { HTMLElement } children is this tag elements content(s)
 *  @returns { HTMLElement }  created element (node)
 */
function tag(name, attrs = {}, ...children) {
    const el = document.createElement(name);
    updateAttributes(el, attrs);
    children.flat(Infinity).forEach((child) => {
        let c = (child instanceof TagBase) ? child.build() : child;
        insert(el, c);
    });
    return el;
}
/**
 * class Tag
 */
class Tag extends TagBase {
    #tid = "";
    _props = {
        name: "",
    };
    _children = [];
    _element = undefined;
    get props() {return this._props;}
    get id() {return this.#tid;}
    get element() {return this._element;}

    constructor(n, o = {}, ...c) {
        super();
        this.#tid = window.$fr_cid ?? "1000"; // tag id
        this._props = {
            name: n,
            ...o
        };
        // this._attrs = { ...o?.attrs };
        this._children = [ ...c ];
        this.build();
    }
    build() {
        return this._element = tag(this._props.name, this._props.attrs, ...this._children)
    }
} /* //<-- class Fragment ends here */
/**
 * Fragment extended abstract class for Template Literal
 *  @caution Thihs class abstract Must be derive
 */
class TagLiteral extends Tag {
    constructor(options = {}, ...c) {
        super("tl", options, ...c);
        this.build();
    }
    /**
     * Build this element abstract...(Must be implement in derived)
     */
    build() {
        this._element = element`<template><p>Necessary implements at derived class</p></template>`;
        if (this._children.length) add(this._element, this._children); // if need in derived
        if (this._props.attrs) updateAttributes(this._element, this._props.attrs);
        return this._element;
    }
} /* //<-- class TagLiteral ends here */

/**
 * options packer for Fragment constructor option
 *  @param { Object } p is properties for Fragment object
 *  @param { Object } a is attribute(s) for Fragment top tag
 *  @param { Object } s is style for Fragment top tag
 */
function options(p = {}, a = {}, s = {}) {
    return {
        attrs: {
            style: { ...s },
            ...a
        },
        ...p
    }
}

export{
    escapeHtmlSpecialChars,
    isElement,
    buildElement,
    element,
    attach,
    detach,
    insert,
    add,
    updateAttributes,
    toClass,
    toStyle,
    setEvent,
    tag,
    Tag,
    TagLiteral,
    options,
}

/* //<-- element.js ends here*/
