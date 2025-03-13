/**
 * @file reactive.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief Fake reactive system...www...(:-)
 *
 * @author s3mat3
 */
'use strict';

import { isMatchType } from "./misc";
// var FR = FR || {};
// (function () {
// })();


/** @type { WeakMap <Object, Map<String, Set<Function> } */
const _actions_map = new WeakMap();

/**
 * Watch entry to action function
 *  @param { Object } t is monitored target object
 *  @param { String } k is property key(name)
 *  @param { Function } f is action function
 *  @param { Object } c is actions context
 */
function watch(t, k, f, c = null) {
    // console.log(typeof t);
    let actionsList = _actions_map.get(t);
    if (! actionsList) {
        _actions_map.set(t, (actionsList = new Map()));
    }
    let actions = actionsList.get(k);
    if (! actions) {
        actionsList.set(k, (actions = new Set()));
    }
    actions.add({f, c});
}
/**
 * Notifyer
 *  @param { Object } o is monitored object
 *  @param { String } k is monitored property key(name)
 *  @param { Object } d is notify detail argument
 */
function _invoke_actions(t, k, d = {}) {
    const actionsList = _actions_map.get(t);
    // console.log(actionsList, t);
    if (actionsList) {
        const actions = actionsList.get(k);
        actions.forEach((action) => {
            if (action.c) {
                action.f.call(action.c, d);
            } else {
                action.f(d);
            }
        });
    }
}

/**
 * Monitor
 *  @param { Object | Primitive }  o is monitor target object
 *  @returns { Proxy }
 */
const monitor = (o) => {
    const to = (isMatchType(["Array", "Object"], o)) ? o : { value: o };
    return new Proxy(to, {
        // trap handlers attach 3 methods (set, get deleteProperty)
        set(t, k, v, r) {
            const ov = Reflect.get(t, k, r);
            // no update when same old value and new value
            if (ov && isMatchType([Array, Object], ov)) {
                if (JSON.stringify(ov) === JSON.stringify(v)) return true;
            } else {
                if (ov === v) return true;
            }
            const rv = Reflect.set(t, k, v, r);
            // invoke action when update success
            if (rv) {_invoke_actions(t, k, {t, k, v, ov, a: "set"});}
            return rv;
        },
        get(t, k, r) {
            const rv = Reflect.get(t, k, r);
            return (rv && isMatchType([Object, Array])) ? monitor(rv) : rv;
        },
        // delete trap
        deleteProperty(t, k, r) {
            const rv = Reflect.deleteProperty(t, k, r);
            if (rv) {
                _invoke_actions(t, k, {t, k, a:"del"});
                const n = _actions_map.get(t);
                if (!n) return rv;
                const actions = n.get(k);
                actions?.clear();
                n.delete(k); // delete 
                _actions_map.delete(t); // delete from weakmap
            }
            return rv;
        },
    });
}

export { watch, monitor }

/* //<-- reactive.js ends here*/
