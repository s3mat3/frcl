/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { request, buildUrl, buildUrlWithQuery, buildHeaders, buildOptions } from '../core/hrequest';

describe('hrequest', () => {
    it('should build a URL correctly', () => {
        expect(buildUrl('http://a.com', 'b')).toBe('http://a.com/b');
        expect(buildUrl('http://a.com/', '/b')).toBe('http://a.com/b');
        expect(buildUrl('http://a.com', '')).toBe('http://a.com');
        expect(buildUrl('http://a.com', null)).toBe('http://a.com');
    });

    it('should build a URL with a query string correctly', () => {
        expect(buildUrlWithQuery('http://a.com/b', { c: 1, d: 'test' })).toBe('http://a.com/b?c=1&d=test');
        expect(buildUrlWithQuery('http://a.com/b', {})).toBe('http://a.com/b');
        expect(buildUrlWithQuery('http://a.com/b', null)).toBe('http://a.com/b');
    });

    it('should build headers correctly', () => {
        expect(buildHeaders()).toEqual({ 'Content-Type': 'application/json' });
        expect(buildHeaders({ 'X-Test': 'true' })).toEqual({ 'Content-Type': 'application/json', 'X-Test': 'true' });
    });

    it('should build options correctly', () => {
        const body = { a: 1 };
        const expected = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            credentials: 'same-origin',
            body: JSON.stringify(body),
        };
        expect(buildOptions('POST', {}, body)).toEqual(expected);
    });

    it('should make a successful request', async () => {
        const responseData = { message: 'Success' };
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: () => Promise.resolve(responseData),
            })
        );

        const { body } = await request('http://a.com/test');
        expect(body).toEqual(responseData);
    });

    it('should handle a failed request with text response', async () => {
        const responseBody = 'Internal Server Error';
        const response = {
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers({ 'Content-Type': 'text/plain' }),
            text: () => Promise.resolve(responseBody),
            json: () => Promise.reject(new Error('not json')),
        };
        global.fetch = vi.fn(() => Promise.resolve(response));

        try {
            await request('http://a.com/fail');
        } catch (e) {
            expect(e.message).toBe('Internal Server Error');
            expect(e.cause.body).toBe(responseBody);
            expect(e.cause.response.status).toBe(500);
        }
    });

    it('should handle a failed request with json response', async () => {
        const errorResponse = { error: 'Not Found' };
        const response = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: () => Promise.resolve(errorResponse),
        };
        global.fetch = vi.fn(() => Promise.resolve(response));

        try {
            await request('http://a.com/fail');
        } catch (e) {
            expect(e.message).toBe('Not Found');
            expect(e.cause.body).toEqual(errorResponse);
            expect(e.cause.response.status).toBe(404);
        }
    });

    it('should handle network errors', async () => {
        const networkError = new TypeError('Failed to fetch');
        global.fetch = vi.fn(() => Promise.reject(networkError));

        await expect(request('http://a.com/network-error')).rejects.toThrow(networkError);
    });
});
