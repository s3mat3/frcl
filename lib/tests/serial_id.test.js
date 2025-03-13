/**
 * @file serial_id.test.js
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

import { SerailID }  from "../core/serial_id";

describe("Serial number test", () => {
    const c1 = new SerailID(100);
    const c2 = new SerailID(100);
    test("simple up", () => {
        expect(c1.value).toBe("100");
        expect(c1.value).toBe("101");
    });
    test("read only", () => {
        expect(() => {c1.value = 0;}).toThrow();
    });
    test("isolate", () => {
        /* c1 = 102, c2 = 100 */
        expect(() => {
            const x = c1.value;
            const y = c2.value;
            return x != y;
        }).toBeTruthy();
        
        expect(c1.value).toBe("102");
        expect(c2.value).toBe("100");
        expect(c2.value).toBe("101");
        expect(c2.value).toBe("102");
        expect(c2.value).toBe("103");
        expect(c2.value).toBe("104");
        expect(c1.value).toBe("103");
    });
});
/* //<-- serial_id.test.js ends here*/
