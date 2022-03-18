import Counter from "../ViewHelper/counter";
import GridSizeTemplate from "../../html/templates/modals/grid-size-template.handlebars";

export default class GridSizeModal {
    // DOM Elements
    #modalContainerElement;

    #modalElement;

    #boardElement;

    #widthNumberElement;

    #heightNumberElement;

    // Properties
    #boardWidth;

    #boardHeight;

    constructor(boardWidth, boardHeight) {
        this.cacheDOM();
        this.#boardWidth = boardWidth;
        this.#boardHeight = boardHeight;
        new Counter(this.#modalElement.querySelector(".width-counter"), 1, 10, this.#boardWidth);
        new Counter(this.#modalElement.querySelector(".height-counter"), 1, 10, this.#boardHeight);
        this.renderBoard();
        this.bindEvents();
    }

    cacheDOM() {
        this.#modalContainerElement = new DOMParser().parseFromString(
            GridSizeTemplate(),
            "text/html",
        ).body.firstElementChild;
        this.#modalElement = this.#modalContainerElement.firstElementChild;
        this.#widthNumberElement = this.#modalElement.querySelector(".width-counter .number");
        this.#heightNumberElement = this.#modalElement.querySelector(".height-counter .number");
        this.#boardElement = this.#modalContainerElement.querySelector(".board");
    }

    bindEvents() {
        [
            ...this.#modalElement.querySelectorAll(".minus"),
            ...this.#modalElement.querySelectorAll(".plus"),
        ].forEach((element) => {
            element.addEventListener("click", () => {
                this.#boardWidth = parseInt(this.#widthNumberElement.textContent, 10);
                this.#boardHeight = parseInt(this.#heightNumberElement.textContent, 10);
                this.renderBoard();
            });
        });
    }

    renderBoard() {
        this.#boardElement.innerHTML = "";
        // this.#boardElement.style["grid-template-columns"] = `repeat(${this.#boardWidth}, auto)`;
        this.#boardElement.style.setProperty("--board-horizontal-cells", this.#boardWidth);
        for (let i = 0; i < this.#boardWidth * this.#boardHeight; i++) {
            const block = document.createElement("div");
            block.classList.add("board-block");
            this.#boardElement.append(block);
        }
    }

    /* General Getters */
    get modalContainerElement() {
        return this.#modalContainerElement;
    }

    get modalElement() {
        return this.#modalElement;
    }

    getWidth() {
        return this.#boardWidth;
    }

    getHeight() {
        return this.#boardHeight;
    }
    /* #################### */
}
