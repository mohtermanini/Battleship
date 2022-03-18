import PubSub from "pubsub-js";
import ArrayHelper from "../array-hepler";
import GameboardChecker from "./gameboard-checker";

const GameboardController = (() => {
    function addShip(board, length) {
        if (!GameboardChecker.canAddShip(board, length)) {
            throw new Error("Illegal Argument Exception");
        }
        board.pushShip(length);
        // return index of the added ship
        return board.getShipsCount() - 1;
    }

    function placeShip(board, shipIndex, row, col, isVertical) {
        if (!GameboardChecker.canPlaceShip(board, shipIndex, row, col, isVertical)) {
            return false;
        }
        const shipToPlace = board.getShip(shipIndex);
        board.setShipOrientation(shipIndex, isVertical);
        board.setShipStartPoint(shipIndex, row, col);
        for (let i = 0; i < shipToPlace.getLength(); i++) {
            if (isVertical) {
                board.setShipBoardCell(row + i, col, shipIndex);
            } else {
                board.setShipBoardCell(row, col + i, shipIndex);
            }
        }
        board.decreaseBlockNotOccupied(shipToPlace.getLength());
        return true;
    }

    function removeAllShips(board) {
        const count = board.getShipsCount();
        for (let i = count - 1; i >= 0; i--) {
            unplaceShip(board, i);
            board.removeShip(i);
        }
    }

    function unplaceAllShips(board) {
        for (let i = 0; i < board.getShipsCount(); i++) {
            unplaceShip(board, i);
        }
    }

    function unplaceShip(board, shipIndex) {
        const shipsArray = board.getShips();
        if (
            shipsArray[shipIndex].row === undefined ||
            shipsArray[shipIndex].col === undefined ||
            shipsArray[shipIndex].isVertical === undefined
        ) {
            throw new Error("Ship is not placed");
        }
        const ship = board.getShip(shipIndex);
        if (!ship.isSunk()) {
            board.decreaseShipsAlive();
        }
        board.removeFromHitsBoard(
            shipsArray[shipIndex].row,
            shipsArray[shipIndex].col,
            ship.getLength(),
            shipsArray[shipIndex].isVertical,
        );
        board.removeFromShipsBoard(
            shipsArray[shipIndex].row,
            shipsArray[shipIndex].col,
            ship.getLength(),
            shipsArray[shipIndex].isVertical,
        );
        board.increaseBlockNotOccupied(ship.getLength());
        delete shipsArray[shipIndex].row;
        delete shipsArray[shipIndex].col;
        delete shipsArray[shipIndex].isVertical;
    }

    function autoPlaceShips(board, index) {
        const dp = new Set();
        board.sortShipsByLengthDesc();
        try {
            autoPlaceShipsDP(board, index, dp, Date.now(), 5);
            return true;
        } catch (error) {
            return false;
        }
    }

    function autoPlaceShipsDP(board, index, dp, time, timelimit) {
        index = index ?? 0;
        if (index === board.getShipsCount()) {
            return true;
        }
        if ((Date.now() - time) / 1000 > timelimit) {
            throw new Error("Time limit exceeded");
        }
        const key = `${convertShipsBoardToBoolean(board.getShipsBoard())} ,${index}`;
        if (dp.has(key)) {
            return false;
        }

        const placesAvailable = [];
        for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                let isVertical = false;
                if (GameboardChecker.canPlaceShip(board, index, i, j, isVertical)) {
                    placesAvailable.push({ row: i, col: j, isVertical });
                }
                isVertical = true;
                if (GameboardChecker.canPlaceShip(board, index, i, j, isVertical)) {
                    placesAvailable.push({ row: i, col: j, isVertical });
                }
            }
        }
        ArrayHelper.shuffle(placesAvailable);
        for (let i = 0; i < placesAvailable.length; i++) {
            placeShip(
                board,
                index,
                placesAvailable[i].row,
                placesAvailable[i].col,
                placesAvailable[i].isVertical,
            );
            if (autoPlaceShipsDP(board, index + 1, dp, time, timelimit)) {
                return true;
            }
            unplaceShip(board, index);
        }
        dp.add(key);
        return false;
    }

    function convertShipsBoardToBoolean(shipsBoard) {
        const booleanBoard = [];
        for (let i = 0; i < shipsBoard.length; i++) {
            booleanBoard.push(shipsBoard[i].map((item) => (item !== -1 ? 1 : 0)));
        }
        return booleanBoard;
    }

    function receiveAttack(board, row, col, boardView) {
        if (GameboardChecker.isHit(board, row, col)) {
            throw new Error("Illegal Argument Exception");
        }
        board.hitBoardCell(row, col);
        const shipsBoard = board.getShipsBoard();
        if (shipsBoard[row][col] === -1) {
            return false;
        }
        const hittedShipIndex = shipsBoard[row][col];
        const hitPointOnShip = board.isVerticalShip(hittedShipIndex)
            ? row - board.getShipStartPoint(hittedShipIndex).row
            : col - board.getShipStartPoint(hittedShipIndex).col;
        const hittedShip = board.getShip(hittedShipIndex);
        hittedShip.hit(hitPointOnShip);
        if (hittedShip.isSunk()) {
            board.decreaseShipsAlive();
            if (boardView) {
                PubSub.publish("ShipSunk", {
                    playerView: boardView.playerView,
                    shipLength: hittedShip.getLength(),
                });
            }
        }
        return true;
    }

    function getNotDamagedCells(board) {
        const cells = [];
        for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                if (!GameboardChecker.isHit(board, i, j)) {
                    cells.push({ row: i, col: j });
                }
            }
        }
        return cells;
    }

    function getDamagedCells(board) {
        const cells = [];
        for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                if (GameboardChecker.isHit(board, i, j)) {
                    cells.push({ row: i, col: j });
                }
            }
        }
        return cells;
    }

    function getDamagedCellsOfAliveDamagedShips(board, minShipHPDamaged, maxShipHPDamaged) {
        const cells = [];
        const damagedCells = getDamagedCells(board);
        damagedCells.forEach((cell) => {
            const shipIndex = board.getShipIndexFromCoordinate(cell.row, cell.col);
            if (shipIndex !== -1) {
                const ship = board.getShip(shipIndex);
                if (
                    !ship.isSunk() &&
                    ship.getHPDamaged() >= minShipHPDamaged &&
                    ship.getHPDamaged() <= maxShipHPDamaged
                ) {
                    cells.push({
                        row: cell.row,
                        col: cell.col,
                        isShipVertical: board.isVerticalShip(shipIndex),
                    });
                }
            }
        });
        return cells;
    }

    function addToPossibleTargets(board, targets, cells) {
        cells.forEach((cell) => {
            if (
                !GameboardChecker.isOutsideBoard(board, cell.row, cell.col) &&
                !GameboardChecker.isHit(board, cell.row, cell.col)
            ) {
                targets.push(cell);
            }
        });
    }

    function getSmartTargets(board) {
        const targets = [];
        let cells = getDamagedCellsOfAliveDamagedShips(board, 2, 10);
        if (cells.length > 0) {
            cells.forEach((cell) => {
                if (cell.isShipVertical) {
                    addToPossibleTargets(board, targets, [
                        { row: cell.row - 1, col: cell.col },
                        { row: cell.row + 1, col: cell.col },
                    ]);
                } else {
                    addToPossibleTargets(board, targets, [
                        { row: cell.row, col: cell.col - 1 },
                        { row: cell.row, col: cell.col + 1 },
                    ]);
                }
            });
            return targets;
        }

        cells = getDamagedCellsOfAliveDamagedShips(board, 1, 1);
        cells.forEach((cell) => {
            addToPossibleTargets(board, targets, [
                { row: cell.row - 1, col: cell.col },
                { row: cell.row + 1, col: cell.col },
                { row: cell.row, col: cell.col - 1 },
                { row: cell.row, col: cell.col + 1 },
            ]);
        });
        return targets;
    }

    function getNotDamagedSmartTargets(board) {
        const targets = [];
        const cells = getNotDamagedCells(board);
        const minShipLength = getMinNotDamagedShipLength(board);
        cells.forEach((cell) => {
            if (getHorizontalNotDamagedLength(board, cell.row, cell.col) >= minShipLength) {
                targets.push(cell);
            } else if (getVerticalNotDamagedLength(board, cell.row, cell.col) >= minShipLength) {
                targets.push(cell);
            }
        });
        return targets;
    }

    function getMinNotDamagedShipLength(board) {
        let minLength = null;
        for (let i = 0; i < board.getShipsCount(); i++) {
            const ship = board.getShip(i);
            if (ship.getHPDamaged() === 0) {
                if (minLength === null) {
                    minLength = ship.getLength();
                } else {
                    minLength = Math.min(minLength, ship.getLength());
                }
            }
        }
        return minLength;
    }

    function getHorizontalNotDamagedLength(board, row, col) {
        let length = 1;
        for (let i = col + 1; i < board.getWidth(); i++) {
            if (GameboardChecker.isHit(board, row, i)) {
                break;
            }
            ++length;
        }
        for (let i = col - 1; i >= 0; i--) {
            if (GameboardChecker.isHit(board, row, i)) {
                break;
            }
            ++length;
        }
        return length;
    }
    function getVerticalNotDamagedLength(board, row, col) {
        let length = 1;
        for (let i = row + 1; i < board.getHeight(); i++) {
            if (GameboardChecker.isHit(board, i, col)) {
                break;
            }
            ++length;
        }
        for (let i = row - 1; i >= 0; i--) {
            if (GameboardChecker.isHit(board, i, col)) {
                break;
            }
            ++length;
        }
        return length;
    }

    return {
        addShip,
        placeShip,
        unplaceShip,
        receiveAttack,
        autoPlaceShips,
        unplaceAllShips,
        removeAllShips,
        getNotDamagedCells,
        getDamagedCellsOfAliveDamagedShips,
        getSmartTargets,
        getMinNotDamagedShipLength,
        getNotDamagedSmartTargets,
    };
})();

export default GameboardController;
