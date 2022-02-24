import GameboardChecker from "./gameboard-checker.js";
import Gameboard from "./gameboard-module.js";

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
        board.decreaseBlockNotOccuped(shipToPlace.getLength());
        return true;
    }

    function receiveAttack(board, row, col) {
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
        }
        return true;
    }

    return {
        addShip,
        placeShip,
        receiveAttack,
    };
})();

export default GameboardController;
