export default class Game {
    #running;

    #players;

    #currentRound;

    #currentTurn;

    #currentPlayerIndex;

    #currentEnemyIndex;

    #winners;

    constructor() {
        this.running = false;
        this.#players = [];
        this.#currentRound = 0;
        this.#currentTurn = 0;
        this.#currentPlayerIndex = -1;
        this.#winners = [];
    }

    set running(value) {
        this.#running = value;
    }

    get running() {
        return this.#running;
    }

    addPlayer(player) {
        this.#players.push(player);
    }

    getPlayer(playerIndex) {
        return this.#players[playerIndex];
    }

    getPlayers() {
        return [...this.#players];
    }

    getPlayersCount() {
        return this.#players.length;
    }

    increaseCurrentRound() {
        ++this.#currentRound;
    }

    get currentRound() {
        return this.#currentRound;
    }

    set currentPlayerIndex(value) {
        this.#currentPlayerIndex = value;
    }

    get currentPlayerIndex() {
        return this.#currentPlayerIndex;
    }

    set currentEnemyIndex(value) {
        this.#currentEnemyIndex = value;
    }

    get currentEnemyIndex() {
        return this.#currentEnemyIndex;
    }

    getCurrentPlayer() {
        return this.#players[this.#currentPlayerIndex];
    }

    getCurrentEnemy() {
        return this.#players[this.#currentEnemyIndex];
    }

    addWinner(playerIndex) {
        this.#winners.push(playerIndex);
    }

    get winners() {
        return [...this.#winners];
    }

    getLastWinner() {
        return this.#winners[this.#winners.length - 1];
    }

    increaseCurrentTurn() {
        ++this.#currentTurn;
    }

    resetCurrentTurn() {
        this.#currentTurn = 0;
    }

    get currentTurn() {
        return this.#currentTurn;
    }
}
