/**
 * @file notificator.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

export class Notificator {
    /**
     *  @type { Map<String, Set<Function> }
     */
    #listeners = null;
    constructor() {
        this.#listeners = new Map();
    }

    /**
     * Execute notify for listener all waiting
     *
     *  @param { String } k is event name(type) for waiting listener
     *  @param { Object } o is detail notify reason
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
     * Number of listener by key
     *  @param { String } k is event name(or type) for waiting listener
     *  @reterns { Number } listener's size on key
     */
    size(k) {
        const listeners = this.#listeners.get(k);
        return listeners?.size || 0;
    }
    /**
     * Add listener's callback
     * ** CAUTION ** callback function can not entry anonymous function
     *
     *  @param { String } k is event name(or type) for waiting listener
     *  @param { Function } f is callback function as to recive event notice
     *  @param { Object } c is context of execute default this
     *  @reterns { Number } listener's size on key
     *  @throws { TypeError } when listener is not a function
     */
    addListener(k, f, c = this) {
        if (typeof f !== "function") throw new TypeError("Not a function, nesseary listener is function", "notificator.js");
        const obj = { ctx: c, cb: f };
        if (!this.#listeners.has(k)) this.#listeners.set(k, new Set());
        let cb = false;
        this.#listeners.get(k).forEach((o) => {
            if (o.cb === f) cb = true;
        });
        if (! cb) this.#listeners.get(k).add(obj);
        return this.#listeners.get(k).size;
    }
    /**
     * Delete listener's callback
     * ** CAUTION ** callback function can not entry anonymous function
     *
     *  @param { String } k is event name(type) for waiting listener
     *  @param { Function } f is callback function for listenr
     *  @throws { TypeError } when listener is not a function
     */
    delListener(k, f) {
        if (typeof f !== "function") throw new TypeError("Not a function, nesseary listener is function", "notificator.js");
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
     * ** CAUTION ** callback function can not entry anonymous function
     *
     *  @param { String } k is event name(type) for waiting listener
     *  @throws { TypeError } when listener is not a function
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
