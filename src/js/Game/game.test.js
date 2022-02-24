import Game from "./game-module";
import GameController from "./game-controller";
import Player from "../Player/player-module";
import GameboardController from "../Gameboard/gameboard-controller";

test("No player is playing when game is newly created", () => {
    const game = new Game();
    expect(game.currentPlayerIndex).toBe(-1);
});

test("Adding players", () => {
    const game = new Game();
    const player1 = new Player("Sam");
    game.addPlayer(player1);
    const player2 = new Player("Jack");
    game.addPlayer(player2);
    expect(game.getPlayer(0).name).toEqual("Sam");
});

test("Run game with 2 player", () => {
    const game = new Game();
    game.addPlayer(new Player("Sam"));
    game.addPlayer(new Player("Jack"));
    GameController.startGame(game);
    expect(game.running).toBe(true);
});

test("Run game with 1 player only", () => {
    expect(() => {
        const game = new Game();
        game.addPlayer(new Player("Sam"));
        GameController.startGame(game);
    }).toThrow();
});

test("Turns increase", () => {
    const game = new Game();

    const player1 = new Player("Sam");
    player1.createBoard(4, 2);
    GameboardController.addShip(player1.board, 2);
    GameboardController.addShip(player1.board, 3);
    GameboardController.placeShip(player1.board, 0, 0, 0, true);
    GameboardController.placeShip(player1.board, 1, 0, 1, false);
    game.addPlayer(player1);

    const player2 = new Player("Jack");
    player2.createBoard(4, 2);
    GameboardController.addShip(player2.board, 2);
    GameboardController.addShip(player2.board, 2);
    GameboardController.placeShip(player2.board, 0, 0, 0, true);
    GameboardController.placeShip(player2.board, 1, 0, 3, true);
    game.addPlayer(player2);

    GameController.startGame(game);
    const startPlayer = game.currentPlayerIndex;
    if (startPlayer === 0) {
        GameController.attack(game, 0, 1);
    }
    GameController.attack(game, 1, 1);
    GameController.attack(game, 0, 2);
    if (startPlayer === 1) {
        GameController.attack(game, 1, 2);
    }
    expect(game.currentTurn).toBe(4);
});

test("Turns remains if attack was succeded hitting a ship", () => {
    const game = new Game();
    const player1 = new Player("Sam");
    createPlayer1Board(player1);
    game.addPlayer(player1);

    const player2 = new Player("Jack");
    createPlayer2Board(player2);
    game.addPlayer(player2);

    GameController.startGame(game);
    GameController.attack(game, 0, 0);
    GameController.attack(game, 1, 0);
    GameController.attack(game, 0, 3);
    expect(game.currentTurn).toBe(1);
});

test("Game stops after defeating enemy + Player round wins increases", () => {
    const game = new Game();
    const player1 = new Player("Sam");
    createPlayer1Board(player1);
    game.addPlayer(player1);

    const player2 = new Player("Jack");
    createPlayer2Board(player2);
    game.addPlayer(player2);

    GameController.startGame(game);
    const startPlayer = game.currentPlayerIndex;
    if (startPlayer === 0) {
        destroyAllPlayer2Ships(game);
    } else {
        destroyAllPlayer1Ships(game);
    }
    const resultValues = [game.running, game.getPlayer(startPlayer).winRounds];
    const expectedValues = [false, 1];
    expect(resultValues).toEqual(expectedValues);
});

test("Starting new game increase rounds + turns reset + winner always starts", () => {
    const game = new Game();
    const player1 = new Player("Sam");
    createPlayer1Board(player1);
    game.addPlayer(player1);

    const player2 = new Player("Jack");
    createPlayer2Board(player2);
    game.addPlayer(player2);

    GameController.startGame(game);
    const startPlayer = game.currentPlayerIndex;
    if (startPlayer === 0) {
        destroyAllPlayer2Ships(game);
    } else {
        destroyAllPlayer1Ships(game);
    }
    createPlayer1Board(player1);
    createPlayer2Board(player2);
    GameController.startGame(game);
    const resultValues = [game.currentRound, game.currentTurn, game.currentPlayerIndex];
    const expectedValues = [2, 1, startPlayer];
    expect(resultValues).toEqual(expectedValues);
});

// Helpers
function createPlayer1Board(player1) {
    player1.createBoard(4, 2);
    GameboardController.addShip(player1.board, 2);
    GameboardController.addShip(player1.board, 3);
    GameboardController.placeShip(player1.board, 0, 0, 0, true);
    GameboardController.placeShip(player1.board, 1, 0, 1, false);
}

function createPlayer2Board(player2) {
    player2.createBoard(4, 2);
    GameboardController.addShip(player2.board, 2);
    GameboardController.addShip(player2.board, 2);
    GameboardController.placeShip(player2.board, 0, 0, 0, true);
    GameboardController.placeShip(player2.board, 1, 0, 3, true);
}

function destroyAllPlayer2Ships(game) {
    GameController.attack(game, 0, 0);
    GameController.attack(game, 1, 0);
    GameController.attack(game, 0, 3);
    GameController.attack(game, 1, 3);
}

function destroyAllPlayer1Ships(game) {
    GameController.attack(game, 0, 0);
    GameController.attack(game, 1, 0);
    GameController.attack(game, 0, 1);
    GameController.attack(game, 0, 2);
    GameController.attack(game, 0, 3);
}
