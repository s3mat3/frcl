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
/// global scope functions
/**
 * Extract type name came from string made by object.tostring.call()
 * let arr = [];
 * Object.call(arr) result => [object Array] => slice(8, -1) => 'Array' 
 *                            12345678     -1
 * @param {any} target is Type name extraction target
 * @return {String} cf Array Object ... etc
 */
function extractTypeName(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}
/**
 * Test if the target type is in the given type list.
 * @param {array} types is list(array) of types to match. cf.['Array', 'String', ...] or ['Object'] etc.
 * @param {any} target is inspect target
 * @return {bool} true match types and target, false unmatch types and target.
 */
function isMatchType(types, target) {
    return types.includes(extractTypeName(target));
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
 * @typedef { Object } CurrentRegistering
 * @property { Object } ctx is context (Nel)
 * @property { Function } cb is call back for reaction
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
 * @typedef { Object } RefKey
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
/** for Nel class type property
 * @typedef { Object } NType
 * @property { Number } tagname Nel class name property is string as tagname
 * @property { Number } element Nel class name property is HTMLElement
 * @property { Number } tempLiteral Nel class name property is string as html template literal
 * Other property is not implement now. @see class Nel build method
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
/**
 * @typedef { Object } Attrs
 * @property { Object | String } style is tag attribute of style
 * @property { Array<String> | String } class is tag attribute of class
 */
/**
 * Node ELement class named Nel
 *  @class
 *  @implements { NodeElement }
 */
class Nel extends NodeElement{
    /** @private @type { String } id is this node ID (number string) */
    #nid = "";
    /** @protected @type { HTMLElement } elm is this node cache */
    _elm = undefined;
    /** @public @type { NType } type is node type  */
    type = NType.tagname;
    /** @public @type { String } name is tag name */
    name = ""
    /** @public @type { Attrs } */
    attrs = {
        style: {}
    };
    /** @public @type { Array <Nel | HTMLElement | String | Reference> } children is this node children */
    children = [];
    /** @public @type { HTMLElement } p is this node parent */
    p = undefined;
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
    /**
     *  @returns { String }  This node ID (auto numbered)
     */
    get nid() {return this.#nid;}
    /**
     *  @param { String } name is prefix this node top level tag's id attribute
     */
    set id(name) {
        this.attrs.id = `${name}_${this.#nid}`;
        (this._elm) ? this._elm.setAttribute("id", this.attrs.id) : $nop();
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
    /**
     * Build this node element
     *  @param { HTMLElement } p is parent of this node element
     */
    build(p = undefined) {
        this.p = (p) ? p : this.p;
        this._elm = (this.type === NType.tagname) ? document.createElement(this.name)
            : (this.type === NType.tempLiteral) ? element(this.name)
            : (this.name === NType.element) ? this.name : document.createElement("template");
        let e = this._elm;
        /// set attribute(s)
        for (const [k, v] of Object.entries(this.attrs)) {
            if (! v) continue;
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
                (k === "class" && Array.isArray(v) && v.length) ? this.#toClass(v) : v;
            e.setAttribute(k, d);
        }
        /// append children
        return this.#append();
    } /* //<-- method build ends here */
    /**
     * Mount to my parent
     *  @param { HTMLElement } p is my parent
     */
    mount(p = undefined) {
        this.#invoke(this.beforeMount);
        const prev = this._elm;
        const now  = this.build(p);
        (prev && this.p.hasChildNodes(prev))
            ? this.p.replaceChild(now, prev)
            : this.p.insertAdjacentElement("beforeend", now);
        this.#invoke(this.mounted);
        return this;
    }
    /**
     * Unmount this node from my parent
     * Onry remove DOM, no free
     */
    unmount() {
        if (! this.p.hasChildNodes(this._elm)) return this;
        this.#invoke(this.beforeUnmount);
        this.p.removeChild(this._elm)
        this.#invoke(this.unmounted);
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
     *  @param { Number } p is position number
     *  @param { Nel | HTMLElement | String | Reference } c is child element
     */
    updateChild(p, c) {
        this.children[p] = c;
    }
    /**
     * Append children my node from child list
     */
    #append() {
        this.children.flat(Infinity).forEach((c) => {
            if (typeof c === "object") {
                if (c instanceof Nel) {
                    this._elm.insertAdjacentElement("beforeend", c.build(this._elm));
                } else if (c.r instanceof Reference) {
                    c = _should_registering(c, this);
                    this._elm.insertAdjacentText("beforeend", c);
                }  else if (c instanceof HTMLElement) {
                    this._elm.insertAdjacentElement("beforeend", c);
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
     *  @param { Array<String> } a is class attribute parameter
     */
    #toClass(a) {
        return a.flat(Infinity).reduce((a, c) => {
            if (c.r instanceof Reference) {
                c = _should_registering(c, this);
            }
            return `${a} ${c}`;
        });
    }
    /**
     * Invoke hooks
     *  @param { FunctionList } a is array of function
     */
    #invoke(a = []) {
        if (! a || ! Array.isArray(a)) return;
        a.forEach((f) => {
            if (typeof f !== "function") $nop();
            f();
        });
    }
} /* //<-- class Nel ends here */

const nel = (n, a = {}, ...cr) => {
    return new Nel(NType.tagname, n, a, ...cr);
} /* //<-- function nel ends here */

/**
 * @typedef { Object } DefaultOption
 * @property { Array<String> } class is class attribute(s)
 * @property { Object } style is style attribute(s)
 */

export {
    extractTypeName,
    isMatchType,
    isElement,
    escapeHtmlSpecialChars,
    buildElement,
    element,
    setEvent,
    SerialID,
    Reference,
    useRef,
    NodeElement,
    NType,
    Nel,
    nel,
}

/* //<-- fr.js ends here*/
