import Gameboard from "./gameboard-module";
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
        + place second ship of length 3 horizontally at (0, 1)`,
    () => {
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
    },
    );

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 horizontally at (0, 1)
    + place 3rd ship of length 2 vertically at (0, 3)`,
    () => {
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
    },
    );

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 vertically at same position (0, 0)`,
    () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        expect(GameboardController.placeShip(board, 1, 0, 0, true)).toBe(false);
    },
    );

    test(`
    In 4*2 gameboard:
    place 1st ship of length 2 vertically at (0, 0)
    + place 2nd ship of length 2 horizontally at (0, 0)`,
    () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 2);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, true);
        expect(GameboardController.placeShip(board, 1, 0, 0, false)).toBe(false);
    },
    );

    test(`
    In 4*2 gameboard:
    place 1st ship of length 4 horizontally at (0, 0)
    + place 2nd ship of length 2 vertically at (0, 2)`,
    () => {
        const board = Gameboard(4, 2);
        GameboardController.addShip(board, 4);
        GameboardController.addShip(board, 2);
        GameboardController.placeShip(board, 0, 0, 0, false);
        expect(GameboardController.placeShip(board, 1, 0, 2, true)).toBe(false);
    },
    );

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
});

describe("Receiving attack", () => {
    test("Check if there is a hit after one attack",
        () => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, 0, 1);
            const expectedHitsBoard = [[0, 1, 0, 0], [0, 0, 0, 0]];
            expect(board.getHitsBoard()).toEqual(expectedHitsBoard);
        },
    );

    test("Check if a cell can be attacked twice", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, 0, 1);
            GameboardController.receiveAttack(board, 0, 1);
        }).toThrow();
    });

    test("Check if ship is sunk after attacking all its cells",
        () => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, 0, 0);
            GameboardController.receiveAttack(board, 0, 1);
            GameboardController.receiveAttack(board, 0, 2);
            expect(board.getShip(0).isSunk()).toEqual(true);
        },
    );

    test("Check if all ships are sunk after attacking all of their cells",
        () => {
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
        },
    );

    test("Pass strings paramters as coordinates", () => {
        expect(() => {
            const board = Gameboard(4, 2);
            GameboardController.addShip(board, 3);
            GameboardController.placeShip(board, 0, 0, 0, false);
            GameboardController.receiveAttack(board, "0", "0");
        }).toThrow();
    });
});
