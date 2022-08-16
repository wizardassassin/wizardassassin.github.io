class PuzzlePiece {
    i;
    j;
    i2;
    j2;
    topSect;
    rightSect;
    bottomSect;
    leftSect;

    static Corner = 2;
    static Edge = 1;
    static Center = 0;

    /**
     * Numerical representation of section.
     * Negative (-) is concave. Positive (+) is convex.
     * Decimals work. Zero (0) is a straight section/surface.
     *
     * @param {Number} i
     * @param {Number} j
     * @param {Number} topSect
     * @param {Number} rightSect
     * @param {Number} bottomSect
     * @param {Number} leftSect
     */
    constructor(i, j, topSect, rightSect, bottomSect, leftSect) {
        this.i = i;
        this.j = j;
        this.topSect = topSect;
        this.rightSect = rightSect;
        this.bottomSect = bottomSect;
        this.leftSect = leftSect;
    }

    getPieceType() {
        return (
            Number(this.topSect === 0) +
            Number(this.rightSect === 0) +
            Number(this.bottomSect === 0) +
            Number(this.leftSect === 0)
        );
    }

    hasCompliment(sect) {
        return (
            -this.topSect === sect ||
            -this.rightSect === sect ||
            -this.bottomSect === sect ||
            -this.leftSect === sect
        );
    }

    scramblePiece() {
        this.flipPieceRandom();
        this.rotatePieceRandom();
    }

    // Random.
    flipPieceRandom() {
        if (Math.random() < 0.5) {
            return;
        }
        if (Math.random() < 0.5) {
            [this.topSect, this.bottomSect] = [this.bottomSect, this.topSect];
            return;
        }
        [this.rightSect, this.leftSect] = [this.leftSect, this.rightSect];
    }

    // Random.
    rotatePieceRandom() {
        const rotations = Math.floor(Math.random() * 4);
        let i = 0;
        // Clockwise rotation
        while (i < rotations) {
            [this.topSect, this.rightSect, this.bottomSect, this.leftSect] = [
                this.leftSect,
                this.topSect,
                this.rightSect,
                this.bottomSect,
            ];
            i++;
        }
    }

    /**
     * Rotate the piece.
     *
     * @param {Number} rotations
     * @param {Boolean} counterclockwise
     */
    rotatePiece(rotations = 1, counterclockwise = false) {
        let i = 0;
        while (i < rotations) {
            if (!counterclockwise) {
                [this.topSect, this.rightSect, this.bottomSect, this.leftSect] =
                    [
                        this.leftSect,
                        this.topSect,
                        this.rightSect,
                        this.bottomSect,
                    ];
            } else {
                [this.topSect, this.rightSect, this.bottomSect, this.leftSect] =
                    [
                        this.rightSect,
                        this.bottomSect,
                        this.leftSect,
                        this.topSect,
                    ];
            }
            i++;
        }
    }

    /**
     * Flips the piece.
     *
     * @param {Boolean} sideways
     */
    flipPiece(sideways = false) {
        if (!sideways) {
            [this.topSect, this.bottomSect] = [this.bottomSect, this.topSect];
            return;
        }
        [this.rightSect, this.leftSect] = [this.leftSect, this.rightSect];
    }
}
