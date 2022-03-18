import GameboardView from "../Gameboard/gameboard-view";
import template from "../../html/templates/player-template.handlebars";
import PlayerViewHelper from "./player-view-helper";

export default class PlayerView {
    // DOM Elements
    #playerAreaElement;

    // Properties
    #gameView;

    #boardView;

    #playerName;

    constructor(gameView, shipsList, boardWidth, boardHeight, playerName) {
        this.#gameView = gameView;
        this.#playerName = playerName;
        this.render(shipsList);
        this.cacheDOM();
        this.createBoard(boardWidth, boardHeight, shipsList);
        this.initShipsRemained(shipsList);
        this.initScore();
        this.bindEvents();
    }

    cacheDOM() {
        this.cacheTurnDOM();
        this.cacheShipsRemainedDOM();
        this.cacheScoreDOM();
        this.cacheDarkeningDOM();
    }

    render() {
        this.#playerAreaElement = document.createElement("div");
        this.#playerAreaElement.classList.add("player-area");
        this.#playerAreaElement.innerHTML = template({});
    }

    createBoard(boardWidth, boardHeight, shipsList) {
        this.#boardView = new GameboardView(boardWidth, boardHeight, this, shipsList);
        this.#playerAreaElement
            .querySelector(".board")
            .replaceWith(this.#boardView.getBoardElement());
    }

    bindEvents() {
        this.bindShipsRemainedEvents();
    }

    /* Ships Remained */
    #shipsRemainedElement;

    #shipsElement;

    initShipsRemained(shipsList) {
        this.addShipsToshipsRemainedElement(shipsList);
        this.initShipsRemainedPagination();
    }

    cacheShipsRemainedDOM() {
        this.#shipsRemainedElement = this.#playerAreaElement.querySelector(
            ".ships-remained-container-responsive",
        );
        this.#shipsElement = this.#shipsRemainedElement.querySelector(".ships");
        this.cacheShipsRemainedPaginationDOM();
    }

    bindShipsRemainedEvents() {
        this.#infoElement.addEventListener("mouseenter", this.mouseEnterInfo.bind(this));
        this.#infoElement.addEventListener("mouseleave", this.mouseLeaveInfo.bind(this));
        this.bindShipsRemainedPaginationEvents();
    }

