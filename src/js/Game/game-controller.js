import PubSub from "pubsub-js";
import GameboardController from "../Gameboard/gameboard-controller";
import GameboardChecker from "../Gameboard/gameboard-checker";
import GameView from "./game-view";
import Game from "./game-model";
import Player from "../Player/player-model";
import Gameboard from "../Gameboard/gameboard-model";

const GameController = (() => {
    function generateRandomPlayerIndex(game) {
        return Math.floor(Math.random() * game.getPlayersCount());
    }

    function generateGame(gamesContainer, id) {
        const game = new Game();
        const gameView = GameController.createGameView(game, gamesContainer, id);
        gameView.newGame().then((data) => {
            for (let i = 0; i < data.players.length; i++) {
                const playerData = data.players[i];
                const player = new Player(playerData.name, data.players[i].isBot);
                player.createBoard(data.boardWidth, data.boardHeight);
                Object.keys(playerData.ships).forEach((key) => {
                    const ship = playerData.ships[key];
                    const addedShipIndex = GameboardController.addShip(player.board, ship.length);
                    GameboardController.placeShip(
                        player.board,
                        addedShipIndex,
                        ship.row,
                        ship.col,
                        ship.isVertical,
                    );
                });
                game.addPlayer(player);
            }
        });
    }

    function generateComputerPlayer(boardWidth, boardHeight, shipsList) {
        const computerPlayer = {};
        computerPlayer.name = "Computer";
        computerPlayer.isBot = true;
        const tempBoard = Gameboard(boardWidth, boardHeight);
        Object.keys(shipsList).forEach((key) => {
            const shipLength = parseInt(key, 10);
            const count = shipsList[shipLength];
            for (let i = 0; i < count; i++) {
                GameboardController.addShip(tempBoard, shipLength);
            }
        });
        GameboardController.autoPlaceShips(tempBoard);
        computerPlayer.ships = {};
        const boardShips = tempBoard.getShips();
        Object.keys(boardShips).forEach((key) => {
            computerPlayer.ships[key] = {};
            computerPlayer.ships[key].length = tempBoard.getShip(key).getLength();
            computerPlayer.ships[key].row = boardShips[key].row;
            computerPlayer.ships[key].col = boardShips[key].col;
            computerPlayer.ships[key].isVertical = boardShips[key].isVertical;
        });
        return computerPlayer;
    }

    function generateNextRound(game, gameView) {
        const scores = [];
        gameView.newGame(false).then((data) => {
            for (let i = 0; i < data.players.length; i++) {
                const playerData = data.players[i];
                const player = game.getPlayer(i);
                player.createBoard(data.boardWidth, data.boardHeight);
                Object.keys(playerData.ships).forEach((key) => {
                    const ship = playerData.ships[key];
                    const addedShipIndex = GameboardController.addShip(player.board, ship.length);
                    GameboardController.placeShip(
                        player.board,
                        addedShipIndex,
                        ship.row,
                        ship.col,
                        ship.isVertical,
                    );
                });
                scores.push({
                    wins: player.winRounds,
                    losses: player.playedRounds - player.winRounds,
                });
            }
            gameView.updateScores(scores);
        });
    }

    function startGame(game, gameView) {
        if (game.running === true) {
            return;
        }
        if (game.getPlayersCount() < 2) {
            throw new Error("Too few players");
        }
        game.running = true;
        game.increaseCurrentRound();
        setStartingPlayer(game);
        game.currentEnemyIndex = (game.currentPlayerIndex + 1) % game.getPlayersCount();
        game.increaseCurrentTurn();
        if (gameView) {
            PubSub.publish("SwitchPlayerTurn", {
                game,
                gameView,
                firstTurn: true,
            });
        }
    }

    function setStartingPlayer(game) {
        let startingPlayerIndex;
        if (game.currentRound === 1) {
            startingPlayerIndex = generateRandomPlayerIndex(game);
        } else {
            startingPlayerIndex = game.getLastWinner();
        }
        game.currentPlayerIndex = startingPlayerIndex;
        return startingPlayerIndex;
    }

    function endGame(game) {
        if (game.running === false) {
            return;
        }
        game.running = false;
        game.getCurrentPlayer().increaseWinRounds();
        game.getPlayers().forEach((player) => {
            player.increasePlayerRounds();
        });
        game.addWinner(game.currentPlayerIndex);
        game.resetCurrentTurn();
    }

    function currentPlayerTurnEnd(game, gameView) {
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.getPlayersCount();
        game.currentEnemyIndex = (game.currentEnemyIndex + 1) % game.getPlayersCount();

        game.increaseCurrentTurn();
        if (gameView) {
            PubSub.publish("SwitchPlayerTurn", {
                game,
                gameView,
                firstTurn: false,
            });
            PubSub.publish("TurnIncreased", {
                newTurn: game.currentTurn,
                currentEnemyIndex: game.currentEnemyIndex,
                gameView,
            });
        }
    }

    function startMove(game, gameView) {
        if (game.getCurrentPlayer().isBot) {
            gameView.playersViews.forEach((view) => {
                view.disableBoard();
            });
            computerAttack(
                game.getCurrentEnemy().board,
                gameView.getPlayerView(game.currentEnemyIndex).boardView,
            );
        }
    }

    function computerAttack(board, boardView) {
        let cells = GameboardController.getSmartTargets(board);
        const targetedCell = {};
        if (cells.length === 0) {
            cells = GameboardController.getNotDamagedSmartTargets(board);
            const index = Math.floor(Math.random() * cells.length);
            targetedCell.row = cells[index].row;
            targetedCell.col = cells[index].col;
        } else {
            targetedCell.row = cells[0].row;
            targetedCell.col = cells[0].col;
        }
        setTimeout(() => {
            PubSub.publish("AttackReceived", {
                row: targetedCell.row,
                col: targetedCell.col,
                boardView,
            });
        }, 1000);
    }

    function attack(game, row, col, boardView) {
        const attackSucceded = GameboardController.receiveAttack(
            game.getCurrentEnemy().board,
            row,
            col,
            boardView,
        );
        if (!attackSucceded) {
            if (boardView) {
                PubSub.publish("AttackFailed", {
                    boardView,
                    row,
                    col,
                });
            }
            currentPlayerTurnEnd(
                game,
                boardView !== undefined ? boardView.playerView.gameView : undefined,
            );
        } else {
            if (boardView) {
                PubSub.publish("AttackSucceded", {
                    boardView,
                    row,
                    col,
                    isSunk: game.getCurrentEnemy().board.getShipFromCoordinate(row, col).isSunk(),
                });
            }
            if (GameboardChecker.areAllShipsSunk(game.getCurrentEnemy().board)) {
                endGame(game);
                if (boardView) {
                    PubSub.publish("GameEnded", {
                        gameView: boardView.playerView.gameView,
                        winnerIndex: game.currentPlayerIndex,
                    });
                }
            } else if (boardView) {
                startMove(game, boardView.playerView.gameView);
            }
        }
    }

    function createGameView(game, gamesContainer, id) {
        const gameView = new GameView(game, gamesContainer, id);
        return gameView;
    }

    return {
        generateGame,
        startGame,
        attack,
        endGame,
        createGameView,
        generateNextRound,
        generateComputerPlayer,
        startMove,
        computerAttack,
    };
})();

export default GameController;
