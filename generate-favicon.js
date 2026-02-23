const { createCanvas } = require("canvas");
const fs = require("fs");

const canvas = createCanvas(64, 64);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#16a34a";
ctx.beginPath();
ctx.roundRect(0, 0, 64, 64, 12);
ctx.fill();

ctx.fillStyle = "#ffffff";
ctx.font = "bold 11px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("राशन", 32, 28);
ctx.fillText("दुकान", 32, 44);

fs.writeFileSync("app/favicon.ico", canvas.toBuffer("image/png"));
console.log("favicon बन गया!");