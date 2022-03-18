import Gameboard from "./gameboard-model";
import GameboardController from "./gameboard-controller";
import GameboardChecker from "./gameboard-checker";

describe("ShipsBoard", () => {
    test("not same reference", () => {
        const board = Gameboard(4, 2);
        const modifiedShipsBoard = board.getShipsBoard();
        modifiedShipsBoard[0][0] = -2;
        expect(board.getShipsBoard()).not.toEqual(modifiedShipsBoard);
    });
});

describe("Get gameboard ships", () => {
    test("not same reference", () => {
        const board = Gameboard(4, 2);
        const modifiedShipsArray = board.getShips();
        modifiedShipsArray.push(1);
        expect(board.getShips()).not.toEqual(modifiedShipsArray);
    });
});

describe("Adding ships", () => {
    test("Add two ships of lengths [2, 4] to 4*2 gameboard", () => {
        const board = Gameboard(4, 2);
        const indices = [];
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 4));
        expect(indices).toEqual([0, 1]);
    });

    test("Add two ships of lengths [4, 4] to 4*2 gameboard", () => {
        const board = Gameboard(4, 2);
        const indices = [];
        indices.push(GameboardController.addShip(board, 4));
        indices.push(GameboardController.addShip(board, 4));
        expect(indices).toEqual([0, 1]);
    });

    test("Add four ships of lengths [2, 2, 2, 2] to 4*2 gameboard", () => {
        const board = Gameboard(4, 2);
        const indices = [];
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        expect(indices).toEqual([0, 1, 2, 3]);
    });

    test("Add five ships of lengths [2, 2, 2, 2, 2] to 4*2 gameboard", () => {
        const board = Gameboard(4, 2);
        expect(() => {
            GameboardController.addShip(board, 2);
            GameboardController.addShip(board, 2);
            GameboardController.addShip(board, 2);
            GameboardController.addShip(board, 2);
            GameboardController.addShip(board, 2);
        }).toThrow();
    });

    test("Add ship of length 0", () => {
        const board = Gameboard(4, 2);
        expect(() => {
            GameboardController.addShip(board, 0);
        }).toThrow();
    });

    test("Pass string parameter", () => {
        const board = Gameboard(4, 2);
        expect(() => {
            GameboardController.addShip(board, "2");
        }).toThrow();
    });

    test("Pass float parameter", () => {
        const board = Gameboard(4, 2);
        expect(() => {
            GameboardController.addShip(board, 2.5);
        }).toThrow();
    });
});

