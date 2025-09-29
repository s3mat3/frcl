// @ts-check
/*!
 * frcl is Fake Reactivity Component oriented Libray
 * Copyright (c) 2025 s3mat3
 * Licensed under the MIT License, see the LICENSE file for details
 */
/**
 * @file frcl is Fake Reactivity Component oriented Libray
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @author s3mat3
 */
"use strict";

import {extractTypeName, isMatchType, isEmptyObj, isElement,} from "./misc";

class SerialID {
    #value = {};
    constructor(i = 1000) {
        this.#value = new Proxy({ count: i }, {
            set(t, k, v, r) {
                Reflect.set(t, k, v, r); // dummy
                return false; // readonly
            },
            get(t, k) {
                return String(t[k]++);
            }
        });
    }
    get value() { return this.#value.count; }
}
const _FR_CID = new SerialID(1000);
////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////
/**
 * window.$fr_cid (read only)
 * This global is readed per increment number as string
 */
Object.defineProperty(globalThis, "$fr_cid", {
    get() {
        return _FR_CID.value;
    },
    // no setter
});

globalThis.$nop = () => {};
globalThis.$d = window.document;
/**
 *  @param { String } s - Selector name.
 *  @returns { Element | Null }
 */
globalThis.$$ = (s) => document.querySelector(s);
/**
 *  @param { String } ss - Selector name.
 *  @returns { NodeList | Null }
 */
globalThis.$a = (ss) => document.querySelectorAll(ss);
/**
 * Toast notification (popup)
 *  @param { String } [m = "hello world"] - Message displayed on the toast.
 *  @param { String } [c = "is-info"] - Class selector name that determines the background color.
 *  @param { Number } [t = 3] - Display time (in seconds).
 */
globalThis.$toast = (m = "hello world", c = "is-info", t = 3) => {
    t = (t < 2) ? 2 : t;
    const to = t * 1000;
    const pan = document.createElement("div");
    pan.textContent = m;
    pan.className = `toast ${c}`;
    document.body.appendChild(pan);
    pan.style.opacity = "1";
    setTimeout(() => {
        pan.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(pan);
        }, 1000);
    }, to);
}
/// library globals
/// global scope functions
/**
 * Escape HTML reserved special characters
 * in case 5 characters " ' & < >
 * Should use the entity name or entity number when you want to output any of these reserved characters.
 *  @see https://www.html.am/reference/html-special-characters.cfm
 *
 *  @param { String } [target] - String for output web browser.
 */
