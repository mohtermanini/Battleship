const BoardHelper = (() => {
    function getBlockIndexFromCoordinates(row, col, boardWidth) {
        return row * boardWidth + col;
    }

    function getCoordinatesFromBlockIndex(blockIndex, boardWidth) {
        const row = Math.floor(blockIndex / boardWidth);
        const col = blockIndex % boardWidth;
        return [row, col];
    }

    function getBlockTopOffset(boardElement, blockIndex) {
        const block = Array.from(boardElement.children)[blockIndex];
        return block.offsetTop;
    }

    function getBlockIndexFromBlockElement(boardElement, blockElement) {
        return Array.from(boardElement.children).indexOf(blockElement);
    }

    function getBlockLeftOffset(boardElement, blockIndex) {
        const block = Array.from(boardElement.children)[blockIndex];
        return block.offsetLeft;
    }

    function createShipElement(length, isVertical) {
        const shipElement = document.createElement("div");
        shipElement.classList.add("ship");
        for (let i = 0; i < length; i++) {
            const shipBlock = document.createElement("div");
            shipBlock.classList.add("ship-block");
            shipElement.append(shipBlock);
        }
        shipElement.classList.add(`${isVertical ? "vertical" : "horizontal"}`);
        return shipElement;
    }

    function createShipOnBoard(
        boardElement,
        boardWidth,
        row,
        col,
        length,
        isVertical,
        id,
        shipElement,
    ) {
        if (shipElement === undefined) {
            shipElement = BoardHelper.createShipElement(length, isVertical);
            shipElement.dataset.id = id;
        }
        const blockIndex = BoardHelper.getBlockIndexFromCoordinates(row, col, boardWidth);
        shipElement.style.top = `${BoardHelper.getBlockTopOffset(boardElement, blockIndex)}px`;
        shipElement.style.left = `${BoardHelper.getBlockLeftOffset(boardElement, blockIndex)}px`;
        shipElement.style["flex-direction"] = `${isVertical ? "column" : "row"}`;
        boardElement.append(shipElement);
    }

    return {
        getBlockIndexFromCoordinates,
        getCoordinatesFromBlockIndex,
        getBlockIndexFromBlockElement,
        getBlockTopOffset,
        getBlockLeftOffset,
        createShipElement,
        createShipOnBoard,
    };
})();

export default BoardHelper;
