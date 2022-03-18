import PubSub from "pubsub-js";
import BoardHelper from "../ViewHelper/board";
import boardTemplate from "../../html/templates/gameboard-template.handlebars";

export default class GameboardView {
    #width;

    #height;

    #boardElement;

    #playerView;

    #audioSplash;

    #audioCrash;

    #shipsList;

    #shipsBlocksBoard;

    constructor(width, height, playerView, shipsList) {
        this.#width = width;
        this.#height = height;
        this.#playerView = playerView;
        this.#shipsList = shipsList;
        this.#audioSplash = new Audio("../../../assets/sounds/splash.wav");
        this.#audioCrash = new Audio("../../../assets/sounds/explode-cut.wav");
        this.#shipsBlocksBoard = [];
        for (let i = 0; i < this.#height; i++) {
            this.#shipsBlocksBoard.push([]);
            for (let j = 0; j < this.#width; j++) {
                this.#shipsBlocksBoard[i].push(null);
            }
        }
        this.render();
        this.bindEvents();
    }

    getBoardElement() {
        return this.#boardElement;
    }

    get playerView() {
        return this.#playerView;
    }

    render() {
        const blocks = [];
        for (let i = 0; i < this.#height; i++) {
            for (let j = 0; j < this.#width; j++) {
                blocks.push(null);
            }
        }
        this.#boardElement = document.createElement("div");
        this.#boardElement.classList.add("board");
        this.#boardElement.style.setProperty("--board-horizontal-cells", this.#width);
        this.#boardElement.innerHTML = boardTemplate({ blocks });
        setTimeout(() => {
            this.addShipsToBoard();
        }, 200);
    }

    addShipsToBoard() {
        Object.keys(this.#shipsList).forEach((key) => {
            const length = this.#shipsList[key].length;
            const row = this.#shipsList[key].row;
            const col = this.#shipsList[key].col;
            const isVertical = this.#shipsList[key].isVertical;
            const ship = BoardHelper.createShipElement(length, isVertical);
            Array.from(ship.children).forEach((block) => {
                block.classList.add("hidden");
            });
            ship.classList.add("hidden");
            this.setShipsBlocksBoard(row, col, length, isVertical, ship);
            BoardHelper.createShipOnBoard(
                this.#boardElement,
                this.#width,
                row,
                col,
                length,
                isVertical,
                undefined,
                ship,
            );
        });
    }

    setShipsBlocksBoard(row, col, length, isVertical, ship) {
        for (let i = 0; i < length; i++) {
            if (isVertical) {
                this.#shipsBlocksBoard[row + i][col] = ship.children[i];
            } else {
                this.#shipsBlocksBoard[row][col + i] = ship.children[i];
            }
        }
    }

    // Events Binding
    bindEvents() {
        this.#boardElement.addEventListener("click", this.receiveAttack.bind(this));
    }

    receiveAttack(e) {
        if (e.target.classList.contains("board-block")) {
            const index = Array.from(this.#boardElement.children).indexOf(e.target);
            PubSub.publish("AttackReceived", {
                row: Math.floor(index / this.#width),
                col: index % this.#width,
                boardView: this,
            });
        }
    }

    attackFailed(row, col) {
        this.playSound(this.#audioSplash);
        const blockIndex = BoardHelper.getBlockIndexFromCoordinates(row, col, this.#width);
        this.#boardElement.children[blockIndex].classList.add("disabled", "incorrect");
    }

    attackSucceded(row, col, isSunk) {
        this.playSound(this.#audioCrash);
        const blockIndex = BoardHelper.getBlockIndexFromCoordinates(row, col, this.#width);
        this.#boardElement.children[blockIndex].classList.add("disabled");
        const block = this.#shipsBlocksBoard[row][col];
        block.classList.remove("hidden");
        if (isSunk) {
            block.closest(".ship").classList.remove("hidden");
            block.closest(".ship").classList.add("destroyed");
        }
    }

    playSound(audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    disableBoard() {
        this.#boardElement.classList.add("disabled");
    }

    enableBoard() {
        this.#boardElement.classList.remove("disabled");
    }
}
