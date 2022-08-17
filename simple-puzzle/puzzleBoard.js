class PuzzleBoard {
    rows;
    cols;
    isImperfect;
    drawWhile;
    drawFunc;
    drawTime;
    swapVal;
    showErr;
    staticSwap;
    isSolving;
    isScrambled;
    board;

    /**
     * Callback for drawing to the canvas.
     *
     * @callback drawCallback
     */

    /**
     * Callback for outputting an error.
     *
     * @callback errCallback
     */

    /**
     *
     * @param {Number} rows
     * @param {Number} cols
     * @param {HTMLInputElement} isImperfect
     * @param {HTMLInputElement} drawWhile
     * @param {drawCallback} drawFunc
     * @param {HTMLInputElement} drawTime
     * @param {HTMLInputElement} swapVal
     * @param {errCallback} showErr
     */
    constructor(
        rows,
        cols,
        isImperfect,
        drawWhile,
        drawFunc,
        drawTime,
        swapVal,
        showErr
    ) {
        this.rows = rows;
        this.cols = cols;
        this.isImperfect = isImperfect;
        this.drawWhile = drawWhile;
        this.drawFunc = drawFunc;
        this.drawTime = drawTime;
        this.swapVal = swapVal;
        this.showErr = showErr;
        this.board = [];
        for (let i = 0; i < rows; i++) {
            /** @type {Array<PuzzlePiece>} */
            const rowArr = [];
            let prevPiece;
            for (let j = 0; j < cols; j++) {
                prevPiece = rowArr[j - 1];
                const sectProp = this.getSectProp(i, j, prevPiece);
                rowArr.push(new PuzzlePiece(i, j, ...sectProp));
            }
            this.board.push(rowArr);
        }
    }

    /**
     * Math.random() !== Math.random() |
     * probably true, or at least not
     * false often enough to be concerned about.
     *
     * @param {Number} i
     * @param {Number} j
     * @param {PuzzlePiece | undefined} prevPiece
     * @returns number[]
     */
    getSectProp(i, j, prevPiece) {
        const sections = [0, 0, 0, 0];
        const err = this.isImperfect ? Math.random() : 0;
        // Top Section
        if (i !== 0) {
            sections[0] = -1 * this.board[i - 1][j].bottomSect;
        }
        // Right Section
        if (j !== this.cols - 1) {
            const posOrNeg = Math.random() < 0.5 ? 1 : -1;
            sections[1] = posOrNeg * Math.random();
        }
        // Bottom Section
        if (i !== this.rows - 1) {
            const posOrNeg = Math.random() < 0.5 ? 1 : -1;
            sections[2] = posOrNeg * Math.random();
        }
        // Left Section
        if (j !== 0) {
            sections[3] = -1 * prevPiece.rightSect;
        }
        return sections;
    }

    validateBoard() {
        let isSolved = this.isSolvedBoard();
        let isNotFlipped = isSolved ? this.isNotFlippedBoard() : null;
        let isNotRotated = isNotFlipped ? this.isNotRotatedBoard() : null;

        return { isSolved, isNotFlipped, isNotRotated };
    }

    isSolvedBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const LRMatch =
                    !this.board[i]?.[j + 1] ||
                    this.board[i][j].rightSect +
                        this.board[i][j + 1].leftSect ==
                        0;
                const TBMatch =
                    !this.board[i + 1]?.[j] ||
                    this.board[i][j].bottomSect +
                        this.board[i + 1][j].topSect ==
                        0;
                if (!LRMatch || !TBMatch) {
                    return false;
                }
            }
        }
        return true;
    }

    isNotFlippedBoard() {
        const topLeftCheck =
            this.isCoord(0, 0, 0, 0) && this.isCoord(0, 1, 0, 1);
        const topRightCheck =
            this.isCoord(0, this.cols - 1, 0, 0) &&
            this.isCoord(1, this.cols - 1, 0, 1);
        const bottomRightCheck =
            this.isCoord(this.rows - 1, this.cols - 1, 0, 0) &&
            this.isCoord(this.rows - 1, this.cols - 2, 0, 1);
        const bottomLeftCheck =
            this.isCoord(this.rows - 1, 0, 0, 0) &&
            this.isCoord(this.rows - 2, 0, 0, 1);
        return (
            topLeftCheck || topRightCheck || bottomRightCheck || bottomLeftCheck
        );
    }

    isNotRotatedBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.isCoord(i, j, i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    isCoord(row1, col1, row2, col2) {
        const piece = this.board[row1][col1];
        return piece.i === row2 && piece.j === col2;
    }

    scrambleBoard() {
        if (this.isSolving) {
            this.showErr("Error: Can't scramble while solving!");
            return;
        }
        shuffle2D(this.board);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const piece = this.board[i][j];
                piece.i2 = i;
                piece.j2 = j;
                piece.scramblePiece();
            }
        }
        this.isScrambled = true;
    }

    async modifyBoard(i, j, val) {
        const tmpVal = this.board[i][j];
        this.board[i][j] = val;
        if (this.drawWhile.checked) {
            if (this.staticSwap !== this.swapVal.checked) {
                this.showErr(
                    "Error: Piece swapping can't be changed while solving!"
                );
                this.swapVal.checked = this.staticSwap;
            }
            if (this.staticSwap) {
                tmpVal.i2 = val.i2;
                tmpVal.j2 = val.j2;
                val.i2 = i;
                val.j2 = j;
                this.board[tmpVal.i2][tmpVal.j2] = tmpVal;
            }
            // https://www.desmos.com/calculator/nfv6la99mi
            const x = this.drawTime.value;
            const time = 1000 - Math.sqrt(2000 * x - x ** 2); // Curved
            // const time = 1000 - x; // Linear
            const start = performance.now();
            await this.drawFunc();
            const wait = time - (performance.now() - start);
            await sleep(wait);
            // console.log(wait);
        }
    }

    async solveBoard() {
        if (this.isSolving) {
            this.showErr("Error: Can't solve while solving!");
            return;
        }
        this.isSolving = true;
        if (!this.isScrambled) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    const piece = this.board[i][j];
                    piece.i2 = i;
                    piece.j2 = j;
                }
            }
        }
        this.staticSwap = this.swapVal.checked;
        if (this.isImperfect.checked) {
            this.solveBoardImperfect();
            return;
        }
        const flattenedPuzzle = this.board.flat();
        const cornorPieces = new LinkedList();
        const edgePieces = new LinkedList();
        const centerPieces = new LinkedList();
        for (const aPiece of flattenedPuzzle) {
            switch (aPiece.getPieceType()) {
                case PuzzlePiece.Corner:
                    cornorPieces.pushNode(new LLNode(aPiece));
                    break;
                case PuzzlePiece.Edge:
                    edgePieces.pushNode(new LLNode(aPiece));
                    break;
                case PuzzlePiece.Center:
                    centerPieces.pushNode(new LLNode(aPiece));
                    break;
            }
        }
        if (cornorPieces.length !== 4) {
            console.error(
                `Expected 4 corner pieces; received ${cornorPieces.length}.`
            );
        }

        /** @type {PuzzlePiece} */
        let prevPiece;
        /** @type {PuzzlePiece} */
        let currPiece;

        let i;
        let j;

        // Not sure how to abstract this futher.

        // Logic Top Start
        currPiece = cornorPieces.popNode().data;
        while (currPiece.topSect !== 0 || currPiece.leftSect !== 0) {
            currPiece.rotatePiece();
        }
        await this.modifyBoard(0, 0, currPiece);
        prevPiece = currPiece;
        j = 1;
        while (j < this.cols - 1) {
            currPiece = edgePieces.findNode((nodeIter) =>
                nodeIter.data.hasCompliment(prevPiece.rightSect)
            );
            edgePieces.removeNode(currPiece);
            currPiece = currPiece.data;
            while (-currPiece.leftSect !== prevPiece.rightSect) {
                currPiece.rotatePiece();
            }
            if (currPiece.topSect !== 0) {
                currPiece.flipPiece();
            }
            await this.modifyBoard(0, j, currPiece);
            prevPiece = currPiece;
            j++;
        }
        // Logic Top End
        // Logic Right Start
        currPiece = cornorPieces.findNode((nodeIter) =>
            nodeIter.data.hasCompliment(prevPiece.rightSect)
        );
        cornorPieces.removeNode(currPiece);
        currPiece = currPiece.data;
        while (-currPiece.leftSect !== prevPiece.rightSect) {
            currPiece.rotatePiece();
        }
        if (currPiece.topSect !== 0) {
            currPiece.flipPiece();
        }
        await this.modifyBoard(0, this.cols - 1, currPiece);
        prevPiece = currPiece;
        i = 1;
        while (i < this.rows - 1) {
            currPiece = edgePieces.findNode((nodeIter) =>
                nodeIter.data.hasCompliment(prevPiece.bottomSect)
            );
            edgePieces.removeNode(currPiece);
            currPiece = currPiece.data;
            while (-currPiece.topSect !== prevPiece.bottomSect) {
                currPiece.rotatePiece();
            }
            if (currPiece.rightSect !== 0) {
                currPiece.flipPiece(true);
            }
            await this.modifyBoard(i, this.cols - 1, currPiece);
            prevPiece = currPiece;
            i++;
        }
        // Logic Right End
        // Logic Bottom Start
        currPiece = cornorPieces.findNode((nodeIter) =>
            nodeIter.data.hasCompliment(prevPiece.bottomSect)
        );
        cornorPieces.removeNode(currPiece);
        currPiece = currPiece.data;
        while (-currPiece.topSect !== prevPiece.bottomSect) {
            currPiece.rotatePiece();
        }
        if (currPiece.rightSect !== 0) {
            currPiece.flipPiece(true);
        }
        await this.modifyBoard(this.rows - 1, this.cols - 1, currPiece);
        prevPiece = currPiece;
        j = this.cols - 2;
        while (j > 0) {
            currPiece = edgePieces.findNode((nodeIter) =>
                nodeIter.data.hasCompliment(prevPiece.leftSect)
            );
            edgePieces.removeNode(currPiece);
            currPiece = currPiece.data;
            while (-currPiece.rightSect !== prevPiece.leftSect) {
                currPiece.rotatePiece();
            }
            if (currPiece.bottomSect !== 0) {
                currPiece.flipPiece();
            }
            await this.modifyBoard(this.rows - 1, j, currPiece);
            prevPiece = currPiece;
            j--;
        }
        // Logic Bottom End
        // Logic Left Start
        currPiece = cornorPieces.findNode((nodeIter) =>
            nodeIter.data.hasCompliment(prevPiece.leftSect)
        );
        cornorPieces.removeNode(currPiece);
        currPiece = currPiece.data;
        while (-currPiece.rightSect !== prevPiece.leftSect) {
            currPiece.rotatePiece();
        }
        if (currPiece.bottomSect !== 0) {
            currPiece.flipPiece();
        }
        await this.modifyBoard(this.rows - 1, 0, currPiece);
        prevPiece = currPiece;
        i = this.rows - 2;
        while (i > 0) {
            currPiece = edgePieces.findNode((nodeIter) =>
                nodeIter.data.hasCompliment(prevPiece.topSect)
            );
            edgePieces.removeNode(currPiece);
            currPiece = currPiece.data;
            while (-currPiece.bottomSect !== prevPiece.topSect) {
                currPiece.rotatePiece();
            }
            if (currPiece.leftSect !== 0) {
                currPiece.flipPiece(true);
            }
            await this.modifyBoard(i, 0, currPiece);
            prevPiece = currPiece;
            i--;
        }
        // Logic Left End
        // Logic Center Start
        for (let i = 1; i < this.rows - 1; i++) {
            for (let j = 1; j < this.cols - 1; j++) {
                const refLeft = this.board[i][j - 1];
                const refTop = this.board[i - 1][j];
                let currPiece = centerPieces.findNode((nodeIter) =>
                    nodeIter.data.hasCompliment(refTop.bottomSect)
                );
                centerPieces.removeNode(currPiece);
                currPiece = currPiece.data;
                while (-currPiece.topSect !== refTop.bottomSect) {
                    currPiece.rotatePiece();
                }
                if (-currPiece.leftSect !== refLeft.rightSect) {
                    currPiece.flipPiece(true);
                }
                await this.modifyBoard(i, j, currPiece);
            }
        }
        // Logic Center End
        this.isSolving = false;
        this.isScrambled = false;
    }

    solveBoardImperfect() {
        console.error("Not yet implemented.");
    }
}