function escapeHtmlSpecialChars(target = "") {
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
 * Build element from HTML markup string
 *  @param { String } [h] - HTML markup string.
 *  @returns { Element }
 */
function buildElement(h = "<div></div>") {
    const e = document.createElement('template');
    e.insertAdjacentHTML('afterbegin', h);
    return e.firstElementChild ?? e;
}

/**
 * @template T
 * @typedef {(string | ((props: T) => string))[]} Interpolation
 */

/**
 * Build html element from template literal. (Using taged template literal)
 *
 * This idea was referenced in the "Escape HTML Strings" section of'https://jsprimer.net/use-case/ajaxapp/display/'.
 *  @caution All placeholder variables included html special chars are escaped
 *  @usage element`<html-tag>${some_variable} | another-some-tags</html-tag>`;
 *
 *  @template T
 *  @param { Array<String> } s - String as tags.
 *  @param { ...(function(T): String) } vs - Rest param(s) from ${some_variable}.
 *  @returns { Element }
 */
function element(s = [], ...vs) {
    const html = s.reduce((acc, current, index) => {
            const v = vs[index - 1];
            return (typeof v === 'string') ? acc + escapeHtmlSpecialChars(v) + current
                : acc + String(v) + current;
    });
    return buildElement(html);
} /* //<-- function element ends here */
/**
 * Emit custom event with context
 *  @param { String } [n] - Name as event trigger.
 *  @param { any } [d] - Detail of event (event data).
 *  @param { EventTarget } [c = document] - Event source element named context.
 */
function emit(n, d, c = document) {
    if (! n) return;
    let options = {
        cancelable: true,
        buble: true,
        detail: d,
    }
    return c.dispatchEvent(new CustomEvent(n, options));
}
/**
 * Remove and add event listener
 *  @param { HTMLElement } s - event souce (context)
 *  @param { keyof HTMLElementEventMap } e - event name
 *  @param { (this: HTMLElement,ev: Event) => any } l - function of event listener
 */
function setEvent(s, e, l) {
    s.removeEventListener(e, l);
    s.addEventListener(e, l);
}
/**
 * @typedef { Object } EventHandlerPair
 * @property { keyof HTMLElementEventMap } [en] - Event name
 * @property { (this: HTMLElement,ev: Event) => any } [eh] - Event handler entry point
 */
/**
 * @typedef { Array<EventHandlerPair> } EventHandlers
 */
/**
 * Create EventHandlerPair and  push to EventHandlers.
 *  @param { EventHandlers } [hs] - handler pair list.
 *  @param { keyof HTMLElementEventMap } [en] - Event name.
 *  @param { (this: HTMLElement,ev: Event) => any } [eh] - Event handler.
 */
function pushEventHandlers(hs = [], en, eh) {
    hs.push({en, eh});
}
/**
 * Add to EventListener by EventHandlers
 *  @param { Element } [ctx] - Event source context.
 *  @param { EventHandlers } [ehs] - add list.
 */
function addEvents(ctx, ehs) {
    if (!ctx || !ehs || !Array.isArray(ehs) || ehs.length === 0) return;
    for (const p of ehs) {
        if (typeof p.en !== "string" || typeof p.eh !== "function") continue;
        ctx.addEventListener(p.en, p.eh);
    }
}
/**
 * Remove form EventListener by EventHandlers
 *  @param { Element } [ctx] - Event source context.
 *  @param { EventHandlers } [ehs] - remove list
 */
function removeEvents(ctx, ehs) {
    if (!ctx || !ehs || !Array.isArray(ehs) || ehs.length === 0) return;
    for (const p of ehs) {
        if (typeof p.en !== "string" || typeof p.eh !== "function") continue;
        ctx.removeEventListener(p.en, p.eh);
    }
}
/**
 * @typedef { Object } CurrentRegistering
 * @property { Object } [ctx] - Context (Nel)
 * @property { Function } [cb] - Call back for reaction
 */
/** @type { CurrentRegistering } @private in this file only */
let _current_registering = {};
////////////////////////////////////////////////////////////////////
/**
 * @interface NodeElement
 */
class NodeElement {
    /** Build node element
     *  @param { Element } _p - Parent node
     *  @returns { Element | null }
     */
    build(_p) {return null;}
    /** Mount to parent node
     *  @param { Element } _p - Parent node
     *  @returns { NodeElement }
     */
    mount(_p) {return this;}
    unmount() {}
    update() {}
}
/**
 *
 */
class Reference {
    /** @type { any}  */
    #val = undefined;
    /** @type { any}  */
    #old = undefined;
    /** @type { Boolean }*/
    _reactive = true;
    /** @type { Map }*/
    _listeners;
    /**
     *  @param { any } [iv] - initial value. not a initial vector \(^_^)/
     */
    constructor(iv) {
        this.#val = this.#old = iv;
        this._listeners = new Map();
    }
    /** setter */
    set value(v) {
        if (this.#val !== v) {
            this.#old = this.#val; this.#val = v;
            this.#invoke_reaction();
        }
    }
    /** getter */
    get value() {
        if (! isEmptyObj(_current_registering)) {
            // console.log("register", _current_registering);
            this._listeners.set(_current_registering.ctx, _current_registering.cb);
        }
        return this.#val;
    }
    get _val() {return this.#val;}
    get _old() {return this.#old;}

    #invoke_reaction() {
        this._listeners.forEach((k, v) => {
            k.call(v);
            //this._listeners.delete(v);
        });
    }
}
/**
 * RefKey
 */
class RefKey {
    r;
    k;
    /**
     *  @param { Reference } [t] - Tracking object.
     *  @param { String } [k] - Key
     */
    constructor(t, k) {
        this.r = t;
        this.k = k;
    }
}

/**
 * @private
 *  @param { RefKey } [r] - Tracking target.
 *  @param { NodeElement } [n] - Implements NodeElement object.
 *  @returns { any } - Reference.value | undefined
 */
const _should_registering = (r, n) => {
    let v = undefined;
    if (!r || !n) return;
    // console.log(r);
    _current_registering = {ctx: n, cb: n.update};
    if (r.r && r.r.value) {
        v = (r.k) ? r.r.value[r.k] : r.r.value;
    }
    _current_registering = {};
    return v;
}
/**
 *  @param { Reference } [t] - Tracking object.
 *  @param { String } [k] - Key
 *  @returns { RefKey }  Packed object
 *  @example
 *  const x = new Refarence({name: "hoge", age: 18});
 *  options.name = useRef(x, "name");
 *  options.age  = useRef(x, "age");
 *  x = {name: "fuga", age: "98"};
 */
const useRef = (t, k = "") => {
    return new RefKey(t, k);
}
/** for Nel class type property
 * @enum { Number }
 * @property { Number } tagname Nel class name property - string as tagname
 * @property { Number } element Nel class name property - HTMLElement
 * @property { Number } tempLiteral Nel class name property - string as html template literal
 * Other property - not implement now. @see Nel class build method
 */
const NType = Object.freeze({
    tagname     : 0,
    element     : 1,
    attribute   : 2,
    text        : 3,
    cdata       : 4,
    comment     : 8,
    tempLiteral : 1000,
});
/**
 * @typedef { Array<Function> } FunctionList
 */
/** internal use only
 *  @param { FunctionList } [fl]
 */
const _invoke = (fl) => {
    if (!fl || !Array.isArray(fl) || fl.length === 0) return;
    fl.forEach((f) => {
        if (typeof f !== "function") $nop();
        f();
    });
}
/**
 * @abstract NodeParts
 */
class NodeParts {
    /** @type { FunctionList } beforeMount */
    beforeMount = [];
    /** @type { FunctionList } mounted */
    mounted = [];
    /** @type { FunctionList } beforeUnmount */
    beforeUnmount = [];
    /** @type { FunctionList } unmounted */
    unmounted = [];
    /** @type { NodeElement } */
    _node;
    get node() {return this._node;}
    /**
     *  @param { Element } p - Parent element node.
     */
    mount(p) {
        _invoke(this.beforeMount);
        this._node.mount(p);
        _invoke(this.mounted);
        return this._node;
    }
    unmount() {
        _invoke(this.beforeUnmount);
        this._node.unmount();
        _invoke(this.unmounted);
        return this._node;
    }
}
/**
 * @typedef { Object } Attrs
 * @property { String } [id] - Tag attribute of id.
 * @property { Object | String } [style] - Tag attribute of style.
 * @property { Array<String> | String } [class] - Tag attribute of class.
 */
/**
 * Node ELement class named Nel
 *  @class
 *  @implements { NodeElement }
 */
class Nel extends NodeElement{
    /** This node ID (number string).
     * @type { String }
     */
    #nid = "";
    /** @protected
     * This node cache
     * @type { Element }
     */
    _elm;
    /** @public
     * Node type.
     * @type { NType }
     */
    ntype = NType.tagname;
    /** @public
     * Tag name.
     * @type { String | Element }
     */
    name = ""
    /** @public @type { Attrs } */
    attrs = { id: "" };
    /** @public @type { Array <Nel | Element | String | RefKey> } */
    children = [];
    /** @public @type { Element | null } */
    p = null;
    /** @public @type { FunctionList } functions object for befor create */
    beforeCreate = [];
    /** @public @type { FunctionList } functions object for created */
    created = [];
    /** @public @type { FunctionList } functions object for befor mount */
    beforeMount = [];
    /** @public @type { FunctionList } functions object for mounted */
    mounted = [];
    /** @public @type { FunctionList } functions object for befor unmount */
    beforeUnmount = [];
    /** @public @type { FunctionList } functions object for unmounted */
    unmounted = [];
    /** @public @type { EventHandlers } [handlers = []] - EventHandlerPair list */
    handlers = [];
    /**
     * @constructor
     *  @param { NType } [t = NType.tagname] - This node type.
     *  @param { String } [n = "div"] - Name of tag.
     *  @param { Attrs } [a = {}] - Attribute of this node.
     *  @param { ...Nel | Element | String | RefKey } cr - Children of this node.
     */
    constructor(t = NType.tagname, n = "div", a = {}, ...cr) {
        super();
        this.#nid = $fr_cid ?? "1000";
        this.ntype = t;
        this.name = n;
        this.attrs = { ...a };
        this.children = [ ...cr ];
        this.build();
    }
    /**
     *  @returns { String }  This node ID (auto numbered)
     */
    get nid() {return this.#nid;}
    /**
     *  @param { String } [name] - prefix this node top level tag's id attribute
     */
    set id(name) {
        this.attrs.id = `${name}_${this.#nid}`;
        (this._elm) ? this._elm.setAttribute("id", this.attrs.id) : $nop();
    }
    /**
     *  @returns { String | undefined }
     */
    get id() {return this.attrs.id;}
    /**
     * element getter
     *  @returns {Element | undefined }
     */
    get element() { return this._elm; }
    /**
     * parent getter
     *  @returns { Element | null } p - This node parent (mount target).
     */
    get parent() { return this.p; }
    set parent(p) { this.p = p; }
    /**
     * Build this node element
     *  @param { Element | null } [p = undefined] - Parent for this node mount.
     *  @returns { Element | null }
     */
    build(p = null) {
        this.p = (p) ? p : this.p;
        removeEvents(this._elm, this.handlers);
        _invoke(this.beforeCreate);
        if (this.ntype === NType.tagname && typeof this.name === "string") {
            this._elm = document.createElement(this.name);
        } else if (this.ntype == NType.element) {
            this._elm = (this.name instanceof Element) ? this.name : document.createElement("template");
        } else {
            this._elm = document.createElement("template");
        }
        /// set attribute(s)
        this.updateAttributes();
        /// append children
        this.#append();
        _invoke(this.created);
        addEvents(this._elm, this.handlers);
        return this._elm;
    } /* //<-- method build ends here */
    /**
     * Mount to my parent
     *  @param { Element | null } [p = undefined] - My parent.
     *  @returns { NodeElement }  
     */
    mount(p = null) {
        this.p = (p) ? p : $$("body");
        _invoke(this.beforeMount);
        const prev = this._elm;
        const now  = this.build(p);
        if (now) {
            (prev && this.p?.contains(prev) && prev.parentNode)
                ? this.p.replaceChild(now, prev)
                : this.p?.insertAdjacentElement("beforeend", now);
        }
        _invoke(this.mounted);
        return this;
    }
    /**
     * Unmount this node from my parent
     * Onry remove from DOM, no free
     */
    unmount() {
        if (! this._elm) return this;
        // if (! this.p?.hasChildNodes(this._elm)) return this;
        if (! this.p?.contains(this._elm)) return this;
        removeEvents(this._elm, this.handlers);
        _invoke(this.beforeUnmount);
        this.p.removeChild(this._elm)
        _invoke(this.unmounted);
        return this;
    }
    /**
     * Update dom (remount)
     */
    update() {
        return this.mount(this.p);
    }
    /**
     * Update child with position
     *  @param { Number } [p] - position number
     *  @param { Nel | Element | String | RefKey } [c] - child element
     */
    updateChild(p = 0, c) {
        if (! this.children.length || ! c) return;
        this.children[p] = c;
    }
    /**
     * Update my attribute(s)
     */
    updateAttributes() {
        let e = this._elm;
        for (const [k, v] of Object.entries(this.attrs)) {
            if (k.startsWith("on")) {
                if (! v) continue;
                let ev = k.slice(2);
                let fn = (typeof v === "function") ? v : (typeof v === "string") ? new Function(v) : $nop;
                e.removeEventListener(ev, fn);
                e.addEventListener(ev, fn);
                e.setAttribute(k, v);
                continue;
            }
            if (k === "style") {
                const d = (typeof v === "object") ? this.#toStyle(v) : v
                // if (! d) continue;
                e.setAttribute(k, d);
            } else if (k === "class") {
                const d = (Array.isArray(v) && v.length) ? this.#toClass(v) : v
                if (! d || !(typeof d === "string")) continue;
                e.setAttribute(k, d);
            } else {
                if (! v) continue;
                if (v && typeof v === "object") {
                    if (v?.r instanceof Reference) {
                        let nv = _should_registering(v, this);
                        e.setAttribute(k, nv);
                        continue;
                    }
                }
                e.setAttribute(k, v);
            }
        }
    } /* //<-- method updateAttributes ends here */
    /**
     * Append children my node from child list
     */
    #append() {
        const cd = this.children.flat(Infinity);
        for (const c of cd) {
            if (! c) continue;
            if (typeof c === "object") {
                if (c instanceof Nel) {
                    let e = c.build(this._elm);
                    if (! e) continue;
                    this._elm.insertAdjacentElement("beforeend", e);
                } else if (c instanceof NodeParts) {
                    let e = c.node.build(this._elm);
                    if (! e) continue;
                    this._elm.insertAdjacentElement("beforeend", e);
                } else if (c instanceof RefKey) {
                    let nc = _should_registering(c, this);
                    this._elm.insertAdjacentText("beforeend", nc);
                }  else if (c instanceof HTMLElement) {
                    this._elm.insertAdjacentElement("beforeend", c);
                }
            } else if (typeof c === "string") {
                this._elm.insertAdjacentText("beforeend", c);
            } else {
                console.error("what child element?", c);
                continue;
            }
        }
        return this._elm;
    }
    /**
     * convert object to string for style attribute
     *  @param { Object } o - Style attribute object.
     *  @returns { String }
     */
    #toStyle(o) {
        return Object.entries(o).map(([k, v]) => {
            if (v?.r instanceof Reference) {
                v = _should_registering(v, this);
            }
            return `${k}: ${v};`
        }).join("");
    }
    /**
     * convert array to string for class attribute
     *  @param { Array<String | Object> } [a] - Class attributes.
     *  @returns { String }
     */
    #toClass(a = []) {
        return a.flat(Infinity).reduce((acc, cv) => {
            if (cv && typeof cv === "object") {
                if (cv?.r instanceof Reference) {
                    cv = _should_registering(cv, this);
                }
            }
            return `${acc} ${cv}`;
        });
    }
} /* //<-- class Nel ends here */
/**
 *  @param { String } [n = "div"] - Name of tag.
 *  @param { Attrs } [a = {}] - Attribute of this node.
 *  @param { ...Nel | Element | String | RefKey } cr - Children of this node.
 */
const nel = (n = "div", a = {}, ...cr) => {
    return new Nel(NType.tagname, n, a, ...cr);
} /* //<-- function nel ends here */

/**
 * @typedef { Object } DefaultOption
 * @property { Array<String> } [class] - class attribute(s)
 * @property { Object } [style] - style attribute(s)
 */
/**
 *  @param { Array<String> } [c = []] - class attribute
 *  @param { Object } [s = {}] - style attribute
 *  @returns { DefaultOption }
 */
const defaultOption = (c = [], s = {}) => {
    return {
        class: c,
        style: s,
    }
}


export {
    extractTypeName,
    isMatchType,
    isEmptyObj,
    isElement,
    escapeHtmlSpecialChars,
    buildElement,
    element,
    emit,
    setEvent,
    pushEventHandlers,
    SerialID,
    Reference,
    useRef,
    NodeElement,
    NType,
    Nel,
    nel,
    NodeParts,
    defaultOption,
};

/* //<-- fr.js ends here*/
