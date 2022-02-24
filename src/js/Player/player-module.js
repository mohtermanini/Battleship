import Gameboard from "../Gameboard/gameboard-module.js";

export default class Player {
    #name;

    #board;

    #winRounds;

    #playedRounds;

    constructor(name) {
        this.name = name;
        this.#winRounds = 0;
        this.#playedRounds = 0;
    }

    set name(value) {
        this.#name = value;
    }

    get name() {
        return this.#name;
    }

    createBoard(width, height) {
        this.#board = Gameboard(width, height);
    }

    get board() {
        return this.#board;
    }

    increasePlayerRounds() {
        ++this.#playedRounds;
    }

    get playedRounds() {
        return this.#playedRounds;
    }

    increaseWinRounds() {
        ++this.#winRounds;
    }

    get winRounds() {
        return this.#winRounds;
    }
}
