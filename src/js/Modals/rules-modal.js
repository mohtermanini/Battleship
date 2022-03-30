import RulesTemplate from "../../html/templates/modals/rules-template.handlebars";

export default class RulesModal {
    // DOM Elements
    #modalContainerElement;

    #modalElement;

    constructor() {
        this.cacheDOM();
    }

    cacheDOM() {
        this.#modalContainerElement = new DOMParser().parseFromString(
            RulesTemplate(),
            "text/html",
        ).body.firstElementChild;
        this.#modalElement = this.#modalContainerElement.firstElementChild;
    }

    /* General Getters */
    get modalContainerElement() {
        return this.#modalContainerElement;
    }

    get modalElement() {
        return this.#modalElement;
    }
    /* #################### */
}
