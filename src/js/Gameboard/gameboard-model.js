import Ship from "../Ship/ship-controller";

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

        getShipFromCoordinate(row, col) {
            return this.getShip(this.getShipIndexFromCoordinate(row, col));
        },

        getShipIndexFromCoordinate(row, col) {
            return shipsBoard[row][col];
        },

        pushShip(length) {
            ships.push({ ship: new Ship(length) });
            ++shipsAlive;
        },

        removeShip(shipIndex) {
            const ship = this.getShip(shipIndex);
            if (!ship.isSunk()) {
                --shipsAlive;
            }
            this.removeFromHitsBoard(
                ships[shipIndex].row,
                ships[shipIndex].col,
                ship.getLength(),
                ships[shipIndex].isVertical,
            );
            this.removeFromShipsBoard(
                ships[shipIndex].row,
                ships[shipIndex].col,
                ship.getLength(),
                ships[shipIndex].isVertical,
            );
            if (ships[shipIndex].row !== undefined && ships[shipIndex].col !== undefined) {
                this.increaseBlockNotOccupied(ship.getLength());
            }
            ships.splice(shipIndex, 1);
        },

        removeShipByCoordinates(row, col) {
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].row === row && ships[i].col === col) {
                    this.removeShip(i);
                    break;
                }
            }
        },

        removeFromHitsBoard(row, col, length, isVertical) {
            if (isVertical) {
                for (let i = row; i < row + length; i++) {
                    hitsBoard[i][col] = 0;
                }
            } else {
                for (let j = col; j < col + length; j++) {
                    hitsBoard[row][j] = 0;
                }
            }
        },

        removeFromShipsBoard(row, col, length, isVertical) {
            if (isVertical) {
                for (let i = row; i < row + length; i++) {
                    this.setShipBoardCell(i, col, -1);
                }
            } else {
                for (let j = col; j < col + length; j++) {
                    this.setShipBoardCell(row, j, -1);
                }
            }
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

        decreaseBlockNotOccupied(value) {
            blocksNotOccupied -= value;
        },

        increaseBlockNotOccupied(value) {
            blocksNotOccupied += value;
        },

        getShipsAlive() {
            return shipsAlive;
        },

        decreaseShipsAlive() {
            --shipsAlive;
        },

        getShipsList() {
            const shipsList = {};
            ships.forEach((item) => {
                const count = shipsList[item.ship.getLength()] ?? 0;
                shipsList[item.ship.getLength()] = count + 1;
            });
            return shipsList;
        },

        sortShipsByLengthDesc() {
            ships.sort((a, b) => b.ship.getLength() - a.ship.getLength());
        },
    };

    return Object.create(proto);
}
