import GameboardController from "../Gameboard/gameboard-controller";
import Gameboard from "../Gameboard/gameboard-model";
import playerViewHelper from "../Player/player-view-helper";
import PlacingShipsTemplate from "../../html/templates/modals/ships-placing-template.handlebars";
import ShipContainerTemplate from "../../html/templates/modals/ships-container-placing-modal-template.handlebars";
import FormHelper from "../ViewHelper/form";
import BoardHelper from "../ViewHelper/board";

export default class ShipsPlacingModal {
    // DOM Elements
    #modalContainerElement;

    #modalElement;

    #pauseContainerElement;

    #btnAutoPlace;

    #autoPlaceErrorElement;

    #btnSubmit;

    // Properties
    #shipId;

    #boardWidth;

    #boardHeight;

    #shipsList;

    #allShipsList;

    #currentPlayerNum;

    constructor(playersNum, currentPlayerNum, shipsList, boardWidth, boardHeight, isFirstRound) {
        this.#boardWidth = boardWidth;
        this.#boardHeight = boardHeight;
        this.#currentPlayerNum = currentPlayerNum;
        let playerLabel = "Player";
        if (currentPlayerNum === 1 && playersNum > 1) {
            playerLabel = "First Player";
        }
        if (currentPlayerNum === 2) {
            playerLabel = "Second Player";
        }
        this.#shipsPlaced = 0;
        this.#shipId = 1;
        this.#allShipsList = shipsList;
        this.#shipsList = {};

        this.cacheDOM(playerLabel);
        this.initPlayerArea(isFirstRound);
        this.initShipsArea(shipsList);
        this.initPagination();
        this.initBoardArea();
        // Options Elements
        FormHelper.disableButton(this.#btnSubmit);

        // Events
        this.bindEvents();
    }

    cacheDOM(playerLabel) {
        this.#modalContainerElement = new DOMParser().parseFromString(
            PlacingShipsTemplate({
                playerLabel,
            }),
            "text/html",
        ).body.firstElementChild;
        this.#modalElement = this.#modalContainerElement.firstElementChild;
        this.#pauseContainerElement = document.querySelector(".pause-container");
        this.#btnAutoPlace = this.#modalElement.querySelector(".btn-auto-place");
        this.#autoPlaceErrorElement = this.#btnAutoPlace.nextElementSibling;
        this.#btnSubmit = this.#modalElement.querySelector(".btn-submit");
        this.cachePlayerAreaDOM();
        this.cacheShipsAreaDOM();
        this.cachePaginationDOM();
        this.cacheBoardAreaDOM();
    }

    bindEvents() {
        this.bindPlayerAreaEvents();
        this.bindShipsAreaEvents();
        this.bindPaginationEvents();
        this.bindBoardAreaEvents();
    }

    /* Player Area */
    #playerNameSectionElement;

    #playerNameElement;

    initPlayerArea(isFirstRound) {
        if (!isFirstRound) {
            const hr = this.#playerNameSectionElement.nextElementSibling;
            this.#playerNameSectionElement.remove();
            hr.remove();
        }
    }

    cachePlayerAreaDOM() {
        this.#playerNameSectionElement = this.#modalElement.querySelector(".section-player-name");
        this.#playerNameElement = this.#playerNameSectionElement.querySelector("input[name]");
    }

    bindPlayerAreaEvents() {
        this.#playerNameElement.addEventListener("keypress", this.onKeyPressPlayerName.bind(this));
    }

    onKeyPressPlayerName(e) {
        if (this.checkIfMaxPlayerNameReached()) {
            e.preventDefault();
        }
    }

    checkIfMaxPlayerNameReached() {
        const maxLength = 15;
        const currentLength = this.#playerNameElement.value.length;
        return currentLength === maxLength;
    }

    getPlayerName() {
        const name = this.#playerNameElement.value;
        return name === "" ? `Player${this.#currentPlayerNum}` : name;
    }
    /* ==================== */

