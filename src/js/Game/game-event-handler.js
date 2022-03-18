import PubSub from "pubsub-js";
import GameConroller from "./game-controller";

const GameEventHandler = (() => {
    // Bind Events
    PubSub.subscribe("AttackReceived", attackReceived);
    PubSub.subscribe("AttackFailed", attackFailed);
    PubSub.subscribe("AttackSucceded", attackSucceded);
    PubSub.subscribe("SwitchPlayerTurn", switchPlayerTurn);
    PubSub.subscribe("GameEnded", gameEnded);
    PubSub.subscribe("TurnIncreased", turnIncreased);
    PubSub.subscribe("ShipSunk", shipSunk);

    // Events Handlers
    function attackReceived(msg, data) {
        GameConroller.attack(
            data.boardView.playerView.gameView.game,
            data.row,
            data.col,
            data.boardView,
        );
    }

    function attackFailed(msg, data) {
        data.boardView.attackFailed(data.row, data.col);
    }

    function attackSucceded(msg, data) {
        data.boardView.attackSucceded(data.row, data.col, data.isSunk);
    }

    function switchPlayerTurn(msg, data) {
        const playerView = data.gameView.getPlayerView(data.game.currentPlayerIndex);
        playerView.setTurn();
        playerView.disableBoard();
        if (!data.firstTurn) {
            const previousPlayerView = data.gameView.getPlayerView(data.game.currentEnemyIndex);
            previousPlayerView.unsetTurn();
            previousPlayerView.enableBoard();
        }
        GameConroller.startMove(data.game, data.gameView);
    }

    function gameEnded(msg, data) {
        data.gameView.endGame(data.winnerIndex);
    }

    function turnIncreased(msg, data) {
        data.gameView.changeTurn(data.newTurn);
    }

    function shipSunk(msg, data) {
        data.playerView.sinkShip(data.shipLength);
    }
})();

export default GameEventHandler;
