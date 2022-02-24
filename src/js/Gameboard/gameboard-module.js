import Ship from "../Ship/ship-controller.js";

export default function Gameboard(width, height) {
    const ships = [];
    const hitsBoard = [];
    const shipsBoard = [];
    let shipsAlive = 0;
    let blocksNotOccupied = width * height;

    for (let i = 0; i < height; i++) {
        hitsBoard.push([]);
        shipsBoard.push([]);
        for (let j = 0; j < width; j++) {
            hitsBoard[i][j] = 0;
            shipsBoard[i][j] = -1;
        }
    }

    const proto = {

        getWidth() {
            return width;
        },

        getHeight() {
            return height;
        },

        getShips() {
            return [...ships];
        },

        getShip(shipIndex) {
            return ships[shipIndex].ship;
        },

        pushShip(length) {
            ships.push({ ship: new Ship(length) });
            ++shipsAlive;
        },

        isVerticalShip(shipIndex) {
            return ships[shipIndex].isVertical;
        },

        setShipOrientation(shipIndex, isVertical) {
            ships[shipIndex].isVertical = isVertical;
        },

        getShipStartPoint(shipIndex) {
            return { row: ships[shipIndex].row, col: ships[shipIndex].col };
        },

        setShipStartPoint(shipIndex, row, col) {
            ships[shipIndex].row = row;
            ships[shipIndex].col = col;
        },

        getShipsCount() {
            return ships.length;
        },

        getShipsBoard() {
            const copiedShipsBoard = [];
            shipsBoard.forEach((row) => {
                copiedShipsBoard.push([...row]);
            });
            return copiedShipsBoard;
        },

        setShipBoardCell(row, col, value) {
            shipsBoard[row][col] = value;
        },

        getHitsBoard() {
            const copiedHitsBoard = [];
            hitsBoard.forEach((row) => {
                copiedHitsBoard.push([...row]);
            });
            return copiedHitsBoard;
        },

        hitBoardCell(row, col) {
            ++hitsBoard[row][col];
        },

        getBlockNotOccupied() {
            return blocksNotOccupied;
        },

        decreaseBlockNotOccuped(value) {
            blocksNotOccupied -= value;
        },

        increaseBlockNotOccuped(value) {
            blocksNotOccupied += value;
        },

        getShipsAlive() {
            return shipsAlive;
        },

        decreaseShipsAlive() {
            --shipsAlive;
        },

    };

    return Object.create(proto);
}
