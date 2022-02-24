import Ship from "./ship-controller";

describe("hit function", () => {
    test("hit ship of length 3 at index 0", () => {
        let ship = new Ship(3);
        ship.hit(0);
        expect(ship.getHitpoints()).toEqual([1, 0, 0]);
    });
    
    test("hit ship of length 3 at index 0 two times", () => {
        let ship = new Ship(3);
        ship.hit(0);
        ship.hit(0);
        expect(ship.getHitpoints()).toEqual([1, 0, 0]);
    });
    
    test("hit ship of length 3 at index -1", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit(-1)
        }).toThrow();
    });
    
    test("hit ship of length 3 at index 3", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit(3)
        }).toThrow();
    });

    test("hit ship of length 3 at index 4", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit(4)
        }).toThrow();
    });
    
    test("call hit ship function without paramteres", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit()
        }).toThrow();
    });

    test("call hit ship function with paramter index of type string", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit("0")
        }).toThrow();
    });
    
    test("call hit ship function with paramter index of 0.5", () => {
        let ship = new Ship(3);
        expect(() => {
            ship.hit(0.5)
        }).toThrow();
    });
});

describe("isSunk function", () => {
    test("isSunk of ship of length 3 after hit all positions", () => {
        let ship = new Ship(3);
        ship.hit(0);
        ship.hit(1);
        ship.hit(2);
        expect(ship.isSunk()).toBe(true);
    });

    test("isSunk of ship of length 3 after hit 2 positions", () => {
        let ship = new Ship(3);
        ship.hit(0);
        ship.hit(2);
        expect(ship.isSunk()).toBe(false);
    });

    test("isSunk of ship of length 3 after hit 1 position", () => {
        let ship = new Ship(3);
        ship.hit(0);
        expect(ship.isSunk()).toBe(false);
    });
});

describe("getLength function", () => {
    test("ship of length 3", () => {
        let ship = new Ship(3);
        expect(ship.getLength()).toBe(3);
    });
})