    /* Ships Area */
    // DOM Elements
    #shipsContainersElements;

    #shipsNumbersElements;

    #activeShipElement;

    // Properties
    #activeShipLength;

    #totalShips;

    /* the ship thats is not confirmed to be placed yet
        (just to show how the ship will be placed on board)
    */
    #tempShip;

    initShipsArea(shipsList) {
        this.#shipsContainersElements = {};
        this.#shipsNumbersElements = {};
        this.createShipsPages(shipsList);
        this.#totalShips = 0;
        Object.keys(this.#shipsNumbersElements).forEach((shipLength) => {
            this.#totalShips += parseInt(this.#shipsNumbersElements[shipLength].textContent, 10);
        });
        this.setActiveShip(this.#modalElement.querySelector(".ship-compressed"));
        this.createTempShip(this.#activeShipLength);
    }

    bindShipsAreaEvents() {
        this.#modalElement.querySelectorAll(".page .ship-block").forEach((element) => {
            element.addEventListener("click", () => {
                this.setActiveShip(element.closest(".ship-compressed"));
                if (this.#activeOrientationIsVertical === null) {
                    this.setPlaceOptionActive("h");
                }
            });
        });
    }

    cacheShipsAreaDOM() {
        this.#pagesContainerElement = this.#modalElement.querySelector(".pages-container");
    }

    increaseShipCount(shipLength) {
        const currentCount = parseInt(this.#shipsNumbersElements[shipLength].textContent, 10);
        this.#shipsNumbersElements[shipLength].textContent = currentCount + 1;
    }

    decreaseShipCount(shipLength) {
        const currentCount = parseInt(this.#shipsNumbersElements[shipLength].textContent, 10);
        if (currentCount === 0) {
            throw new Error();
        }
        this.#shipsNumbersElements[shipLength].textContent = currentCount - 1;
    }

    resetAllShipsCount() {
        Object.keys(this.#shipsNumbersElements).forEach((shipLength) => {
            this.#shipsNumbersElements[shipLength].textContent = 0;
        });
    }

    setActiveShip(ship) {
        if (ship === this.#activeShipElement) {
            return;
        }
        if (this.#activeShipElement) {
            this.#activeShipElement.classList.remove("active");
        }
        this.#activeShipElement = ship.closest(".ship-compressed");
        this.#activeShipElement.classList.add("active");
        const activeShipContainer = this.#activeShipElement.closest(".ship-container");
        const shipLength = parseInt(activeShipContainer.dataset.length, 10);
        this.#activeShipLength = shipLength;
        const shipCount = parseInt(this.#shipsNumbersElements[shipLength].textContent, 10);
        if (shipCount !== 0) {
            this.createTempShip(this.#activeShipLength);
        }
    }

    createShipsPages(shipsList) {
        const keys = Object.keys(shipsList).sort((a, b) => a - b);
        const shipsPerPage = 4;
        for (let i = 0; i < keys.length; i += shipsPerPage) {
            this.#pagesContainerElement.append(this.createPage(i, shipsPerPage, keys, shipsList));
        }
    }

    createPage(firstShipIndex, shipsNum, keys, shipsList) {
        const page = document.createElement("div");
        page.classList.add("page");
        for (let i = 0; i < shipsNum && firstShipIndex + i < keys.length; i++) {
            const shipLength = keys[firstShipIndex + i];
            const shipCount = shipsList[shipLength];
            const shipContainer = this.createShipContainer(shipLength, shipCount);
            page.append(shipContainer);
            this.#shipsContainersElements[shipLength] = shipContainer;
            this.#shipsNumbersElements[shipLength] = shipContainer.querySelector(".number");
        }
        return page;
    }

    createShipContainer(shipLength, shipCount) {
        const shipContainer = new DOMParser().parseFromString(
            ShipContainerTemplate({ shipLength, shipCount }),
            "text/html",
        ).body.firstElementChild;
        const shipElement = playerViewHelper.createShipElement(shipLength, 1);
        shipContainer.querySelector(".ship").replaceWith(shipElement);
        return shipContainer;
    }

    createTempShip(length) {
        this.#tempShip = BoardHelper.createShipElement(length);
        this.#tempShip.classList.add("temp-ship");
    }

    /* ==================== */

    /*  Place Ships */
    #shipsPlaced;

    bindPlaceShipsEvents() {
        this.#boardElement.addEventListener("click", (e) => {
            const block = e.target;
            if (block.classList.contains("board-block")) {
                this.onClickPlaceShipOnBoard(e);
            }
        });
        this.#boardElement.querySelectorAll(".board-block").forEach((block) => {
            block.addEventListener("mouseenter", this.OnMouseEnterBoardBlock.bind(this));
            block.addEventListener("mouseleave", this.onMouseLeaveBoardBlock.bind(this));
        });
        this.#btnAutoPlace.addEventListener("click", () => {
            this.#pauseContainerElement.classList.add("active", "front");
            this.#pauseContainerElement.addEventListener(
                "transitionend",
                () => {
                    const isPlaced = this.autoPlaceShips.call(this);
                    if (!isPlaced) {
                        this.#autoPlaceErrorElement.classList.remove("d-none");
                    } else {
                        this.#autoPlaceErrorElement.classList.add("d-none");
                    }
                    this.#pauseContainerElement.classList.remove("active", "front");
                },
                { once: true },
            );
        });
    }

    placeShipOnBoard(row, col, length, isVertical) {
        if (!this.canPlaceShip(length, row, col, isVertical)) {
            throw new Error();
        }
        const currentId = this.#shipId++;
        this.#shipsList[currentId] = {
            row,
            col,
            length,
            isVertical,
        };
        BoardHelper.createShipOnBoard(
            this.#boardElement,
            this.#boardWidth,
            row,
            col,
            length,
            isVertical,
            currentId,
        );
        this.decreaseShipCount(length);
        this.setEmptyCells(row, col, length, isVertical, false);
        ++this.#shipsPlaced;
        if (this.#shipsPlaced === this.#totalShips) {
            FormHelper.enableButton(this.#btnSubmit);
        }
    }

    onClickPlaceShipOnBoard(e) {
        if (this.#activeOrientationIsVertical === null) {
            return;
        }
        const block = e.target;
        const blockIndex = BoardHelper.getBlockIndexFromBlockElement(this.#boardElement, block);
        const isVertical = this.#activeOrientationIsVertical;
        const [row, col] = BoardHelper.getCoordinatesFromBlockIndex(blockIndex, this.#boardWidth);
        if (!this.canPlaceShip(this.#activeShipLength, row, col, isVertical)) {
            return;
        }
        this.placeShipOnBoard(row, col, this.#activeShipLength, isVertical);
    }

    OnMouseEnterBoardBlock(e) {
        if (this.#activeOrientationIsVertical === null) {
            return;
        }
        const block = e.target;
        const blockIndex = BoardHelper.getBlockIndexFromBlockElement(this.#boardElement, block);
        const isVertical = this.#activeOrientationIsVertical;
        const [row, col] = BoardHelper.getCoordinatesFromBlockIndex(blockIndex, this.#boardWidth);
        if (!this.canPlaceShip(this.#activeShipLength, row, col, isVertical)) {
            return;
        }
        BoardHelper.createShipOnBoard(
            this.#boardElement,
            this.#boardWidth,
            row,
            col,
            this.#activeShipLength,
            isVertical,
            undefined,
            this.#tempShip,
        );
    }

    onMouseLeaveBoardBlock() {
        if (this.#activeOrientationIsVertical === null) {
            return;
        }
        if (this.#tempShip !== null) {
            this.#tempShip.remove();
        }
    }

    canPlaceShip(length, row, col, isVertical) {
        if (parseInt(this.#shipsNumbersElements[length].textContent, 10) === 0) {
            return false;
        }
        if (isVertical && row + length - 1 >= this.#boardHeight) {
            return false;
        }
        if (!isVertical && col + length - 1 >= this.#boardWidth) {
            return false;
        }
        for (let i = 0; i < length; i++) {
            if (isVertical && this.#emptyCells[row + i][col] !== true) {
                return false;
            }
            if (!isVertical && this.#emptyCells[row][col + i] !== true) {
                return false;
            }
        }
        return true;
    }

    autoPlaceShips() {
        this.removeAllShipsFromBoard();
        const tempBoard = Gameboard(this.#boardWidth, this.#boardHeight);
        Object.keys(this.#allShipsList).forEach((shipLength) => {
            for (let i = 0; i < this.#allShipsList[shipLength]; i++) {
                GameboardController.addShip(tempBoard, parseInt(shipLength, 10));
            }
        });
        const isPlaced = GameboardController.autoPlaceShips(tempBoard);
        if (isPlaced) {
            const shipsArray = tempBoard.getShips();
            shipsArray.forEach((element, index) => {
                this.placeShipOnBoard(
                    element.row,
                    element.col,
                    tempBoard.getShip(index).getLength(),
                    element.isVertical,
                );
            });
        }
        return isPlaced;
    }

    setEmptyCells(row, col, length, isVertical, value) {
        for (let i = 0; i < length; i++) {
            if (isVertical) {
                this.#emptyCells[row + i][col] = value;
            } else {
                this.#emptyCells[row][col + i] = value;
            }
        }
    }
    /* ==================== */

    /*  Remove Ships */
    bindRemoveShipsEvents() {
        this.#boardElement.addEventListener("click", (e) => {
            const block = e.target;
            if (block.classList.contains("ship-block")) {
                this.onClickRemoveShipFromBoard(e);
            }
        });
    }

    removeShipFromBoardById(id) {
        this.#boardElement.querySelector(`.ship[data-id='${id}']`).remove();
        this.increaseShipCount(this.#shipsList[id].length);
        this.setEmptyCells(
            this.#shipsList[id].row,
            this.#shipsList[id].col,
            this.#shipsList[id].length,
            this.#shipsList[id].isVertical,
            true,
        );
        delete this.#shipsList[id];
        --this.#shipsPlaced;
        FormHelper.disableButton(this.#btnSubmit);
    }

    removeAllShipsFromBoard() {
        Object.keys(this.#shipsList).forEach((id) => {
            this.removeShipFromBoardById(id);
        });
    }

    onClickRemoveShipFromBoard(e) {
        if (this.#activeOrientationIsVertical !== null) {
            return;
        }
        const block = e.target;
        const ship = block.closest(".ship");
        this.removeShipFromBoardById(ship.dataset.id);
    }
    /* ==================== */

    /* Board Area */
    // DOM Elements
    #boardElement;

    #emptyCells;

    #placeOptionsElement;

    #btnVertical;

    #btnHorizontal;

    #btnRemove;

    // Properties
    #activeOrientationIsVertical;

    initBoardArea() {
        this.#activeOrientationIsVertical = false;
        this.renderBoard();
        this.#emptyCells = [];
        for (let i = 0; i < this.#boardHeight; i++) {
            this.#emptyCells.push([]);
            for (let j = 0; j < this.#boardWidth; j++) {
                this.#emptyCells[i].push(true);
            }
        }
    }

    cacheBoardAreaDOM() {
        this.#boardElement = this.#modalElement.querySelector(".board");
        this.#placeOptionsElement = this.#modalElement.querySelector(".place-options");
        this.#btnHorizontal = this.#placeOptionsElement.querySelector(".btn-h");
        this.#btnVertical = this.#placeOptionsElement.querySelector(".btn-v");
        this.#btnRemove = this.#placeOptionsElement.querySelector(".btn-remove");
    }

    bindBoardAreaEvents() {
        this.#btnHorizontal.addEventListener("click", this.onClickSetPlaceOptionActive.bind(this));
        this.#btnVertical.addEventListener("click", this.onClickSetPlaceOptionActive.bind(this));
        this.#btnRemove.addEventListener("click", this.onClickSetPlaceOptionActive.bind(this));
        this.bindPlaceShipsEvents();
        this.bindRemoveShipsEvents();
    }

    onClickSetPlaceOptionActive(e) {
        const buttonElement = e.target.closest("button");
        if (buttonElement === this.#btnHorizontal) {
            this.setPlaceOptionActive("h");
        } else if (buttonElement === this.#btnVertical) {
            this.setPlaceOptionActive("v");
        } else if (buttonElement === this.#btnRemove) {
            this.setPlaceOptionActive("x");
        }
    }

    setPlaceOptionActive(option) {
        this.#btnHorizontal.classList.remove("active");
        this.#btnVertical.classList.remove("active");
        this.#btnRemove.classList.remove("active");

        let activeButton;
        if (option === "h") {
            this.#activeOrientationIsVertical = false;
            activeButton = this.#btnHorizontal;
        } else if (option === "v") {
            this.#activeOrientationIsVertical = true;
            activeButton = this.#btnVertical;
        } else if (option === "x") {
            this.#activeOrientationIsVertical = null;
            activeButton = this.#btnRemove;
        }
        activeButton.classList.add("active");
    }

    renderBoard() {
        this.#boardElement.style.setProperty("--board-horizontal-cells", this.#boardWidth);
        for (let i = 0; i < this.#boardWidth * this.#boardHeight; i++) {
            const block = document.createElement("div");
            block.classList.add("board-block");
            this.#boardElement.append(block);
        }
    }

    /* ==================== */

    /* Pagination */
    // DOM Elements
    #pagesContainerElement;

    #currentPageElement;

    #leftArrowElement;

    #rightArrowElement;

    // Properties
    #currentPage;

    #pagesNum;

    #pageWidth;

    initPagination() {
        this.#currentPage = 1;
        this.#pagesNum = this.#pagesContainerElement.children.length;
        this.#modalElement.querySelector(".pages-num").textContent = this.#pagesNum;
        this.#pageWidth = "100%";
        this.updatePaginationStyle();
    }

    cachePaginationDOM() {
        this.#currentPageElement = this.modalElement.querySelector(".current-page");
        this.#leftArrowElement = this.#modalElement.querySelector(".left-arrow");
        this.#rightArrowElement = this.#modalElement.querySelector(".right-arrow");
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
        --this.#currentPage;
        this.updatePaginationStyle();
    }

    paginateRight() {
        if (this.#currentPage === this.#pagesNum) {
            throw new Error("Illegal Argument Exception");
        }
        ++this.#currentPage;
        this.updatePaginationStyle();
    }

    updatePaginationStyle() {
        this.#pagesContainerElement.style.right = `calc(${this.#currentPage - 1} * ${
            this.#pageWidth
        })`;
        if (this.#currentPage === 1) {
            this.#leftArrowElement.closest(".arrow-container").classList.add("disabled");
        } else {
            this.#leftArrowElement.closest(".arrow-container").classList.remove("disabled");
        }
        if (this.#currentPage === this.#pagesNum) {
            this.#rightArrowElement.closest(".arrow-container").classList.add("disabled");
        } else {
            this.#rightArrowElement.closest(".arrow-container").classList.remove("disabled");
        }
        this.#currentPageElement.textContent = this.#currentPage;
    }
    /* ==================== */

    /* General Getters */
    get modalContainerElement() {
        return this.#modalContainerElement;
    }

    get modalElement() {
        return this.#modalElement;
    }

    getShipsList() {
        return this.#shipsList;
    }
    /* ==================== */
}