describe("Placing ships", () => {
    test(`
        In 4*2 gameboard:
        place first ship of length 2 vertically at (0, 0)
        + place second ship of length 3 horizontally at (0, 1)`, () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 3);
        GameboardController.placeShip(board, 0, 0, 0, true);
        GameboardController.placeShip(board, 1, 0, 1, false);
        const expectedShipsBoard = [
            [0, 1, 1, 1],
            [0, -1, -1, -1],
        ];
        expect(board.getShipsBoard()).toEqual(expectedShipsBoard);
    });

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 horizontally at (0, 1)
    + place 3rd ship of length 2 vertically at (0, 3)`, () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        GameboardController.placeShip(board, 1, 0, 1, false);
        GameboardController.placeShip(board, 2, 0, 3, true);
        const expectedShipsBoard = [
            [0, 1, 1, 2],
            [0, -1, -1, 2],
        ];
        expect(board.getShipsBoard()).toEqual(expectedShipsBoard);
    });

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 vertically at same position (0, 0)`, () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        expect(GameboardController.placeShip(board, 1, 0, 0, true)).toBe(false);
    });

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 horizontally at (0, 0)`, () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        expect(GameboardController.placeShip(board, 1, 0, 0, false)).toBe(false);
    });

    test(`
    In 4*2 gameboard:
    place 1st ship of length 4 horizontally at (0, 0)
    + place 2nd ship of length 2 vertically at (0, 2)`, () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 4);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, false);
        expect(GameboardController.placeShip(board, 1, 0, 2, true)).toBe(false);
    });

    test("In 4*2 gameboard: place ship of length 2 at (-1, 0)", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 2);
            GameboardController.placeShip(board, 0, -1, 0, true);
        }).toThrow();
    });

    test("In 4*2 gameboard: place ship of length 3 at (0, 2)", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 3);
        expect(GameboardController.placeShip(board, 0, 0, 2, true)).toBe(false);
    });

    test("Pass negative shipIndex", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 2);
            GameboardController.placeShip(board, -1, 0, 2, true);
        }).toThrow();
    });

    test("Pass string coordinates", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 2);
            GameboardController.placeShip(board, 0, "0", "2", true);
        }).toThrow();
    });

    test("Pass float coordinates", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 2);
            GameboardController.placeShip(board, 0, 0.5, 2.2, true);
        }).toThrow();
    });

    test("Pass integer as isVertical paramter", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 2);
            GameboardController.placeShip(board, 0, 0, 2, 1);
        }).toThrow();
    });

    test("Auto place ships possible arrangement", () => {
        const board = Gameboard(6, 5);
        const shipsLength = [2, 2, 2, 3, 3, 6, 6, 6];
        shipsLength.forEach((shipLength) => {
            GameboardController.addShip(board, shipLength);
        });
        expect(GameboardController.autoPlaceShips(board)).toBe(true);
    });

    test("Check if all ships placed", () => {
        const board = Gameboard(6, 5);
        const shipsLength = [2, 2, 2, 3, 3, 6, 6, 6];
        shipsLength.forEach((shipLength) => {
            GameboardController.addShip(board, shipLength);
        });
        GameboardController.autoPlaceShips(board);
        expect(GameboardChecker.checkIfAllShipsPlaced(board)).toBe(true);
    });

    test("Check if all ships placed", () => {
        const board = Gameboard(6, 5);
        const shipsLength = [2, 2, 2, 3, 3, 6, 6, 6];
        shipsLength.forEach((shipLength) => {
            GameboardController.addShip(board, shipLength);
        });
        GameboardController.placeShip(board, 0, 0, 0, true);
        expect(GameboardChecker.checkIfAllShipsPlaced(board)).toBe(false);
    });

    test("Unplace all ships", () => {
        const board = Gameboard(6, 5);
        const shipsLength = [2, 2, 2, 3, 3, 6, 6, 6];
        shipsLength.forEach((shipLength) => {
            GameboardController.addShip(board, shipLength);
        });
        GameboardController.autoPlaceShips(board);
        GameboardController.unplaceAllShips(board);
        expect(GameboardChecker.checkIfNonOfShipsPlaced(board)).toBe(true);
    });

    test("Remove all ships", () => {
        const board = Gameboard(6, 5);
        const shipsLength = [2, 2, 2, 3, 3, 6, 6, 6];
        shipsLength.forEach((shipLength) => {
            GameboardController.addShip(board, shipLength);
        });
        GameboardController.autoPlaceShips(board);
        GameboardController.removeAllShips(board);
        const shipsBoard = board.getShipsBoard();
        let shipsBoardcellNotEmpty = false;
        outerShipsBoardLoop: for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                if (shipsBoard[i][j] !== -1) {
                    shipsBoardcellNotEmpty = true;
                    break outerShipsBoardLoop;
                }
            }
        }

        const hitsBoard = board.getHitsBoard();
        let hitsBoardCellNotEmpty = false;
        outerHitsBoardLoop: for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                if (hitsBoard[i][j] !== 0) {
                    hitsBoardCellNotEmpty = true;
                    break outerHitsBoardLoop;
                }
            }
        }

        const result = [
            board.getShipsCount(),
            board.getShips().length,
            shipsBoardcellNotEmpty,
            hitsBoardCellNotEmpty,
        ];
        const expected = [0, 0, false, false];
        expect(result).toEqual(expected);
    });
});

describe("Receiving attack", () => {
    test("Check if there is a hit after one attack", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 3);
        GameboardController.placeShip(board, 0, 0, 0, false);
        GameboardController.receiveAttack(board, 0, 1);
        const expectedHitsBoard = [
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ];
        expect(board.getHitsBoard()).toEqual(expectedHitsBoard);
    });

    test("Check if a cell can be attacked twice", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, 0, 1);
            GameboardController.receiveAttack(board, 0, 1);
        }).toThrow();
    });

    test("Check if ship is sunk after attacking all its cells", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 3);
        GameboardController.placeShip(board, 0, 0, 0, false);
        GameboardController.receiveAttack(board, 0, 0);
        GameboardController.receiveAttack(board, 0, 1);
        GameboardController.receiveAttack(board, 0, 2);
        expect(board.getShip(0).isSunk()).toEqual(true);
    });

    test("Check if all ships are sunk after attacking all of their cells", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        GameboardController.placeShip(board, 1, 1, 2, false);
        GameboardController.receiveAttack(board, 0, 0);
        GameboardController.receiveAttack(board, 1, 0);
        GameboardController.receiveAttack(board, 1, 2);
        GameboardController.receiveAttack(board, 1, 3);
        expect(GameboardChecker.areAllShipsSunk(board)).toEqual(true);
    });

    test("Pass strings paramters as coordinates", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, "0", "0");
        }).toThrow();
    });
});

describe("Get ships", () => {
    test("Add nine ships of lengths [ 1 x2, 2 x4, 3 x1, 4 x1, 8 x1] to 10*10 gameboard", () => {
        const board = Gameboard(10, 10);
        const indices = [];
        indices.push(GameboardController.addShip(board, 1));
        indices.push(GameboardController.addShip(board, 1));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 2));
        indices.push(GameboardController.addShip(board, 3));
        indices.push(GameboardController.addShip(board, 4));
        indices.push(GameboardController.addShip(board, 8));
        expect(board.getShipsList()).toEqual({
            1: 2,
            2: 4,
            3: 1,
            4: 1,
            8: 1,
        });
    });
});

test("Get not damaged cells", () => {
    const board = Gameboard(4, 2);
    GameboardController.addShip(board, 2);
    GameboardController.addShip(board, 2);
    GameboardController.placeShip(board, 0, 0, 0, false);
    GameboardController.placeShip(board, 1, 0, 3, true);
    GameboardController.receiveAttack(board, 0, 0);
    GameboardController.receiveAttack(board, 1, 3);
    expect(GameboardController.getNotDamagedCells(board)).toEqual([
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
    ]);
});

/*
test("Get damaged cells", () => {
    const board = Gameboard(4, 2);
    GameboardController.addShip(board, 2);
    GameboardController.addShip(board, 2);
    GameboardController.placeShip(board, 0, 0, 0, false);
    GameboardController.placeShip(board, 1, 0, 3, true);
    GameboardController.receiveAttack(board, 0, 0);
    GameboardController.receiveAttack(board, 1, 3);
    expect(GameboardController.getDamagedCells(board)).toEqual([
        { row: 0, col: 0 },
        { row: 1, col: 3 },
    ]);
});

test("Get damaged cells", () => {
    const board = Gameboard(4, 2);
    GameboardController.addShip(board, 2);
    GameboardController.addShip(board, 2);
    GameboardController.placeShip(board, 0, 0, 0, false);
    GameboardController.placeShip(board, 1, 0, 3, true);
    GameboardController.receiveAttack(board, 0, 0);
    GameboardController.receiveAttack(board, 1, 3);
    expect(GameboardController.getDamagedCells(board)).toEqual([
        { row: 0, col: 0 },
        { row: 1, col: 3 },
    ]);
});
*/
describe("temp", () => {
    test("Get damaged cells of alive damaged ships 1", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, false);
        GameboardController.placeShip(board, 1, 0, 3, true);
        GameboardController.receiveAttack(board, 0, 0);
        GameboardController.receiveAttack(board, 1, 3);
        expect(GameboardController.getDamagedCellsOfAliveDamagedShips(board, 1, 1)).toEqual([
            { row: 0, col: 0, isShipVertical: false },
            { row: 1, col: 3, isShipVertical: true },
        ]);
    });

    test("Get damaged cells of alive damaged ships 2", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, false);
        GameboardController.placeShip(board, 1, 0, 3, true);
        GameboardController.receiveAttack(board, 0, 3);
        GameboardController.receiveAttack(board, 1, 3);
        expect(GameboardController.getDamagedCellsOfAliveDamagedShips(board, 1, 10)).toEqual([]);
    });

    test("Get damaged cells of alive damaged ships 3", () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 3);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, false);
        GameboardController.placeShip(board, 1, 0, 3, true);
        GameboardController.receiveAttack(board, 0, 1);
        GameboardController.receiveAttack(board, 0, 2);
        expect(GameboardController.getDamagedCellsOfAliveDamagedShips(board, 1, 10)).toEqual([
            { row: 0, col: 1, isShipVertical: false },
            { row: 0, col: 2, isShipVertical: false },
        ]);
    });
});

describe("Get best cells to target", () => {
    function createBoard() {
        /*
            3 o o o o
            3 4 4 4 4
            3 o o o o
            o o 2 2 o
            o 1 o o o
        */
        const board = Gameboard(5, 5);
        GameboardController.addShip(board, 1);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 3);
        GameboardController.addShip(board, 4);
        GameboardController.placeShip(board, 0, 4, 1, false);
        GameboardController.placeShip(board, 1, 3, 2, false);
        GameboardController.placeShip(board, 2, 0, 0, true);
        GameboardController.placeShip(board, 3, 1, 1, false);
        return board;
    }

    function createBoard2() {
        /*
            1 o o o o
            1 x o o x
            1 o x x o
        */
        const board = Gameboard(5, 3);
        GameboardController.addShip(board, 3);
        GameboardController.placeShip(board, 0, 0, 0, true);
        GameboardController.receiveAttack(board, 1, 1);
        GameboardController.receiveAttack(board, 1, 4);
        GameboardController.receiveAttack(board, 2, 2);
        GameboardController.receiveAttack(board, 2, 3);
        return board;
    }

    function cellsSort(a, b) {
        if (a.row === b.row) {
            return a.col - b.col;
        }
        return a.row - b.row;
    }

    test("Get best targets 01", () => {
        const board = createBoard();
        GameboardController.receiveAttack(board, 2, 0);
        GameboardController.receiveAttack(board, 1, 2);
        GameboardController.receiveAttack(board, 1, 3);
        GameboardController.receiveAttack(board, 4, 1);
        const expected = [
            { row: 1, col: 1 },
            { row: 1, col: 4 },
        ].sort(cellsSort);
        expect(GameboardController.getSmartTargets(board).sort(cellsSort)).toEqual(expected);
    });

    test("Get best targets 02", () => {
        const board = createBoard();
        GameboardController.receiveAttack(board, 2, 0);
        GameboardController.receiveAttack(board, 4, 1);
        const expected = [
            { row: 1, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 0 },
        ].sort(cellsSort);
        expect(GameboardController.getSmartTargets(board).sort(cellsSort)).toEqual(expected);
    });

    test("Get best targets 03", () => {
        const board = createBoard2();
        const expected = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
        ].sort(cellsSort);
        expect(GameboardController.getNotDamagedSmartTargets(board).sort(cellsSort)).toEqual(
            expected,
        );
    });

    test("Get Min Not Damaged Ship Length", () => {
        const board = createBoard();
        GameboardController.receiveAttack(board, 1, 0);
        GameboardController.receiveAttack(board, 2, 0);
        GameboardController.receiveAttack(board, 1, 1);
        GameboardController.receiveAttack(board, 4, 1);
        expect(GameboardController.getMinNotDamagedShipLength(board)).toBe(2);
    });

    test("Get Min Not Damaged Ship Length", () => {
        const board = createBoard();
        expect(GameboardController.getMinNotDamagedShipLength(board)).toBe(1);
    });
});
