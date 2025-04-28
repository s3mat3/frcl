/**
 * @file reactive.test.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
'use strict';

import { test, expect, describe } from "vitest";

import { monitor, createReaction } from "../core/reactive";

describe("Reactive small test", () => {
    test("simple", () => {
        let target = {
            msg1: "Hello",
            msg2: "World",
        }
        target = monitor(target);
        createReaction(() => {
            target.mall = `${target.msg1} ${target.msg2}`;
        });
        expect(target.mall).toBe("Hello World");
        async () => {
            target.msg1 = "Hoge";
            await waitFor(() => {
                expect(target.mall).toBe("Hoge World");
            });
        }
        async () => {
            target.msg2 = "na baby";
            await waitFor(() => {
                expect(target.mall).toBe("Hoge na baby");
            });
        }
    });
    test("array", () => {
        let obj = {
            arry: [1,2,3,4,5],
        }
        obj = monitor(obj);
        let mon = 0;
        createReaction(() => {
            mon = obj.arry[4];
        });
        async () => {
            await waitFor(() => {
                obj.arry[4] = 2;
                expect(mon).toBe(2);
            });
        }

        let xarry = [];
        createReaction(() => {
            xarry = obj.arry;
        });
        async () => {
            await waitFor(() => {
                expect(xarry).toEqual([1,2,3,4,2]);
            });
        }
        async () => {
            obj.arry = [8,7,6,5];
            expect(xarry).toEqual([8,7,6,5]);
        }
    });

    test("object", () => {
        let obj = {
            msg: "hoge",
            o: {
                a: 100,
                b: 200,
            }
        }
        obj = monitor(obj);
        createReaction(() => {
            obj.total = obj.o.a + obj.o.b;
        });
        expect(obj.total).toBe(300);
        async () => {
            obj.o.a = 200;
            await waitFor(() => {
                expect(obj.total).toBe(400);
            });
        }
        async () => {
            obj.o.b = 300;
            await waitFor(() => {
                expect(obj.total).toBe(500);
            });
        }
    });
})

/* //<-- reactive.test.js ends here*/
