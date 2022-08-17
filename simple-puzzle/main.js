const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const canvasWidth = 800; // Cols
const canvasHeight = 800; // Rows
const pieceWidth = 30;
const pieceHeight = 30;
const offset = 20;
const axis1Div = 5;
const axis2Div = 4;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const generateButton = document.getElementById("gen");
const solveButton = document.getElementById("sol");
const scrambleButton = document.getElementById("scr");
const imperfectCheckBox = document.getElementById("noise");
const drawCheckBox = document.getElementById("draw");
const speedRange = document.getElementById("speed");
const swapCheckBox = document.getElementById("swap");
const errorDiv = document.getElementById("err-msg-container");

speedRange.min = 0;
speedRange.max = 1000;
speedRange.value = 500;

const puzzleRows = 20; // Height
const puzzleCols = 20; // Width

/** @type {PuzzleBoard} */
let board;

const msgMap = new Map();

generateButton.addEventListener("click", (event) => {
    removeChildNodes(errorDiv);
    msgMap.clear();
    board = new PuzzleBoard(
        puzzleRows,
        puzzleCols,
        imperfectCheckBox,
        drawCheckBox,
        () =>
            new Promise((res) =>
                window.requestAnimationFrame((currTime) => {
                    draw(currTime);
                    res();
                })
            ),
        speedRange,
        swapCheckBox,
        showError
    );
    window.requestAnimationFrame(draw);
});

scrambleButton.addEventListener("click", (event) => {
    if (!board) {
        showError("Error: A puzzle needs to be generated first!");
        return;
    }
    board.scrambleBoard();
    window.requestAnimationFrame(draw);
});

solveButton.addEventListener("click", async (event) => {
    if (!board) {
        showError("Error: A puzzle needs to be generated first!");
        return;
    }
    await board.solveBoard();
    window.requestAnimationFrame(draw);
});

function showError(msg) {
    if (!msgMap.has(msg)) {
        const errPar = document.createElement("p");
        errPar.classList.add("err-msg");
        errPar.textContent = msg;
        errorDiv.appendChild(errPar);
        msgMap.set(msg, [null, errPar]);
    }
    let [clearError, errPar] = msgMap.get(msg);
    clearTimeout(clearError);
    clearError = setTimeout(() => {
        errPar.remove();
        msgMap.delete(msg);
    }, 1500);
    msgMap.set(msg, [clearError, errPar]);
}

let prevTime = 0;
let interTime = 0;

function draw(currTime) {
    const intervalTime = currTime - prevTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevFillStyle = ctx.fillStyle;

    const rows = board.rows;
    const cols = board.cols;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const piece = board.board[i][j];
            const xCoord = j * pieceWidth + offset;
            const yCoord = i * pieceHeight + offset;

            ctx.fillStyle = `rgba(100, ${piece.j * 10}, ${piece.i * 10}, 0.5)`;

            ctx.beginPath();
            ctx.moveTo(xCoord, yCoord);
            if (piece.topSect !== 0) {
                const isConcave = piece.topSect < 0;
                ctx.ellipse(
                    xCoord + pieceWidth / 2,
                    yCoord,
                    pieceWidth / axis2Div,
                    pieceHeight / axis1Div,
                    0,
                    Math.PI,
                    0,
                    isConcave
                );
            }
            ctx.lineTo(xCoord + pieceWidth, yCoord);
            if (piece.rightSect !== 0) {
                const isConcave = piece.rightSect < 0;
                ctx.ellipse(
                    xCoord + pieceWidth,
                    yCoord + pieceHeight / 2,
                    pieceWidth / axis1Div,
                    pieceHeight / axis2Div,
                    0,
                    (3 / 2) * Math.PI,
                    (1 / 2) * Math.PI,
                    isConcave
                );
            }
            ctx.lineTo(xCoord + pieceWidth, yCoord + pieceHeight);
            if (piece.bottomSect !== 0) {
                const isConcave = piece.bottomSect < 0;
                ctx.ellipse(
                    xCoord + pieceWidth / 2,
                    yCoord + pieceHeight,
                    pieceWidth / axis2Div,
                    pieceHeight / axis1Div,
                    0,
                    0,
                    Math.PI,
                    isConcave
                );
            }
            ctx.lineTo(xCoord, yCoord + pieceHeight);
            if (piece.leftSect !== 0) {
                const isConcave = piece.leftSect < 0;
                ctx.ellipse(
                    xCoord,
                    yCoord + pieceHeight / 2,
                    pieceWidth / axis1Div,
                    pieceHeight / axis2Div,
                    0,
                    (1 / 2) * Math.PI,
                    (3 / 2) * Math.PI,
                    isConcave
                );
            }
            ctx.lineTo(xCoord, yCoord);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    ctx.fillStyle = prevFillStyle;
    interTime = intervalTime;
    prevTime = currTime;
}
