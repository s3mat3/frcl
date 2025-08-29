/** @ts-check
 * @file fr.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
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
const FR_CID = new SerialID(1000);
////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////
/**
 * window.$fr_cid (read only)
 * This global is readed per increment number as string
 */
Object.defineProperty(window, "$fr_cid", {
    get() {
        return FR_CID.value;
    },
    // no setter
});
window.__proto__.$nop = () => {};
window.__proto__.$d = window.document;
window.__proto__.$$ = $d.querySelector.bind(document);
window.__proto__.$a = $d.querySelectorAll.bind(document);
window.__proto__.$toast = (m, c = "is-info", t = 3) => {
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
 *  @param {String} [target] - string for output web browser
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
 * Build element from HTML markup string
 *  @param { String } [h] - html markup string
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
 *  @param { String } [s] - string as tags
 *  @param { Array<String> } [vs] - string array from ${some_variable}
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
 * Emit custom event with context
 *  @param { String } [n] - name as event trigger
 *  @param { Any } [d] - detail of event (event data)
 *  @param { HTMLElement } [c = document] - event source element named context
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
 *  @param { String } e - event name
 *  @param { Function } l - function of event listener
 */
function setEvent(s, e, l) {
    s.removeEventListener(e, l);
    s.addEventListener(e, l);
}
/**
 * @typedef { Object } CurrentRegistering
 * @property { Object } [ctx] - context (Nel)
 * @property { Function } [cb] - call back for reaction
 */
/** @type { CurrentRegistering } @private in this file only */
let _current_registering = undefined;
////////////////////////////////////////////////////////////////////
/**
 * @interface NodeElement
 */
class NodeElement {
    get parent() {}
    set parent(p) {}
    get element() {}
    build(p) {}
    mount(p) {}
    unmount() {}
    update() {}
}
/**
 *
 */
class Reference {
    #val = undefined;
    #old = undefined;
    _reactive = true;
    _listeners = undefined;
    /**
     *  @param { Any } [iv] - initial value. not a initial vector www...
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
        if (_current_registering) {
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
 * @typedef { Object } RefKey
 * @property { Reference } [r] - instance of Reference
 * @property { String } [k] - key of r.value if value Object
 */
/**
 * @private
 *  @param { RefKey } [r] - tracking target
 *  @param { NodeElement } [n] - implements NodeElement object
 *  @returns { Reference.value }
 */
const _should_registering = (r, n) => {
    let v = undefined;
    // console.log(r);
    _current_registering = {ctx: n, cb: n.update};
    v = (r.k) ? r.r.value[r.k] : r.r.value
    _current_registering = undefined;
    return v;
}
/**
 *  @param { Reference } [t] - tracking object
 *  @param { String } [k] - key
 *  @returns { RefKey }  packed object
 *  @example
 *  const x = new Refarence({name: "hoge", age: 18});
 *  options.name = useRef(x, "name");
 *  options.age  = useRef(x, "age");
 *  x = {name: "fuga", age: "98"};
 */
const useRef = (t, k = "") => {
    return {r: t, k: k};
}
/** for Nel class type property
 * @typedef { Object } NType
 * @property { Number } tagname Nel class name property - string as tagname
 * @property { Number } element Nel class name property - HTMLElement
 * @property { Number } tempLiteral Nel class name property - string as html template literal
 * Other property - not implement now. @see class Nel build method
 */
const NType = {
    tagname     : 0,
    element     : 1,
    attribute   : 2,
    text        : 3,
    cdata       : 4,
    comment     : 8,
    tempLiteral : 1000,
}
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
    _node = undefined;
    get node() {return this._node;}
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
 * @property { Object | String } [style] - tag attribute of style
 * @property { Array<String> | String } [class] - tag attribute of class
 */
/**
 * Node ELement class named Nel
 *  @class
 *  @implements { NodeElement }
 */
class Nel extends NodeElement{
    /** @private @type { String } [id = ""] - this node ID (number string) */
    #nid = "";
    /** @protected @type { HTMLElement } [_elm = udefined] - this node cache */
    _elm = undefined;
    /** @public @type { NType } [type = NType.tagname] - node type  */
    type = NType.tagname;
    /** @public @type { String } [name = ""] - tag name */
    name = ""
    /** @public @type { Attrs } */
    attrs = {
        style: {}
    };
    /** @public @type { Array <Nel | HTMLElement | String | Reference> } children - this node children */
    children = [];
    /** @public @type { HTMLElement } p - this node parent */
    p = undefined;
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
    /**
     * constructor
     *  @param { NType } [t] - this node type
     *  @param { String } [n] - name of tag
     *  @param { Attrs } [a = {}] - attribute of this node
     *  @param { Node | HTMLElement | Reference |  } [cr] - children of this node 
     */
    constructor(t, n, a = {}, ...cr) {
        super();
        this.#nid = window.$fr_cid ?? "1000";
        this.type = t;
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
    get id() {return this.attrs.id;}
    /**
     * element getter
     *  @returns {HTMLElement}
     */
    get element() { return this._elm; }
    /**
     * parent getter
     *  @returns {HTMLElement} this node parent 
     */
    get parent() { return this.p; }
    set parent(p) { this.p = p; }
    /**
     * Build this node element
     *  @param { HTMLElement } [p] - parent of this node element
     */
    build(p = undefined) {
        this.p = (p) ? p : this.p;
        _invoke(this.beforeCreate);
        this._elm = (this.type === NType.tagname) ? document.createElement(this.name)
            : (this.type === NType.tempLiteral) ? element(this.name)
            : (this.name === NType.element) ? this.name : document.createElement("template");
        /// set attribute(s)
        this.updateAttributes();
        /// append children
        this.#append();
        _invoke(this.created);
        return this._elm;
    } /* //<-- method build ends here */
    /**
     * Mount to my parent
     *  @param { HTMLElement } p - my parent
     */
    mount(p = undefined) {
        p = (p) ? p : this.p;
        if (! p) this.p = p = $$("body"); // parent is body maybe error
        _invoke(this.beforeMount);
        const prev = this._elm;
        const now  = this.build(p);
        // somecase p.hasChildNodes(prev) === true but prev.parentNode === null why?
        (prev && this.p.hasChildNodes(prev) && prev.parentNode)
            ? this.p.replaceChild(now, prev)
            : this.p.insertAdjacentElement("beforeend", now);
        _invoke(this.mounted);
        return this;
    }
    /**
     * Unmount this node from my parent
     * Onry remove from DOM, no free
     */
    unmount() {
        if (! this.p.hasChildNodes(this._elm)) return this;
        _invoke(this.beforeUnmount);
        this.p.removeChild(this._elm)
        _invoke(this.unmounted);
        return this;
    }
    /**
     *
     */
    update() {
        return this.mount(this.p);
    }
    /**
     * Update child with position
     *  @param { Number } [p] - position number
     *  @param { Nel | HTMLElement | String | Reference } [c] - child element
     */
    updateChild(p, c) {
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
            if (v.r instanceof Reference) {
                if (! v) continue;
                let nv = _should_registering(v, this);
                e.setAttribute(k, nv);
                continue;
            }
            if (k === "style") {
                const d = (typeof v === "object") ? this.#toStyle(v) : v
                if (! d) continue;
                e.setAttribute(k, d);
            } else if (k === "class") {
                const d = (Array.isArray(v) && v.length) ? this.#toClass(v) : v
                if (! d || !(typeof d === "string")) continue;
                e.setAttribute(k, d);
            } else {
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
            if (! c || c.length === 0) continue;
            if (typeof c === "object") {
                if (c instanceof Nel) {
                    this._elm.insertAdjacentElement("beforeend", c.build(this._elm));
                    // this._elm.append(c.build(this._elm));
                } else if (c instanceof NodeParts) {
                    this._elm.insertAdjacentElement("beforeend", c.node.build(this._elm));
                    // this._elm.append(c.node.build(this._elm));
                } else if (c.r instanceof Reference) {
                    let nc = _should_registering(c, this);
                    this._elm.insertAdjacentText("beforeend", nc);
                    // this._elm.append(c);
                }  else if (c instanceof HTMLElement) {
                    this._elm.insertAdjacentElement("beforeend", c);
                    // this._elm.append(c);
                }
            } else if (typeof c === "string") {
                this._elm.insertAdjacentText("beforeend", c);
                // this._elm.append(c);
            } else {
                console.error("what child element?", c);
                continue;
            }
        }
        return this._elm;
    }
    /**
     * convert object to string for style attribute
     */
    #toStyle(o) {
        return Object.entries(o).map(([k, v]) => {
            if (v.r instanceof Reference) {
                v = _should_registering(v, this);
            }
            return `${k}: ${v};`
        }).join("");
    }
    /**
     * convert array to string for class attribute
     *  @param { Array<String> } [a] - class attribute parameter
     */
    #toClass(a) {
        return a.flat(Infinity).reduce((a, c) => {
            if (c.r instanceof Reference) {
                c = _should_registering(c, this);
            }
            return `${a} ${c}`;
        });
    }
} /* //<-- class Nel ends here */

const nel = (n, a = {}, ...cr) => {
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
    SerialID,
    Reference,
    useRef,
    NodeElement,
    NType,
    Nel,
    nel,
    NodeParts,
    defaultOption,
}

/* //<-- fr.js ends here*/
