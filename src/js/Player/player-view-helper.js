const playerViewHelper = (() => {
    function createShipElement(length, limit) {
        const ship = document.createElement("div");

        if (length < limit) {
            ship.classList.add("ship");
            for (let i = 0; i < length; i++) {
                const shipBlock = document.createElement("div");
                shipBlock.classList.add("ship-block");
                ship.append(shipBlock);
            }
        } else {
            ship.classList.add("ship-compressed");
            const leftParenthesis = document.createElement("span");
            leftParenthesis.classList.add("parenthesis");
            leftParenthesis.textContent = "(";
            ship.append(leftParenthesis);

            ship.append(document.createTextNode(`${length}${String.fromCharCode(160)}`));
            const shipBlock = document.createElement("div");
            shipBlock.classList.add("ship-block");
            ship.append(shipBlock);

            const rightParenthesis = document.createElement("span");
            rightParenthesis.classList.add("parenthesis");
            rightParenthesis.textContent = ")";
            ship.append(rightParenthesis);
        }
        return ship;
    }

    function createShipContainerElement(length, count) {
        const shipContainer = document.createElement("div");
        shipContainer.classList.add("ship-container");
        shipContainer.append(createShipElement(length, 4));

        const p = document.createElement("p");
        p.innerText = "x";
        const shipsCountSpan = document.createElement("span");
        shipsCountSpan.classList.add("count");
        shipsCountSpan.innerText = count;
        p.append(shipsCountSpan);
        shipContainer.append(p);

        shipContainer.dataset.length = length;
        return shipContainer;
    }

    return {
        createShipContainerElement,
        createShipElement,
    };
})();

export default playerViewHelper;
