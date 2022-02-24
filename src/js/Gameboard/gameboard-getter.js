const GameboardGetter = (() => {
    function maxHorizontalLengthCanBeOccupied(board) {
        let horizontalLength = 0;
        const shipsBoard = board.getShipsBoard();
        for (let i = 0; i < board.getHeight(); i++) {
            for (let j = 0; j < board.getWidth(); j++) {
                if (shipsBoard[i][j] === -1) {
                    let cnt = 1;
                    while (true) {
                        if (j + 1 === board.getWidth() || shipsBoard[i][j + 1] !== -1) {
                            horizontalLength = Math.max(horizontalLength, cnt);
                            break;
                        }
                        ++cnt;
                        ++j;
                    }
                }
            }
        }
        return horizontalLength;
    }

    function maxVerticalLengthCanBeOccupied(board) {
        let verticalLength = 0;
        const shipsBoard = board.getShipsBoard();
        for (let j = 0; j < board.getWidth(); j++) {
            for (let i = 0; i < board.getHeight(); i++) {
                if (shipsBoard[i][j] === -1) {
                    let cnt = 1;
                    while (true) {
                        if (i + 1 === board.getHeight() || shipsBoard[i + 1][j] !== -1) {
                            verticalLength = Math.max(verticalLength, cnt);
                            break;
                        }
                        ++cnt;
                        ++i;
                    }
                }
            }
        }
        return verticalLength;
    }

    return {
        maxHorizontalLengthCanBeOccupied,
        maxVerticalLengthCanBeOccupied,
    };
})();

export default GameboardGetter;
