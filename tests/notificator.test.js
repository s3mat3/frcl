/**
 * @file notificator.test.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

import { test, expect, describe, beforeAll } from "vitest";
import { Notificator } from "../core/notificator";

let x_result;
let y_result;
let result = {x: undefined, y: undefined};
function x(data = {}) {
    data.name = 'FUNCTION X';
    result.x =  data.x;
    x_result = data.name;
}

function y(data = {}) {
    data.name = 'FUNCTION Y';
    result.y = data.y;
    y_result = data.name;
}
// let y = (data = {}) => {data.func = 'FUNCTION Y'; y_result = data;}

describe('Notificator test', () => {
    let notificator;
    beforeAll (() => {
        notificator = new Notificator();
    });
    test('addListenerable', () =>{
        expect(notificator.addListener('a', x)).toBe(1);
        expect(notificator.addListener('a', y)).toBe(2);
        // console.log(notificator.lists.a.includes(y));
    }) ;
    test('addListener reject same', () =>{
        expect(notificator.addListener('a', x)).toBe(2);
        expect(notificator.addListener('a', y)).toBe(2);
        expect(notificator.addListener('aa', x)).toBe(1);
        expect(notificator.addListener('aa', y)).toBe(2);
        // console.log(notificator.lists.a.includes(y));
    }) ;
    test('delListenerable', () =>{
        expect(notificator.size('a')).toBe(2);
        notificator.delListener('a', x);
        expect(notificator.size('a')).toBe(1);
        notificator.delListener('a', y);
        expect(notificator.size('a')).toBe(0);
        notificator.delListener('x', y);
        expect(notificator.size('x')).toBe(0);
        expect(notificator.size('aa')).toBe(2);
    }) ;
    test('callback not a function in addListener', () => {
        expect(() => notificator.addListener('aaa', 1).toThrow);
        expect(() => notificator.addListener('aaa', []).toThrow);
        expect(() => notificator.addListener('aaa', {}).toThrow);
    });
    test('callback not a function in delListener', () => {
        expect(() => notificator.delListener('a', 1).toThrow);
        expect(() => notificator.delListener('a', []).toThrow);
        expect(() => notificator.delListener('a', {}).toThrow);
    });
    test('event name not available in delListener', () => {
        expect(notificator.size('aa')).toBe(2);
        notificator.delListener('aa', x);
        expect(notificator.size('aa')).toBe(1);
        notificator.delListener('aa', y);
        expect(notificator.size('aa')).toBe(0);
    });
    test('notifyable', () => {
        notificator.addListener('aa', x);
        notificator.addListener('aa', y);
        expect(result.x).toBeUndefined();
        expect(result.y).toBeUndefined();
        notificator.notify('aa', {x:'func x', y: 'func y'});
        expect(result.x).toBe('func x');
        expect(result.y).toBe('func y');
        console.log(result);
        console.log(x_result, y_result);
        // expect(result).not.toBe([]);
        // expect(result).toMatchObject(detail);
        // for (let i in result) {
        //     expect(result[i].id).toBe(1);
        //     expect(result[i].name).toBe('hoge');
        //     // console.log(result[i]);
        // }
    });
})

/* //<-- notificator.test.js ends here*/
