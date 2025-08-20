import "../../styles/frcl.scss";
import { table, tableOption } from "../../component/parts/table.js";

document.addEventListener("fr:row-edit-request", e => {
    console.log("fr:row-edit-request", e.detail);
});

document.addEventListener("fr:table-sort-request", e => {
    console.log("fr:table-sort-request", e.detail);
});

const app = document.getElementById("app");

const option = tableOption();
option.caption = "My Table";
option.colInfoList = [
    { field: "id", label: "ID", sortable: true, key: true, hidden: false },
    { field: "name", label: "Name", sortable: true, key: false, hidden: false },
    { field: "email", label: "Email", sortable: false, key: false, hidden: false },
    { field: "hidden_field", label: "Hidden", sortable: false, key: false, hidden: true },
];
option.rowList = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Doe", email: "jane@example.com" },
    { id: "3", name: "Peter Jones", email: "peter@example.com" },
];

const myTable = table(option);
myTable.mount(app);
