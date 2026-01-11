const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const COLS = 10;
const ROWS = 20;
const BLOCK = 24;
const COLORS = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // I
    '#0DFF72', // S
    '#F538FF', // Z
    '#FF8E0D', // L
    '#FFE138', // O
    '#3877FF'  // J
];

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect((x + offset.x) * BLOCK, (y + offset.y) * BLOCK, BLOCK, BLOCK);
                ctx.strokeStyle = '#232347';
                ctx.strokeRect((x + offset.x) * BLOCK, (y + offset.y) * BLOCK, BLOCK, BLOCK);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (
                value &&
                (y + player.pos.y) >= 0 &&
                (y + player.pos.y) < arena.length &&
                (x + player.pos.x) >= 0 &&
                (x + player.pos.x) < arena[0].length
            ) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y=0; y<m.length; ++y) {
        for (let x=0; x<m[y].length; ++x) {
            if (m[y][x] &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, true);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, reverse) {
    for (let y=0; y<matrix.length; ++y) {
        for (let x=0; x<y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (reverse) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function createPiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        case 'O':
            return [
                [6, 6],
                [6, 6],
            ];
        case 'L':
            return [
                [0, 0, 5],
                [5, 5, 5],
                [0, 0, 0],
            ];
        case 'J':
            return [
                [7, 0, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
        case 'I':
            return [
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
                [0, 2, 0, 0],
            ];
        case 'S':
            return [
                [0, 3, 3],
                [3, 3, 0],
                [0, 0, 0],
            ];
        case 'Z':
            return [
                [4, 4, 0],
                [0, 4, 4],
                [0, 0, 0],
            ];
    }
}

function randomPiece() {
    const pieces = 'TJLOSZI';
    return createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
}

function playerReset() {
    player.matrix = randomPiece();
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (!arena[y][x]) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        y++;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + player.score;
}

function draw() {
    ctx.fillStyle = '#232347';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.matrix, player.pos);
}

let dropCounter = 0;
let dropInterval = 700;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate();
    }
});

const arena = createMatrix(COLS, ROWS);
const player = {
    pos: {x:0, y:0},
    matrix: null,
    score: 0
};

playerReset();
updateScore();
update();