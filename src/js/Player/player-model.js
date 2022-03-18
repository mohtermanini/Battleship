import Gameboard from "../Gameboard/gameboard-model";

export default class Player {
    #name;

    #board;

    #winRounds;

    #playedRounds;

    #isBot;

    constructor(name, isBot) {
        this.name = name;
        this.#isBot = isBot;
        this.#winRounds = 0;
        this.#playedRounds = 0;
    }

    set name(value) {
        this.#name = value;
    }

    get name() {
        return this.#name;
    }

    get isBot() {
        return this.#isBot;
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