    addShipsToshipsRemainedElement(shipsList) {
        const shipsListCount = {};
        Object.keys(shipsList).forEach((key) => {
            const length = shipsList[key].length;
            if (!shipsListCount[length]) {
                shipsListCount[length] = 0;
            }
            ++shipsListCount[length];
        });
        const sortedShipListKeys = Object.keys(shipsListCount).sort((a, b) => a - b);
        sortedShipListKeys.forEach((key) => {
            this.#shipsElement.append(
                PlayerViewHelper.createShipContainerElement(key, shipsListCount[key]),
            );
        });
    }

    sinkShip(length) {
        const element = this.#shipsRemainedElement.querySelector(`[data-length="${length}"]`);
        const countElement = element.querySelector(".count");
        const left = parseInt(countElement.textContent, 10) - 1;
        if (left === 0) {
            element.remove();
        } else {
            countElement.textContent = left;
        }
    }

    mouseEnterInfo() {
        this.#shipsRemainedElement.classList.add("help");
    }

    mouseLeaveInfo() {
        this.#shipsRemainedElement.classList.remove("help");
    }
    /* ==================== */

    /* Ships Remained Pagination */
    #stopScrolling;

    #infoElement;

    #leftArrowContainerElement;

    #leftArrowElement;

    #rightArrowContainerElement;

    #rightArrowElement;

    initShipsRemainedPagination() {
        requestAnimationFrame(() => {
            this.toggleArrowsState();
            this.toggleArrowsState();
        });
    }

    cacheShipsRemainedPaginationDOM() {
        this.#infoElement = this.#shipsRemainedElement.querySelector(".info");
        this.#leftArrowElement = this.#shipsRemainedElement.querySelector(".left-arrow");
        this.#leftArrowContainerElement = this.#leftArrowElement.parentElement;
        this.#rightArrowElement = this.#shipsRemainedElement.querySelector(".right-arrow");
        this.#rightArrowContainerElement = this.#rightArrowElement.parentElement;
    }

    bindShipsRemainedPaginationEvents() {
        const scrollStep = 180;

        this.#leftArrowContainerElement.addEventListener("pointerdown", () => {
            this.scroll(-scrollStep);
        });

        this.#rightArrowContainerElement.addEventListener("pointerdown", () => {
            this.scroll(scrollStep);
        });

        this.#leftArrowContainerElement.addEventListener("pointerup", () => {
            this.stopScrolling();
        });

        this.#rightArrowContainerElement.addEventListener("pointerup", () => {
            this.stopScrolling();
        });
    }

    scroll(value) {
        const targetDistance = this.getResponsiveScroll() + value;
        const scrollDirection = value > 0 ? "right" : "left";
        this.#stopScrolling = false;
        if (this.checkIfScreenSmall()) {
            this.#shipsElement.scrollTop += value;
        } else {
            this.#shipsElement.scrollLeft += value;
        }
        new Promise((resolve, reject) => {
            this.keepScrolling(resolve, reject, targetDistance, scrollDirection);
        })
            .then(() => {
                this.scroll(value);
            })
            .catch(() => {})
            .finally(() => {
                this.toggleArrowsState();
            });
    }

    keepScrolling(resolve, reject, targetDistance, scrollDirection) {
        if (this.getResponsiveScroll() === targetDistance) {
            resolve();
            return;
        }
        if (
            this.#stopScrolling ||
            (scrollDirection === "left" && this.checkIfLeftMostReached()) ||
            (scrollDirection === "right" && this.checkIfRightMostReached())
        ) {
            reject();
            return;
        }
        requestAnimationFrame(() => {
            this.keepScrolling(resolve, reject, targetDistance, scrollDirection);
        });
    }

    checkIfLeftMostReached() {
        return this.getResponsiveScroll() === 0;
    }

    checkIfRightMostReached() {
        if (this.checkIfScreenSmall()) {
            return (
                this.#shipsElement.scrollHeight - this.#shipsElement.clientHeight ===
                this.#shipsElement.scrollTop
            );
        }
        return (
            this.#shipsElement.scrollWidth - this.#shipsElement.clientWidth ===
            this.#shipsElement.scrollLeft
        );
    }

    toggleArrowsState() {
        if (this.checkIfLeftMostReached()) {
            this.#leftArrowContainerElement.classList.add("disabled");
        } else {
            this.#leftArrowContainerElement.classList.remove("disabled");
        }
        if (this.checkIfRightMostReached()) {
            this.#rightArrowContainerElement.classList.add("disabled");
        } else {
            this.#rightArrowContainerElement.classList.remove("disabled");
        }
    }

    stopScrolling() {
        this.#stopScrolling = true;
    }

    getResponsiveScroll() {
        if (this.checkIfScreenSmall()) {
            return this.#shipsElement.scrollTop;
        }
        return this.#shipsElement.scrollLeft;
    }

    checkIfScreenSmall() {
        return getComputedStyle(this.#leftArrowContainerElement).transform !== "none";
    }

    /* ==================== */

    /* Turn */
    #turnLabelElement;

    cacheTurnDOM() {
        this.#turnLabelElement = this.#playerAreaElement.querySelector(".turn-container");
    }

    setTurn() {
        this.showTurnLabel();
        this.darken();
    }

    unsetTurn() {
        this.hideTurnLabel();
        this.removeDarkening();
    }

    showTurnLabel() {
        this.#turnLabelElement.classList.add("active");
    }

    hideTurnLabel() {
        this.#turnLabelElement.classList.remove("active");
    }
    /* ==================== */

    /* Score */
    #scoreElement;

    #playerNameElement;

    #winsElement;

    #lossesElement;

    initScore() {
        this.setPlayerName(this.#playerName);
    }

    cacheScoreDOM() {
        this.#scoreElement = this.#playerAreaElement.querySelector(".score-container");
        this.#playerNameElement = this.#scoreElement.querySelector(".name");
        this.#winsElement = this.#scoreElement.querySelector(".wins");
        this.#lossesElement = this.#scoreElement.querySelector(".losses");
    }

    setPlayerName(value) {
        this.#playerNameElement.textContent = value;
    }

    setWins(value) {
        this.#winsElement.textContent = value;
    }

    increaseWins() {
        this.#winsElement.textContent = parseInt(this.#winsElement.textContent, 10) + 1;
    }

    setLosses(value) {
        this.#lossesElement.textContent = value;
    }

    increaseLosses() {
        this.#lossesElement.textContent = parseInt(this.#lossesElement.textContent, 10) + 1;
    }

    showScore() {
        this.#scoreElement.classList.add("active");
    }

    hideScore() {
        this.#scoreElement.classList.remove("active");
    }
    /* ==================== */

    /* General Getters */
    get gameView() {
        return this.#gameView;
    }

    get boardView() {
        return this.#boardView;
    }

    getPlayerAreaElement() {
        return this.#playerAreaElement;
    }
    /* ==================== */

    /* Darkening */
    #darkeningElement;

    cacheDarkeningDOM() {
        this.#darkeningElement = this.#playerAreaElement.querySelector(".darkening");
    }

    darken() {
        this.#darkeningElement.classList.add("active");
    }

    removeDarkening() {
        this.#darkeningElement.classList.remove("active");
    }

    /* ==================== */

    showWinLabel() {
        this.#turnLabelElement.firstElementChild.innerText = "You Won";
        this.showTurnLabel();
    }

    showLoseLabel() {
        this.#turnLabelElement.firstElementChild.innerText = "You Lost";
        this.showTurnLabel();
    }

    disableBoard() {
        this.#boardView.disableBoard();
    }

    enableBoard() {
        this.#boardView.enableBoard();
    }
}
