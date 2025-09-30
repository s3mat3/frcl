// @ts-check
/*!
 * The notificator.js is part of Fake Reactivity Component oriented Libray
 * Copyright (c) 2025 s3mat3
 * Licensed under the MIT License, see the LICENSE file for details
 */
/**
 * @file Another way to deliver events
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @author s3mat3
 */
'use strict';

/**
 * Callback type for notificator
 */
class NotificatorCallbackType {
    /** ctx - Execute context for callback.
       @type { Object } */
    #ctx;
    /** cb - Callback
       @type { Function }*/
    #cb;
    /**
     *  @param { Function } cb - Entry point of callback.
     *  @param { Object }  [ctx = this] - Callback execution context.
     */
    constructor(cb, ctx = this) {
        this.#cb = (cb) ?? NotificatorCallbackType.voidFunc;
        this.#ctx = ctx;
    }

    get ctx() {return this.#ctx;}
    get cb() {return this.#cb;}

    static voidFunc() {}
}
/**
 * Notificator class
 */
export class Notificator {
    /** listeners - Delivery list.
     *  @type { Map<String, Set<NotificatorCallbackType>> }
     */
    #listeners;
    /**
     * @constructor
     */
    constructor() {
        this.#listeners = new Map();
    }
    /**
     * Execute notify for listener all waiting
     *
     *  @param { String } k - Event name(type) for waiting listener.
     *  @param { Object } o - Detail notify reason.
     */
    notify(k, o = {}) {
        const listeners = this.#listeners.get(k);
        if (! listeners) {
            console.info("No assign listener");
            return;
        }
        listeners.forEach((listener) => {
            listener.cb.call(listener.ctx, o);
        });
    }

    /**
     * Number of listener by event name
     *  @param { String } k - Event name(or type) for waiting listener.
     *  @reterns { Number } Size of listeners
     */
    size(k) {
        const listeners = this.#listeners.get(k);
        return listeners?.size || 0;
    }
    /**
     * Add listener's callback
     *
     * > **Important:** Callback function can not entry anonymous function.
     *
     *  @param { String } k - Event name(or type) for waiting listener.
     *  @param { Function } f - Callback function as to recive event notice.
     *  @param { Object } [c = this] - Context of execute default this.
     *  @reterns { Number } Listener's size by event name.
     *  @throws { TypeError } When given listener is not a function.
     */
    addListener(k, f, c = this) {
        if (! this.#listeners) return;
        if (typeof f !== "function") throw new TypeError("Not a function, nesseary listener is function [notificator.js]");
        const obj = new NotificatorCallbackType(f, c);
        if (! this.#listeners.has(k)) this.#listeners.set(k, new Set());
        let cb = false;
        this.#listeners?.get(k)?.forEach((o) => {
            if (o.cb === f) cb = true;
        });
        if (! cb) this.#listeners?.get(k)?.add(obj);
        return this.#listeners.get(k)?.size || 0;
    }
    /**
     * Delete listener's callback
     *
     * > **Important:** Callback function can not entry anonymous function.
     *
     *  @param { String } k - Event name(type) for waiting listener.
     *  @param { Function } f - Delete this function from listeners map.
     *  @throws { TypeError } When listener is not a function.
     */
    delListener(k, f) {
        if (typeof f !== "function") throw new TypeError("Not a function, nesseary listener is function [notificator.js]");
        const listeners = this.#listeners.get(k);
        if (!listeners) return;
        listeners.forEach((obj) => {
            if (obj.cb === f) {
                listeners.delete(obj);
            }
        });
    }

    /**
     * Delete listener's callback by map key
     *
     *  @param { String } k - Event name(type) for waiting listener.
     */
    delListenerByKey(k) {
        const listeners = this.#listeners.get(k);
        if (listeners?.size) {
            listeners.clear();
            this.#listeners.delete(k);
        }
    }

    /**
     * Delete all listener
     */
    clearAll() {
        if (this.#listeners && this.#listeners.size) {
            for (let k of this.#listeners.keys()) {
                this.delListenerByKey(k);
            }
        }
    }
} /* //<-- class Notificator ends here */
/* //<-- notificator.js ends here*/
