/**
 * @file data-table.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief Table view for data table
 *
 * @author s3mat3
 */
"use strict";

import * as fr from "../../core/fr";
import { ColumnConfiguration } from "../../lib/view-model/column-configuration";

/**
 * @typedef { Object } TableData
 * @property { number } [width = "100%"] - Width of table content.
 * @property { number } [nod = 20] - Number of display.
 * @property { string } [title = "No-name-givven"] - Table title
 * @property { Array<ColumnConfiguration> } [confList] - Array of column configura
 * @property { Array<Object> } [data] - Table data
 */

/**
 * @returns {TableData}
 */
const tableData = () => {
    return {
        width: "100%",
        nod: 25,
        title: "No-name-given",
        confList: [],
        data: [],
    };
};

class DataTable extends fr.NodeParts {
    /** @type { TableData } */
    props = {};
    /** @type { fr.Nel } */
    thead = undefined;
    /** @type { fr.Nel } */
    tbody = undefined;
    /** @type { Array<fr.Nel> } */
    rows = [];
    sortState = {key: "", direction: ""};
    bgcolor = "pink";
    /**
     *  @param { TableData }
     */
    constructor(props) {
        super();
        this.props = { ...props };
        this.props.nod = this.props.nod ?? 20;
        this._node = this.#build();
    }
    #build() {
        const { confList, data, title, width } = this.props;
        this.visibleColumns = confList.filter(conf => !conf.hidden);

        this.#buildHeader();
        const thead = fr.nel('thead', {}, this.thead);
        this.#buildBody();
        const tbody = fr.nel("tbody", {}, ...this.rows);
        return fr.nel(
            'table',
            { class: ["sortable"], style: {width: `${width}`} },
            fr.nel('caption', {}, String(title)),
            thead,
            tbody
        );
    }
    #buildHeader() {
        this.thead = fr.nel("tr", {}, ...this.visibleColumns.map(conf => {
            const th = fr.nel("th", {}, String(conf.name));
            if (conf.sortable) {
                if (this.sortState.key === conf.field) {
                    th.attrs.class = `sort-${this.sortState.direction}`;
                } else {
                    th.attrs.class = 'sort-asc';
                }
                const sh = () => { this.#handleSort(conf.field); }
                th.handlers.push({en: "click", eh: sh});
            }
            return th;
        }));
    }
    #buildBody() {
        let index = 0;
        for (const row of this.props.data) {
            if (this.props.nod === index) {
                break;
            }
            const tr = fr.nel("tr",
                             {},
                             ...this.visibleColumns.map(conf => {
                                 return fr.nel("td", {}, String(row[conf.field]));
                             }));
            const dh = () => {
                fr.emit("fr:table-row-dblclick", {
                    confList: this.props.confList,
                    data: row,
                    index: index,
                });
            }
            const sh = () => {
                this.#removeBackground();
                if (! tr.attrs.hasOwnProperty("style")) {
                    tr.attrs["style"] = {background: this.bgcolor};
                } else {
                    tr.attrs.style["background"] = this.bgcolor;
                }
                tr.updateAttributes();
                fr.emit("fr:table-row-selected", {
                    confList: this.props.confList,
                    data: row,
                    index: index,
                });
            }
            tr.handlers.push({en: "dblclick", eh: dh});
            tr.handlers.push({en: "click", eh: sh})
            this.rows[index] = tr;
            // update conuter
            ++index;
        }
    }
    #handleSort(field) {
        if (this.sortState.key === field) {
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortState.key = field;
            this.sortState.direction = 'asc';
        }

        fr.emit('fr:table-col-sort', { sort_key: this.sortState.key, direction: this.sortState.direction });
    }
    #removeBackground() {
        for (let r of this.rows) {
            if (! r.attrs.hasOwnProperty("style") || ! r.attrs.style.hasOwnProperty("background")) continue;
            delete r.attrs.style["background"];
            // console.log(r.attrs);
            r.updateAttributes();
        }
    }
    /**
     * Updates the table with new data.
     * @param {Array<Object>} newData - The new data to display.
     */
    updateData(newData) {
        const parent = this.node.element.parentNode;
        if (parent) {
            parent.removeChild(this.node.element);
        }

        this.props.data = newData;
        this._node = this.#build();
        this.mount(parent);
    }
}

export {
    DataTable,
    tableData,
};
/* //<-- data-table.js ends here*/
