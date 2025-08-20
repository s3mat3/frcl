/**
 * @file hrequest.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief fetch api wraper and some utils
 *
 * @author s3mat3
 */
"use strict";
import * as fr from "./fr";

/**
 * Build URL string
 *  @param {String} base URL base address
 *  @param {String} relative URL
 */
function buildUrl(base, relative) {
    if (!relative) return base;
    const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    const relativeUrl = relative.startsWith('/') ? relative.slice(1) : relative;
    return `${baseUrl}/${relativeUrl}`;
}

/**
 * Build URL with query
 *  @param {String} fullPath
 *  @param {Object} queries {'key1': value1, 'key2': 'value2'}
 */
function buildUrlWithQuery(fullPath, queries) {
    if (!queries || Object.keys(queries).length === 0) return fullPath;
    const params = new URLSearchParams(queries);
    return `${fullPath}?${params.toString()}`;
}

/**
 * Build API request header
 *  @param {Object} headers request headers
 *  @returns {Object} headers key-value object
 */
function buildHeaders(headers = {}) {
    if (Object.hasOwn(headers, 'Content-Type')) {
        return { ...headers };
    }
    return { 'Content-Type': 'application/json', ...headers };
}

/**
 * Build API request options
 *  @param {String} method for http communication  'GET', 'POST', 'DELETE', 'PUT' ...etc,
 *  @param {Object} headers request headers
 *  @param {Any} body request body
 *  @param {String} cors Select from the following three values 'cors' | 'no-cors' | 'same-origin' Default 'cors'
 *  @param {String} credential Select from the following three values 'omit' | 'same-origin' | 'include' Default 'same-origin'
 *  @returns {Object} options object for fetch api
 */
function buildOptions(method = 'GET', headers, body, cors = 'cors', credential = 'same-origin') {
    const options = {
        method,
        headers: buildHeaders(headers),
        mode: cors,
        credentials: credential,
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
}


/**
 * Request to API endpoint(entrypoint) wrapper for fetch api
 *  @param {String} url for request endpoint
 *  @param {Object} options for fetch api
 *  @param {Function} handle_header is call back using response header analysis
 *  @returns {Obj} when success
 *  @throws when occurrered client side error
 *  @throws When response JSON can't parse
 *  @throws When response not a text
 */
async function request(url, options, header_handler = null) {
    fr.emit("fr:request-start", {}, document);
    try {
        const response = await fetch(url, options);

        if (header_handler && typeof header_handler === 'function') {
            header_handler(response.headers);
        }

        const contentType = response.headers.get('content-type') || '';
        let body;

        try {
            if (contentType.includes('application/json')) {
                body = await response.json();
            } else {
                body = await response.text();
            }
        } catch (e) {
            body = `Could not parse body as ${contentType}`;
        }


        if (!response.ok) {
            throw new Error(response.statusText, { cause: { response, body } });
        }

        return { body, response };

    } catch (err) {
        console.error('Request failed:', err);
        throw err;
    } finally {
        fr.emit("fr:request-done", {}, document);
    }
}

export {
    request,
    buildHeaders,
    buildOptions,
    buildUrl,
    buildUrlWithQuery
}

/* //<-- hrequest.js ends here*/
