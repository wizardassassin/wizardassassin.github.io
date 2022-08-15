const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const canvasSize = 800;
const centerPos = canvasSize / 2;
const radius = centerPos - 50;
const miniRadius = 15;

const angleOfCircle = Math.PI * 2;
const secondsPerMinute = 60;
const twoPIOverSeconds = angleOfCircle / secondsPerMinute;
const defaultTickLength = 5;

const tickLengths = [
    [secondsPerMinute / 4, 15],
    [secondsPerMinute / 12, 10],
];

canvas.width = canvasSize;
canvas.height = canvasSize;

function init() {
    window.requestAnimationFrame(draw);
}
let nSec;
let prev = 0;

function draw() {
    const prevStyle = ctx.strokeStyle;
    const prevWidth = ctx.lineWidth;

    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerPos, centerPos, radius, 0, angleOfCircle);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerPos, centerPos, miniRadius, 0, angleOfCircle);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    for (let i = 0; i < secondsPerMinute; i++) {
        const newAngle = twoPIOverSeconds * i;
        const ratioToX = Math.cos(newAngle);
        const ratioToY = Math.sin(newAngle);
        let tickLength = defaultTickLength;

        for (const [tickInterval, newTickLength] of tickLengths) {
            if (i % tickInterval === 0) {
                tickLength = newTickLength;
                break;
            }
        }

        const new2X = centerPos + radius * ratioToX;
        const new2Y = centerPos + radius * ratioToY;
        const newX = centerPos + (radius - tickLength) * ratioToX;
        const newY = centerPos + (radius - tickLength) * ratioToY;

        ctx.beginPath();
        ctx.moveTo(newX, newY);
        ctx.lineTo(new2X, new2Y);
        ctx.stroke();
    }

    ctx.lineWidth = 5;

    const time = new Date();
    const milliseconds = time.getMilliseconds();
    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() + minutes / 60;

    nSec = seconds - prev;
    prev = seconds;

    const endX =
        centerPos +
        radius * 0.9 * Math.cos(-Math.PI / 2 + (angleOfCircle * seconds) / 60);
    const endY =
        centerPos +
        radius * 0.9 * Math.sin(-Math.PI / 2 + (angleOfCircle * seconds) / 60);

    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.moveTo(centerPos, centerPos);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    const endX2 =
        centerPos +
        radius * 0.75 * Math.cos(-Math.PI / 2 + (angleOfCircle * minutes) / 60);
    const endY2 =
        centerPos +
        radius * 0.75 * Math.sin(-Math.PI / 2 + (angleOfCircle * minutes) / 60);

    ctx.strokeStyle = "#00ff00";
    ctx.beginPath();
    ctx.moveTo(centerPos, centerPos);
    ctx.lineTo(endX2, endY2);
    ctx.stroke();

    const endX3 =
        centerPos +
        radius * 0.5 * Math.cos(-Math.PI / 2 + (angleOfCircle * hours) / 12);
    const endY3 =
        centerPos +
        radius * 0.5 * Math.sin(-Math.PI / 2 + (angleOfCircle * hours) / 12);

    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(centerPos, centerPos);
    ctx.lineTo(endX3, endY3);
    ctx.stroke();

    ctx.strokeStyle = prevStyle;
    ctx.lineWidth = prevWidth;

    window.requestAnimationFrame(draw);
}

init();
