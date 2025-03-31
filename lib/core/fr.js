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
'use strict';

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
/// library globals
/**
 * @typedef CurrentRegistering
 * @property { Object } ctx is context (Nel)
 * @property { Function } cb is call back for reaction
 */
/** @type { CurrentRegistering } */
let _current_registering = undefined;
////////////////////////////////////////////////////////////////////
/**
 * @interface
 */
class NodeElement {
    get parent() {}
    set parent(p) {}
    get element() {}
    build(p) {}
    attach(p) {}
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
     *  @param { Any } iv is initial value. not a initial vector www...
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
 * @typedef RefKey
 * @property { Reference } r is instance of Reference
 * @property { String } k is key of r.value if value Object
 */
/**
 * @private
 *  @param { RefKey } r is tracking target
 *  @param { NodeElement } n is implements NodeElement object
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
 *  @param { Reference } t is tracking object
 *  @param { String } k is key
 *  @returns { RefKey }  packed object
 *  @example
 *  const x = new Refarence({name: "hoge", age: 18});
 *  options.name = useRef(x, "name");
 *  options.age  = useRef(x, "age");
 *  x = {name: "fuga", age: "98"};
 */
const useRef = (t, k = "") => {
    let r = {r: t, k: k};
    return r;
}
/**
 * Node type
 * @enum {Number}
 */
export const NType = {
    element   : 1,
    attribute : 2,
    text      : 3,
    cdata     : 4,
    comment   : 8,
    tl        : 1000,
}
/**
 * @typedef Attrs
 *  @property { Object } style is tag attribute of style 
 */
/**
 * Node ELement class named Nel
 */
class Nel extends NodeElement{
    /** @private @type {String} id is this node ID (number string) */
    #nid = "";
    /** @protected @type {HTMLElement} elm is this node cache */
    _elm = undefined;
    /** @public @type {NType} type is node type  */
    type = NType.element;
    /** @public @type {String} name is tag name */
    name = ""
    /** @public @type {Attrs} */
    attrs = {
        style: {}
    };
    /** @type { Array <Nel | HTMLElement | String | Reference> } children is this node children */
    children = [];
    /** @type { HTMLElement } p is this node parent */
    p = undefined;
    /**
     * constructor
     *  @param { NType } t is this node type
     *  @param { String } n is name of tag
     *  @param { Attrs } a is attribute of this node
     *  @param { Node | HTMLElement | Reference |  } cr is children of this node 
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
    get nid() {return this.#nid;}
    set id(name) {
        this.attrs.id = `${name}_${this.#nid}`;
        (this._elm) ? this._elm.setAttribute("id", this.attrs.id) : $nop;
    }
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

    build(p = undefined) {
        this.p = (p) ? p : this.p;
        this._elm= document.createElement(this.name);
        let e = this._elm;
        for (const [k, v] of Object.entries(this.attrs)) {
            if (k.startsWith("on")) {
                let ev = k.slice(2);
                let fn = (typeof v === "function") ? v : (typeof v === "string") ? new Function(v) : $nop;
                e.removeEventListener(ev, fn);
                e.addEventListener(ev, fn);
                e.setAttribute(k, v);
                continue;
            }
            if (v.r instanceof Reference) {
                v = _should_registering(v, this);
                e.setAttribute(k, v);
                continue;
            }
            let d = (k === "style" && typeof v === "object") ? this.#toStyle(v) :
                (k === "class" && Array.isArray(v)) ? this.#toClass(v) : v;
            e.setAttribute(k, d);
        }
        /// append children
        this.children.flat(Infinity).forEach((c) => {
            if (typeof c === "object") {
                if (c instanceof Nel) {
                    this._elm.insertAdjacentElement("beforeend", c.build(this._elm));
                }
                else if (c.r instanceof Reference) {
                    c = _should_registering(c, this);
                    this._elm.insertAdjacentText("beforeend", c);
                }
            } else if (typeof c === "string") {
                this._elm.insertAdjacentText("beforeend", c);
            } else {
                this._elm.insertAdjacentElement("beforeend", $d.createElement("template"));
            }
        });
        return this._elm;
    }
    /**
     * Attach to my parent
     *  @param { HTMLElement } p is my parent
     */
    attach(p = undefined) {
        const prev = this._elm;
        const now = this.build(p);
        this.p.hasChildNodes(prev) ?
            this.p.replaceChild(now, prev) :
            this.p.replaceChildren(now);
        return this;
    }
    /**
     *
     */
    update() {
        return this.attach(this.p);
    }
    /**
     *
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
     *
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

export {
    SerialID,
    Reference,
    useRef,
    NodeElement,
    Nel,
}

/* //<-- fr.js ends here*/
