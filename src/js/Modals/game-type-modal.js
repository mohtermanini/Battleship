import GameTypeTemplate from "../../html/templates/modals/game-type-template.handlebars";

export default class GameTypeModal {
    // DOM Elements
    #modalContainerElement;

    #modalElement;

    #form;

    // Properties
    #humanNumber;

    constructor() {
        this.cacheDOM();
        this.setHumanNumber();
        this.bindEvents();
    }

    cacheDOM() {
        this.#modalContainerElement = new DOMParser().parseFromString(
            GameTypeTemplate(),
            "text/html",
        ).body.firstElementChild;
        this.#modalElement = this.#modalContainerElement.firstElementChild;
        this.#form = this.#modalElement.querySelector("#form-game-type");
    }

    bindEvents() {
        this.#form.addEventListener("change", this.setHumanNumber.bind(this));
    }

    /* General Getters */
    get modalContainerElement() {
        return this.#modalContainerElement;
    }

    get modalElement() {
        return this.#modalElement;
    }

    gethumanNumber() {
        return this.#humanNumber;
    }
    /* #################### */

    setHumanNumber() {
        this.#humanNumber = parseInt(this.#form["game-type"].value, 10);
    }
}
