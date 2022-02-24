export default function Ship(length) {
    let id;
    let hpRemained = length;
    let hitpoints = [];
    for (let i = 0; i < length; i++) {
        hitpoints[i] = 0;
    }
    let proto = {
        hit(index) {
            if (typeof index !== "number" || !Number.isInteger(index)) {
                throw new Error("Illegal Argument Exception");
            }
            if (index < 0 || index >= length) {
                throw new Error("Illegal Argument Exception");
            }
            if (hitpoints[index] === 0) {
                --hpRemained;
                hitpoints[index] = 1;
            }
        },
        isSunk() {
            return hpRemained === 0;
        },
        getHitpoints() {
            return [...hitpoints];
        },
        getLength() {
            return length;
        },
    };
    return Object.create(proto);
}