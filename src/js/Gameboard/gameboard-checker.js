import GameboardGetter from "./gameboard-getter.js";
import CheckerHelper from "../checker-helper.js";

const GameboardChecker = (() => {
    function canAddShip(board, length) {
        if (!CheckerHelper.checkIfPositiveNumber(length)) {
            throw new Error("Illegal Argument Exception");
        }
        if (
            length > Math.max(
                GameboardGetter.maxHorizontalLengthCanBeOccupied(board),
                GameboardGetter.maxVerticalLengthCanBeOccupied(board),
            )
        ) {
            return false;
        }
        let notPlacedLength = 0;
        board.getShips().forEach((item) => {
            if (item.start === undefined) {
                notPlacedLength += item.ship.getLength();
            }
        });
        if (board.getBlockNotOccupied() - notPlacedLength - length < 0) {
            return false;
        }
        return true;
    }

    function isOutsideBoard(board, row, col) {
        return row < 0 || row >= board.getHeight() || col < 0 || col >= board.getWidth();
    }

    function canPlaceShip(board, shipIndex, row, col, isVertical) {
        if (
            !CheckerHelper.checkIfWholeNumber(shipIndex)
            || !CheckerHelper.checkIfWholeNumber(row)
            || !CheckerHelper.checkIfWholeNumber(col)
            || (typeof (isVertical) !== "boolean")
        ) {
            throw new Error("Illegal Argument Exception");
        }
        if (isOutsideBoard(board, row, col)) {
            throw new Error("Illegal Argument Exception");
        }
        if (shipIndex >= board.getShips().length) {
            throw new Error("Illegal Argument Exception");
        }
        const shipToPlace = board.getShip(shipIndex);
        if (isVertical && row + shipToPlace.getLength() - 1 >= board.getHeight()) {
            return false;
        }
        if (!isVertical && col + shipToPlace.getLength() - 1 >= board.getWidth()) {
            return false;
        }
        const shipsBoard = board.getShipsBoard();
        for (let i = 0; i < shipToPlace.getLength(); i++) {
            if (isVertical && shipsBoard[row + i][col] !== -1) {
                return false;
            }
            if (!isVertical && shipsBoard[row][col + i] !== -1) {
                return false;
            }
        }
        return true;
    }

    function isHit(board, row, col) {
        if (
            !CheckerHelper.checkIfWholeNumber(row)
            || !CheckerHelper.checkIfWholeNumber(col)
        ) {
            throw new Error("Illegal Argument Exception");
        }

        if (isOutsideBoard(board, row, col)) {
            throw new Error("Illegal Argument Exception");
        }
        return board.getHitsBoard()[row][col] !== 0;
    }

    function areAllShipsSunk(board) {
        return board.getShipsAlive() === 0;
    }

    return {
        canAddShip,
        isOutsideBoard,
        canPlaceShip,
        isHit,
        areAllShipsSunk,
    };
})();

export default GameboardChecker;
