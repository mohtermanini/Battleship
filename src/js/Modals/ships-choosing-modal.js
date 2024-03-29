import ChoosingShipsTemplate from "../../html/templates/modals/ships-choosing-template.handlebars";
import ShipContainerTemplate from "../../html/templates/modals/ships-container-template.handlebars";
import Counter from "../ViewHelper/counter";
import PlayerViewHelper from "../Player/player-view-helper";
import FormHelper from "../ViewHelper/form";

export default class ChoosingShipsModal {
    // DOM Elements
    #modalContainerElement;

    #modalElement;

    #shipsElement;

    #pagesContainerElement;

    #pagesElements;

    #currentPageElement;

    #leftArrowElement;

    #rightArrowElement;

    // Properties
    #boardWidth;

    #boardHeight;

    #counters;

    #currentPage;

    #pagesNum;

    #btnSubmit;

    constructor(boardWidth, boardHeight) {
        this.cacheDOM();
        FormHelper.disableButton(this.#btnSubmit);
        this.#boardWidth = boardWidth;
        this.#boardHeight = boardHeight;
        this.#counters = {};
        this.createShipsPages();
        this.initPagination();
        this.updateMaxShipsChoosingNumber();
        this.bindEvents();
    }

    cacheDOM() {
        this.#modalContainerElement = new DOMParser().parseFromString(
            ChoosingShipsTemplate(),
            "text/html",
        ).body.firstElementChild;
        this.#modalElement = this.#modalContainerElement.firstElementChild;
        this.#shipsElement = this.#modalElement.querySelector(".ships");
        this.#pagesContainerElement = this.#shipsElement.querySelector(".pages-container");
        // Pagination Elements
        this.#pagesElements = this.#pagesContainerElement.children;
        this.#currentPageElement = this.#modalElement.querySelector(".current-page");
        this.#leftArrowElement = this.#modalElement.querySelector(".left-arrow");
        this.#rightArrowElement = this.#modalElement.querySelector(".right-arrow");
        // Options Elements
        this.#btnSubmit = this.#modalContainerElement.querySelector(".btn-submit");
    }

    bindEvents() {
        [
            ...this.#modalElement.querySelectorAll(".minus"),
            ...this.#modalElement.querySelectorAll(".plus"),
        ].forEach((element) => {
            element.addEventListener("click", () => {
                this.updateMaxShipsChoosingNumber();
            });
        });

        this.bindPaginationEvents();
    }

    /* Pagination */
    initPagination() {
        this.#currentPage = 1;
        this.#pagesNum = this.#pagesContainerElement.children.length;
        this.#modalElement.querySelector(".pages-num").textContent = this.#pagesNum;
        this.initPaginationStyle();
    }

    bindPaginationEvents() {
        this.#modalElement.querySelectorAll(".arrow-container").forEach((element) => {
            element.addEventListener("click", () => {
                if (element.contains(this.#leftArrowElement)) {
                    this.paginateLeft();
                } else if (element.contains(this.#rightArrowElement)) {
                    this.paginateRight();
                }
            });
        });
    }

    paginateLeft() {
        if (this.#currentPage === 1) {
            throw new Error("Illegal Argument Exception");
        }
        this.updatePaginationStyle("left");
        --this.#currentPage;
    }

    paginateRight() {
        if (this.#currentPage === this.#pagesNum) {
            throw new Error("Illegal Argument Exception");
        }
        this.updatePaginationStyle("right");
        ++this.#currentPage;
    }

    initPaginationStyle() {
        if (this.#currentPage === 1) {
            this.#leftArrowElement.closest(".arrow-container").classList.add("disabled");
        }
        if (this.#currentPage === this.#pagesNum) {
            this.#rightArrowElement.closest(".arrow-container").classList.add("disabled");
        }
    }

    updatePaginationStyle(direction = null) {
        if (direction !== null) {
            const translateValue = direction == "right" ? -100 : +100;
            this.filpPage(translateValue);
        }
        let nextPage = this.#currentPage;
        if (direction === null || direction === "right") {
            ++nextPage;
        } else {
            --nextPage;
        }
        if (nextPage === 1) {
            this.#leftArrowElement.closest(".arrow-container").classList.add("disabled");
        } else {
            this.#leftArrowElement.closest(".arrow-container").classList.remove("disabled");
        }
        if (nextPage === this.#pagesNum) {
            this.#rightArrowElement.closest(".arrow-container").classList.add("disabled");
        } else {
            this.#rightArrowElement.closest(".arrow-container").classList.remove("disabled");
        }
        this.#currentPageElement.textContent = nextPage;
    }

    filpPage(translate) {
        const n = this.#pagesElements.length;
        for (let i = 0; i < n; i++) {
            this.translatePage(this.#pagesElements[i], translate);
        }
    }

    translatePage(pageElement, translate) {
        const currentTransformValue = pageElement.style["transform"];
        let currentTranslateValue = 0;
        if (currentTransformValue.length > 0) {
            currentTranslateValue = parseInt(currentTransformValue.slice(11, currentTransformValue.length - 2), 10);
        }
        pageElement.style["transform"] = `translateX(${currentTranslateValue + translate}%)`;
    }

    /* ==================== */

    /* Create Ships Pages */
    createShipsPages() {
        const shipsPerPage = 4;
        for (let i = 1; i <= this.getMaxShipLength(); i += shipsPerPage) {
            this.#pagesContainerElement.append(this.createPage(i, shipsPerPage));
        }
    }

    createPage(firstShipLength, shipsNum) {
        const page = document.createElement("div");
        page.classList.add("page");
        for (let i = 0; i < shipsNum; i++) {
            const shipLength = firstShipLength + i;
            if (shipLength > this.getMaxShipLength()) {
                break;
            }
            page.append(this.createShipContainer(shipLength));
        }
        return page;
    }

    createShipContainer(shipLength) {
        const shipContainer = new DOMParser().parseFromString(
            ShipContainerTemplate({ shipLength, shipCount: 0 }),
            "text/html",
        ).body.firstElementChild;
        const shipElement = PlayerViewHelper.createShipElement(shipLength, 5);
        shipContainer.querySelector(".ship").replaceWith(shipElement);
        this.#counters[shipLength] = new Counter(shipContainer, 0, 0, 0);
        return shipContainer;
    }
    /* ==================== */

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

    getMaxShipLength() {
        return Math.max(this.#boardWidth, this.#boardHeight);
    }

    getShipsList() {
        const shipsList = {};
        this.#shipsElement.querySelectorAll(".ship-container").forEach((element) => {
            const shipLength = element.dataset.length;
            const count = parseInt(element.querySelector(".number").textContent, 10);
            if (count > 0) {
                shipsList[shipLength] = count;
            }
        });
        return shipsList;
    }
    /* ==================== */

    updateMaxShipsChoosingNumber() {
        const boardSize = this.#boardWidth * this.#boardHeight;
        let pickedShipBlocksSum = 0;
        Array.from(Object.keys(this.#counters)).forEach((key) => {
            pickedShipBlocksSum += this.#counters[key].currentNumber * key;
        });
        if (pickedShipBlocksSum > 0) {
            FormHelper.enableButton(this.#btnSubmit);
        } else {
            FormHelper.disableButton(this.#btnSubmit);
        }
        Array.from(Object.keys(this.#counters)).forEach((key) => {
            this.#counters[key].updateMax(
                this.#counters[key].currentNumber +
                Math.floor((boardSize - pickedShipBlocksSum) / key),
            );
        });
    }
}
