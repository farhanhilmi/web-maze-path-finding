const START = '-';
const PATH = '*';
const WALL = '#';
const EXIT = '+';
const STARTCOLOR = '#00F';
const EXITCOLOR = '#F00';

const mazeData = [
    [PATH, PATH, WALL, PATH, WALL, WALL, PATH, WALL, PATH, PATH],
    [WALL, PATH, WALL, PATH, PATH, PATH, PATH, PATH, WALL, PATH],
    [PATH, PATH, PATH, WALL, PATH, WALL, PATH, WALL, PATH, PATH],
    [PATH, WALL, PATH, WALL, PATH, WALL, PATH, WALL, PATH, WALL],
    [PATH, WALL, PATH, WALL, PATH, WALL, PATH, WALL, PATH, WALL],
    [WALL, PATH, PATH, PATH, PATH, WALL, PATH, PATH, PATH, PATH],
    [WALL, PATH, WALL, PATH, WALL, WALL, PATH, WALL, PATH, WALL],
    [PATH, PATH, WALL, PATH, WALL, WALL, WALL, WALL, PATH, WALL],
    [PATH, WALL, WALL, PATH, PATH, PATH, PATH, WALL, PATH, WALL],
];

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 30;
const mazeWidth = mazeData[0].length;
const mazeHeight = mazeData.length;

function drawMaze() {
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            const cell = mazeData[y][x];
            const color =
                cell === WALL
                    ? '#000'
                    : cell === PATH
                    ? 'green'
                    : cell === START
                    ? '#00F'
                    : cell === EXIT
                    ? '#F00'
                    : '#CCC';
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawPath(path) {
    ctx.beginPath();
    ctx.strokeStyle = '#0F0';
    ctx.lineWidth = 2;
    for (const point of path) {
        const x = point.X * cellSize + cellSize / 2;
        const y = point.Y * cellSize + cellSize / 2;
        if (point === path[0]) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.closePath();
}

function visualizeMaze(path) {
    drawMaze();
}

canvas.addEventListener('mousemove', handleHover);

let hoveredCell = null;
counterClick = 0;

function handleHover(event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
    if (x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight) {
        const cell = mazeData[y][x];
        if (hoveredCell != null) {
            drawMaze();
            hoveredCell = null;
        }
        if (cell === PATH) {
            if (counterClick > 1) {
                return;
            }
            if (counterClick == 0) {
                ctx.fillStyle = STARTCOLOR;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = EXITCOLOR;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            hoveredCell = { x, y };
        }
    }
}

canvas.addEventListener('click', handleClick);

function handleClick(event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
    if (x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight) {
        const cell = mazeData[y][x];
        if (cell === PATH) {
            console.log(`Clicked on green cell at X: ${x}, Y: ${y}`);
            if (counterClick > 1) {
                alert('Start point already determined');
                return;
            }
            if (counterClick == 0) {
                mazeData[y][x] = START;
            } else {
                mazeData[y][x] = EXIT;
            }
            counterClick++;
        }
    }
}

function clearPath() {
    mazeData.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === START || cell === EXIT) {
                mazeData[y][x] = PATH;
            }
        });
    });
    counterClick = 0;
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    // drawMaze();
}

const pathData = {
    path: [
        { X: 0, Y: 0 },
        { X: 1, Y: 0 },
        { X: 1, Y: 1 },
        { X: 1, Y: 2 },
        { X: 2, Y: 2 },
        { X: 2, Y: 3 },
        { X: 2, Y: 4 },
        { X: 2, Y: 5 },
        { X: 3, Y: 5 },
        { X: 4, Y: 5 },
        { X: 4, Y: 4 },
        { X: 4, Y: 3 },
        { X: 4, Y: 2 },
        { X: 4, Y: 1 },
        { X: 5, Y: 1 },
        { X: 6, Y: 1 },
        { X: 6, Y: 2 },
        { X: 6, Y: 3 },
        { X: 6, Y: 4 },
        { X: 6, Y: 5 },
        { X: 7, Y: 5 },
        { X: 8, Y: 5 },
        { X: 9, Y: 5 },
        { X: 9, Y: 4 },
        { X: 8, Y: 4 },
        { X: 8, Y: 3 },
        { X: 9, Y: 3 },
        { X: 9, Y: 2 },
        { X: 9, Y: 1 },
        { X: 9, Y: 0 },
    ],
};

visualizeMaze([]);
function findPath() {
    console.log('MASUK');
    fetch('http://localhost:8080/findPath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maze: mazeData }),
    })
        .then((response) => response.json())
        .then((data) => {
            const path = data.path;
            console.log('path', path);
            drawPath(path);
        })
        .catch((error) => console.error('Error:', error));
}
