/**
 * @file table.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";

import * as fr from "../../core/fr";

/**
 * @typedef {Object} ColInfo
 * @property {string} field - DB field name
 * @property {string} label - Display field name
 * @property {boolean} sortable - is sortable
 * @property {boolean} key - is key field
 * @property {boolean} hidden - is hidden
 */

/**
 * @typedef {Object} TableOption
 * @property {number} width - table width in %
 * @property {number} count - number of items to display
 * @property {string} caption - table caption
 * @property {Array<ColInfo>} colInfoList - column info list
 * @property {Array<Object>} rowList - row list
 */

/**
 * @returns {TableOption}
 */
const tableOption = () => {
    return {
        width: 100,
        count: 25,
        caption: "No-name-given",
        colInfoList: [],
        rowList: [],
    };
};

class Table extends fr.NodeParts {
    option;
    /**
     *
     * @param {TableOption} o
     */
    constructor(o = undefined) {
        super();
        this.option = o ?? tableOption();
        this._node = this.#build();
    }

    #build() {
        const thead = fr.nel(
            "thead",
            {},
            fr.nel(
                "tr",
                {},
                ...this.option.colInfoList
                    .filter(ci => !ci.hidden)
                    .map(ci => {
                        const th = fr.nel("th", {}, ci.label);
                        if (ci.sortable) {
                            th.attrs.class = "sort-asc";
                            th.attrs.onclick = (e) => this.sort(e.target, ci.field);
                        }
                        return th;
                    })
            )
        );

        const tbody = fr.nel(
            "tbody",
            {},
            ...this.option.rowList.map((row, index) => {
                const tr = fr.nel(
                    "tr",
                    {},
                    ...this.option.colInfoList
                        .filter(ci => !ci.hidden)
                        .map(ci => fr.nel("td", {}, row[ci.field]))
                );
                tr.attrs.ondblclick = () => {
                    fr.emit("fr:row-edit-request", {
                        cil: this.option.colInfoList,
                        data: row,
                        index: index,
                    });
                };
                return tr;
            })
        );

        const table = fr.nel(
            "table",
            { class: "sortable" },
            fr.nel("caption", {}, this.option.caption),
            thead,
            tbody
        );

        return fr.nel(
            "div",
            {
                class: "table-container",
                style: { width: `${this.option.width}%` },
            },
            table
        );
    }

    sort(target, field) {
        const currentClass = target.getAttribute("class");
        if (currentClass.includes("sort-asc")) {
            target.setAttribute("class", "sort-desc");
        } else {
            target.setAttribute("class", "sort-asc");
        }
        fr.emit("fr:table-sort-request", { sort_key: field });
    }
}

const table = (o) => {
    return new Table(o);
}

export {
    tableOption,
    Table,
    table,
}
