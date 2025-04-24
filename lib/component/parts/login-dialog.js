/**
 * @file login-dialog.js
 *
 * @copyright © 2025 s3mat3
 * This code is licensed under the MIT License, see the LICENSE file for details
 *
 * @brief
 *
 * @author s3mat3
 */
"use strict";
import { Dialog, dialogOption } from "./dialog";
import { LabelInput, PasswordInput, labelInputOption } from "./fragment/label-input";
import * as fr from "../../core/fr";

/**
 * <dialog>
 *   <header>
 *     <span>Login</span>
 *     <span>cancel</span>
 *   </header>
 *   <div class="content">
 *   </div>
 *   <footer>
 *     <span></span>
 *     <button><span>login</span></button>
 *   </footer>
 * </dialog>
 */
class LoginDialog extends fr.Component {
    /** @type { Function } fn */
    #fn = undefined;
    constructor() {
        super();
        const lio = labelInputOption();
        lio.input.placeholder = "Your ID";
        lio.input.class = ["is-primary"];
        this.id = new LabelInput("ID:", lio);

        const lip = labelInputOption("is-normal", "password_2", "right");
        lip.input.placeholder = "Enter your password";
        lip.input.type = "password";
        lip.input.class.push("is-primary");
        this.pw = new PasswordInput("Password", lip);
        this.button = fr.nel("button",
                             {
                                 class: ["col-4", "is-primary", "is-normal"],
                             },
                             fr.nel("span", {}, "login"));
        const f = fr.nel("div", {class: ["row"]},
                         fr.element`<p class="col-4"></p>`,
                         this.button,
                         fr.element`<p class="col-4"></p>`
                        );
        const c = fr.nel("div", {}, this.id.node, this.pw.node);
        const o = dialogOption(true);
        o.dialog.style.width = "40vw";
        this._parts = new Dialog("LOGIN", o, c, f);
    }

    get icon() {
        return this._parts.header.icon;
    }

    open() {
        this.pw.init(true);
        const f = (this.#fn) ? this.#fn : this.onClick.bind(this);
        fr.setEvent(this.button.element, "click", f);
        this.#fn = f;
        this._parts.open();
    }

    close() {
        this.id.value="";
        this.pw.value="";
        this._parts.close();
    }

    onClick(e) {
        fr.emit("fr:login-request", {id: this.id.value, pw: this.pw.value});
        this.close();
    }
}

const loginDialog = () => {
    return new LoginDialog();
}

export {
    LoginDialog,
    loginDialog,
}
/* //<-- login-dialog.js ends here*/
