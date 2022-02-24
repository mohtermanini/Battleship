import GameboardController from "../Gameboard/gameboard-controller.js";
import GameboardChecker from "../Gameboard/gameboard-checker.js";
import Game from "./game-module.js";
import Player from "../Player/player-module.js";

const GameController = (() => {
    function generateRandomPlayerIndex(game) {
        return Math.floor(Math.random() * game.getPlayersCount());
    }

    function startGame(game) {
        if (game.running === true) {
            return;
        }
        if (game.getPlayersCount() < 2) {
            throw new Error("Too few players");
        }
        game.running = true;
        game.increaseCurrentRound();
        game.increaseCurrentTurn();
        if (game.currentRound === 1) {
            game.currentPlayerIndex = generateRandomPlayerIndex(game);
        } else {
            game.currentPlayerIndex = game.getLastWinner();
        }
        game.currentEnemyIndex = (game.currentPlayerIndex + 1) % game.getPlayersCount();
    }

    function endGame(game) {
        if (game.running === false) {
            return;
        }
        game.running = false;
        game.getCurrentPlayer().increaseWinRounds();
        game.addWinner(game.currentPlayerIndex);
        game.resetCurrentTurn();
    }

    function currentPlayerTurnEnd(game) {
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.getPlayersCount();
        game.currentEnemyIndex = (game.currentEnemyIndex + 1) % game.getPlayersCount();
        game.increaseCurrentTurn();
    }

    function attack(game, row, col) {
        const attackSucceded = GameboardController
            .receiveAttack(game.getCurrentEnemy().board, row, col);
        if (GameboardChecker.areAllShipsSunk(game.getCurrentEnemy().board)) {
            endGame(game);
        } else if (!attackSucceded) {
            currentPlayerTurnEnd(game);
        }
    }

    return {
        startGame,
        attack,
        endGame,
    };
})();

export default GameController;
