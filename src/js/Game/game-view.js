import ChoosingShipsModal from "../Modals/ships-choosing-modal";
import GameTypeModal from "../Modals/game-type-modal";
import GridSizeModal from "../Modals/grid-size-modal";
import ShipsPlacingModal from "../Modals/ships-placing-modal";
import GameArena from "../../html/templates/game-arena.handlebars";
import PlayerView from "../Player/player-view";
import GameController from "./game-controller";
import ContainerHelper from "../ViewHelper/container";

export default class GameView {
    // DOM Elements
    #game;

    #rootElement;

    #gameArenaElement;

    #roundsElement;

    #roundsTextElement;

    #roundsNumberElement;

    #pauseContainerElement;

    // Properties
    #id;

    #playersViews;

    #humanNumber;

    #boardWidth;

    #boardHeight;

    #shipsList;

    #players;

    #currentModalIndex;

    constructor(game, parent, id) {
        this.#game = game;
        this.#id = id;
        this.createRootElement(this.#id);
        this.createPauseContainer();
        parent.append(this.#rootElement);
    }

    createRootElement() {
        this.#rootElement = document.createElement("div");
        this.#rootElement.classList.add("game-container");
        this.#rootElement.dataset.gameId = this.#id;
    }

    createPauseContainer() {
        this.#pauseContainerElement = ContainerHelper.createPauseContainer();
        this.#rootElement.append(this.#pauseContainerElement);
    }

    get game() {
        return this.#game;
    }

    /* Game Arena */
    createGameArena() {
        this.cacheGameArenaDOM();
        this.createPlayersViews();
        this.#firstPlayerArenaElement.append(this.getPlayerView(0).getPlayerAreaElement());
        this.#secondPlayerArenaElement.append(this.getPlayerView(1).getPlayerAreaElement());
        this.#rootElement.append(this.#gameArenaElement);
        this.createStartGameLabel();
    }

    cacheGameArenaDOM() {
        this.#gameArenaElement = new DOMParser().parseFromString(
            GameArena(),
            "text/html",
        ).body.firstElementChild;
        this.#roundsElement = this.#gameArenaElement.querySelector(".rounds-container");
        this.#roundsTextElement = this.#roundsElement.querySelector("p");
        this.#roundsNumberElement = this.#roundsTextElement.querySelector(".round-num");
        this.cachePlayersAreasDOM();
    }

    /* ==================== */
    endGame(winnerIndex) {
        setTimeout(() => {
            for (let i = 0; i < this.#playersViews.length; i++) {
                this.#playersViews[i].hideTurnLabel();
                this.#playersViews[i].disableBoard();
                this.#playersViews[i].removeDarkening();
                if (i === winnerIndex) {
                    this.#playersViews[i].showWinLabel();
                    this.#playersViews[i].increaseWins();
                } else {
                    this.#playersViews[i].showLoseLabel();
                    this.#playersViews[i].increaseLosses();
                }
            }
            this.createNextGameLabel();
            this.#pauseContainerElement.classList.add("semi-active");
        }, 300);
    }

    /* Next Game Button */
    #nextGameContainerElement;

    createNextGameLabel() {
        this.#nextGameContainerElement = document.createElement("div");
        this.#nextGameContainerElement.classList.add("next-game-container");
        const btnNextGame = document.createElement("button");
        btnNextGame.textContent = "Next Game";
        this.#nextGameContainerElement.append(btnNextGame);
        this.#rootElement.append(this.#nextGameContainerElement);
        this.bindNextGameButtonEvents(btnNextGame);
        ContainerHelper.displayWoodenContainer(this.#rootElement, this.#nextGameContainerElement);
    }

    bindNextGameButtonEvents(button) {
        button.addEventListener("click", this.NextGameButtonClick.bind(this));
        button.addEventListener("mouseenter", this.displayScores.bind(this));
        button.addEventListener("mouseleave", this.hideScores.bind(this));
    }

    async NextGameButtonClick() {
        await ContainerHelper.removeWoodenContainer(this.#nextGameContainerElement);
        GameController.generateNextRound(this.#game, this);
    }

    /* ==================== */

    /* Start Game Button */
    #startGameContainerElement;

    createStartGameLabel() {
        this.#startGameContainerElement = document.createElement("div");
        this.#startGameContainerElement.classList.add("start-game-container");
        const btnStartGame = document.createElement("button");
        btnStartGame.textContent = "Start Game";
        this.#startGameContainerElement.append(btnStartGame);
        this.#rootElement.append(this.#startGameContainerElement);
        this.bindStartGameButtonEvents(btnStartGame);
        ContainerHelper.displayWoodenContainer(this.#rootElement, this.#startGameContainerElement);
        this.displayScores();
    }

    bindStartGameButtonEvents(button) {
        button.addEventListener("click", this.startGameButtonClick.bind(this));
    }

    async startGameButtonClick() {
        this.hideScores();
        await ContainerHelper.removeWoodenContainer(this.#startGameContainerElement);
        this.scrollToEnemyArea(this.#game.currentEnemyIndex);
        GameController.startGame(this.#game, this);
    }
    /* ==================== */

    /* Players Areas */
    #firstPlayerArenaElement;

    #secondPlayerArenaElement;

    cachePlayersAreasDOM() {
        this.#firstPlayerArenaElement = this.#gameArenaElement.querySelector(".first-player-arena");
        this.#secondPlayerArenaElement =
            this.#gameArenaElement.querySelector(".second-player-arena");
    }

    createPlayersViews() {
        this.#playersViews = [];
        for (let i = 0; i < this.#players.length; i++) {
            const playerView = new PlayerView(
                this,
                this.#players[i].ships,
                this.#boardWidth,
                this.#boardHeight,
                this.#players[i].name,
            );
            this.#playersViews.push(playerView);
        }
    }

    addPlayerView(playerView) {
        this.#playersViews.push(playerView);
    }

    displayScores() {
        this.#pauseContainerElement.classList.add("active");
        this.#pauseContainerElement.addEventListener(
            "transitionend",
            () => {
                for (let i = 0; i < this.#players.length; i++) {
                    this.#playersViews[i].showScore();
                }
            },
            { once: true },
        );
    }

    hideScores() {
        this.#pauseContainerElement.classList.remove("active");
        for (let i = 0; i < this.#players.length; i++) {
            this.#playersViews[i].hideScore();
        }
    }

    updateScores(scores) {
        for (let i = 0; i < this.#playersViews.length; i++) {
            this.#playersViews[i].setWins(scores[i].wins);
            this.#playersViews[i].setLosses(scores[i].losses);
        }
    }

    get playersViews() {
        return [...this.#playersViews];
    }

    getPlayerView(playerIndex) {
        return this.#playersViews[playerIndex];
    }

    scrollToEnemyArea(enemyIndex) {
        if (enemyIndex === 0) {
            this.#firstPlayerArenaElement.scrollIntoView();
        } else {
            this.#secondPlayerArenaElement.scrollIntoView();
        }
    }

    /* ==================== */

    changeTurn(newTurn, enemyIndex) {
        this.#roundsNumberElement.innerText = newTurn;
        const rotation = getComputedStyle(this.#roundsElement).getPropertyValue("--angle");
        if (rotation.trim() === "0deg") {
            this.#roundsElement.style.setProperty("--angle", "180deg");
            // Text rotates with parent so we add 180 deg after 180 deg from parent's roatation
            this.#roundsTextElement.style.setProperty("--angle", "180deg");
        } else {
            this.#roundsElement.style.setProperty("--angle", "0deg");
            this.#roundsTextElement.style.setProperty("--angle", "0deg");
        }
        this.scrollToEnemyArea(enemyIndex);
    }

    async newGame(freshStart = true) {
        this.#players = [];
        this.#playersViews = [];
        this.#currentModalIndex = 0;
        if (freshStart) {
            await this.createGameTypeModal();
        } else {
            this.#gameArenaElement.remove();
            this.#pauseContainerElement.classList.remove("semi-active");
        }
        const modalsOrder = [this.createGridSizeModal, this.createShipsChoosingModal];
        for (let i = 1; i <= this.#humanNumber; i++) {
            modalsOrder.push(this.createShipsPlacingModal.bind(this, i, freshStart));
        }
        while (this.#currentModalIndex < modalsOrder.length) {
            await modalsOrder[this.#currentModalIndex++].call(this);
        }
        if (this.#humanNumber === 1) {
            this.#players.push(
                GameController.generateComputerPlayer(
                    this.#boardWidth,
                    this.#boardHeight,
                    this.#shipsList,
                ),
            );
        }
        this.createGameArena();
        return {
            humanNumber: this.#humanNumber,
            boardWidth: this.#boardWidth,
            boardHeight: this.#boardHeight,
            players: this.#players,
        };
    }

    /* Game Type Modal */
    async createGameTypeModal() {
        const modalInstance = new GameTypeModal();
        this.displayModal(modalInstance);
        await this.gameTypeModalSubmit(modalInstance);
        await this.removeModal(modalInstance);
    }

    gameTypeModalSubmit(modalInstance) {
        return new Promise((resolve) => {
            const btnSubmit = modalInstance.modalElement.querySelector(".btn-play");
            btnSubmit.addEventListener("click", () => {
                this.#humanNumber = modalInstance.gethumanNumber();
                resolve();
            });
        });
    }
    /* ==================== */

    /* Grid Size Modal */
    async createGridSizeModal() {
        const modalInstance = new GridSizeModal(this.#boardWidth ?? 10, this.#boardHeight ?? 10);
        this.displayModal(modalInstance);
        await this.gridSizeModalSubmit(modalInstance);
        await this.removeModal(modalInstance);
    }

    gridSizeModalSubmit(modalInstance) {
        return new Promise((resolve) => {
            const btnSubmit = modalInstance.modalElement.querySelector(".btn-next");
            btnSubmit.addEventListener("click", () => {
                this.#boardWidth = modalInstance.getWidth();
                this.#boardHeight = modalInstance.getHeight();
                resolve();
            });
        });
    }
    /* ==================== */

    /* Ships Choosing Modal */
    async createShipsChoosingModal() {
        const modalInstance = new ChoosingShipsModal(this.#boardWidth, this.#boardHeight);
        this.displayModal(modalInstance);
        await this.shipsChoosingModalSubmit(modalInstance);
        await this.removeModal(modalInstance);
    }

    shipsChoosingModalSubmit(modalInstance) {
        return new Promise((resolve) => {
            const btnBack = modalInstance.modalElement.querySelector(".btn-back");
            const btnSubmit = modalInstance.modalElement.querySelector(".btn-submit");
            btnSubmit.addEventListener("click", () => {
                this.#shipsList = modalInstance.getShipsList();
                resolve();
            });
            btnBack.addEventListener("click", () => {
                this.#currentModalIndex -= 2;
                resolve();
            });
        });
    }
    /* ==================== */

    /* Ships Placing Modal */
    async createShipsPlacingModal(playerNumber, isFirstRound) {
        const modalInstance = new ShipsPlacingModal(
            this.#humanNumber,
            playerNumber,
            this.#shipsList,
            this.#boardWidth,
            this.#boardHeight,
            isFirstRound,
        );
        this.displayModal(modalInstance);
        await this.shipsPlacingModalSubmit(modalInstance);
        await this.removeModal(modalInstance);
    }

    shipsPlacingModalSubmit(modalInstance) {
        return new Promise((resolve) => {
            const btnBack = modalInstance.modalElement.querySelector(".btn-back");
            const btnSubmit = modalInstance.modalElement.querySelector(".btn-submit");
            btnSubmit.addEventListener("click", () => {
                this.#players.push({
                    name: modalInstance.getPlayerName(),
                    ships: modalInstance.getShipsList(),
                    isBot: false,
                });
                resolve();
            });
            btnBack.addEventListener("click", () => {
                this.#currentModalIndex -= 2;
                resolve();
            });
        });
    }
    /* ==================== */

    /* For all modals */
    displayModal(modalInstance) {
        if (!modalInstance.modalContainerElement) {
            throw new Error("Modal instance does not have modal container element property");
        }
        if (!modalInstance.modalElement) {
            throw new Error("Modal instance does not have modal element property");
        }
        this.#rootElement.append(modalInstance.modalContainerElement);
        setTimeout(() => {
            modalInstance.modalContainerElement.classList.add("active");
            modalInstance.modalElement.classList.add("active");
        }, 0);
    }

    removeModal(modalInstance) {
        if (!modalInstance.modalContainerElement) {
            throw new Error("Modal instance does not have modal container element property");
        }
        if (!modalInstance.modalElement) {
            throw new Error("Modal instance does not have modal element property");
        }
        return new Promise((resolve) => {
            modalInstance.modalContainerElement.classList.remove("active");
            modalInstance.modalElement.classList.remove("active");
            modalInstance.modalElement.addEventListener("transitionend", (e) => {
                if (e.propertyName === "bottom") {
                    modalInstance.modalContainerElement.remove();
                    resolve();
                }
            });
        });
    }
    /* ==================== */
}
