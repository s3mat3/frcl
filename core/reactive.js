// @ts-check
/*!
 * The misc.js is part of Fake Reactivity Component oriented Libray
 * Copyright (c) 2025 s3mat3
 * Licensed under the MIT License, see the LICENSE file for details
 */
/**
 * @file Fake reactive system...www...(:-)
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * This idea from
 * @see https://blog.risingstack.com/writing-a-javascript-framework-data-binding-es6-proxy/
 *
 * @author s3mat3
 */
'use strict';

import { isMatchType } from "./misc";

class ReactionArg {
    /** Action parameter "set" or "del"
       @type { String } */
    #a = "set";

    constructor(a = "set") {
        this.#a = a;
    }

    get a() {return this.#a;}
}

/**
 * ReactionType is callback function.
 * @typedef { function(ReactionArg | void): void } ReactionType;
 */

/** Listeners map
 *  @package
 *  @type { WeakMap<Object, Map<String, Set<ReactionType>>> }
 */
const _reactions_list_map = new WeakMap();

/** ReactionType holder.
 *  @package
 *  @type { ReactionType | null } */
let _current_reaction = null;

/** Flag of microtask
 *  @package
 *  @type { Boolean }*/
let _is_pending = false;

/** Invoke reaction (Notify)
 *  @package
 *  @param { Object } t is monitored object
 *  @param { String } k is monitored property key(name)
 *  @param { ReactionArg } d is notify detail argument
 */
function _invoke_reactions(t, k, d) {
    const reactionsList = _reactions_list_map.get(t);
    // console.log(reactionsList, t);
    if (reactionsList) {
        const reactions = reactionsList.get(k);
        reactions?.forEach((reaction) => {
            // reaction(d); // when reactive.test.js I don't know how to deleay on vitetest
            if (! _is_pending) { // when release
                _is_pending = true;
                queueMicrotask(() => { // sched in before nextTick
                    _is_pending = false;
                    reaction(d);
                });
            }
         });
    }
}
/** Register reaction
 *  @package
 *  @param { Object } t is target object
 *  @param { String } k is key name(property name)
 *  @param { ReactionType } a is reaction in the monitored when change
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
 *  @param { Object | Array }  o is monitor target object
 *  @returns { Proxy }
 */
function monitor(o) {
    const to = (isMatchType(["Array", "Object"], o)) ? o : { value: o };
    return new Proxy(to, {
        // trap handlers attach 3 methods (set, get deleteProperty)
        /** getter trap
         *  @param { Object | Array } t - Monitored target object.
         *  @param { String } k - Object key.
         *  @param { any } r - Reciver.
         */
        get(t, k, r) {
            const rv = Reflect.get(t, k, r);
            if (_current_reaction) {
                _register_reaction(t, k, _current_reaction);
            }
            if (rv && isMatchType(["Object", "Array"], rv)) return monitor(rv)
            return rv;
        },
        /** setter trap
         *  @param { Object | Array } t - Monitored target object.
         *  @param { String } k - Object key.
         *  @param { any } r - Reciver.
         */
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
            if (rv) {_invoke_reactions(t, k, new ReactionArg("set"));}
            return rv;
        },
        /** deleter trap
         *  @param { Object | Array } t - Monitored target object.
         *  @param { String } k - Object key.
         */
        deleteProperty(t, k) {
            const rv = Reflect.deleteProperty(t, k);
            if (rv) {
                _invoke_reactions(t, k, new ReactionArg("del"));
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

/** Create reaction for reactive.
 *  @param { ReactionType } a - Reaction function.
 */
function createReaction(a) {
    _current_reaction = a;
    _current_reaction();
    _current_reaction = null;
}

export { monitor, createReaction }

/* //<-- reactive.js ends here*/
