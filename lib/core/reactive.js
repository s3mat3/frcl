/**
 * @file reactive.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief Fake reactive system...www...(:-)
 *
 * This idea from https://blog.risingstack.com/writing-a-javascript-framework-data-binding-es6-proxy/
 *
 * @author s3mat3
 */
'use strict';

import { isMatchType } from "./misc";
// var FR = FR || {};
// (function () {
// })();


/** @private @type { WeakMap <Object, Map<String, Set<Function> } */
const _reactions_list_map = new WeakMap();
/** @private @type { Function } _current_reaction is */
let _current_reaction = undefined;


let _is_queued = false;
/** @private Invoke reaction (Notify)
 *  @param { Object } t is monitored object
 *  @param { String } k is monitored property key(name)
 *  @param { Object } d is notify detail argument
 */
function _invoke_reactions(t, k, d = {}) {
    const reactionsList = _reactions_list_map.get(t);
    // console.log(reactionsList, t);
    if (reactionsList) {
        const reactions = reactionsList.get(k);
        reactions?.forEach((reaction) => {
            // if (! _is_queued) {
            //     _is_queued = true;
            //     queueMicrotask(() => {
            //         _is_queued = false;
            reaction(d);
            //     });
            // }
         });
    }
}
/** @private Register reaction
 *  @param { Object } t is target object
 *  @param { String } k is key name(property name)
 *  @param { Function } a is reaction in the monitored when change
 */
function _register_reaction(t, k, a) {
    let reactionsList = _reactions_list_map.get(t);
    if (! reactionsList) {
        _reactions_list_map.set(t, (reactionsList = new Map()));
    }
    let reactions = reactionsList.get(k);
    if (! reactions) {
        reactionsList.set(k, (reactions = new Set()));
    }
    reactions.add(a);
}

/**
 * Monitor
 *  @param { Object | Primitive }  o is monitor target object
 *  @returns { Proxy }
 */
function monitor(o) {
    const to = (isMatchType(["Array", "Object"], o)) ? o : { value: o };
    return new Proxy(to, {
        // trap handlers attach 3 methods (set, get deleteProperty)
        /** getter trap */
        get(t, k, r) {
            const rv = Reflect.get(t, k, r);
            if (_current_reaction) {
                _register_reaction(t, k, _current_reaction);
            }
            if (rv && isMatchType(["Object", "Array"], rv)) return monitor(rv)
            return rv;
        },
        /** setter trap */
        set(t, k, v, r) {
            const ov = Reflect.get(t, k, r);
            // no update when same old value and new value
            if (ov && isMatchType([Array, Object], ov)) {
                if (JSON.stringify(ov) === JSON.stringify(v)) return true;
            } else {
                if (ov === v) return true;
            }
            const rv = Reflect.set(t, k, v, r);
            // invoke reaction when update success
            if (rv) {_invoke_reactions(t, k, {a: "set"});}
            return rv;
        },
        /** deleter trap */
        deleteProperty(t, k, r) {
            const rv = Reflect.deleteProperty(t, k, r);
            if (rv) {
                _invoke_reactions(t, k, {a:"del"});
                const n = _reactions_list_map.get(t);
                if (! n) return rv;
                const reactions = n.get(k);
                reactions?.clear();
                n.delete(k); // delete 
                _reactions_list_map.delete(t); // delete from weakmap
            }
            return rv;
        },
    });
}
/** create reaction for reactive
 *  @param { Function } a is reactive reaction
 *  a = function(detail) detail is Object = {a: "set" | "del"}
 */
function createReaction(a) {
    _current_reaction = a;
    _current_reaction();
    _current_reaction = undefined;
}

export { monitor, createReaction }

/* //<-- reactive.js ends here*/
