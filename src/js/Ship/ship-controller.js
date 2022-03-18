export default function Ship(length) {
    let hpRemained = length;
    const hitpoints = [];
    for (let i = 0; i < length; i++) {
        hitpoints[i] = 0;
    }
    const proto = {
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
        getHPRemained() {
            return hpRemained;
        },
        getHitpoints() {
            return [...hitpoints];
        },
        getHPDamaged() {
            return length - hpRemained;
        },
        getLength() {
            return length;
        },
    };
    return Object.create(proto);
}
