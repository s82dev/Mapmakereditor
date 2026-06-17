const TILE_SIZE = 32;

let map = {
    width: 20,
    height: 20,
    spawn: { x: 0, y: 0 },
    tiles: [],
    objects: []
};

let selectedTile = 2;
let objectMode = false;
let spawnMode = false;

// Neu
let drawing = false;
let undoStack = [];
let redoStack = [];

function saveState() {
    undoStack.push(JSON.stringify(map));

    if (undoStack.length > 50)
        undoStack.shift();

    redoStack = [];
}

function undo() {

    if (undoStack.length === 0) return;

    redoStack.push(JSON.stringify(map));

    map = JSON.parse(undoStack.pop());

    drawMap();

}

function redo() {

    if (redoStack.length === 0) return;

    undoStack.push(JSON.stringify(map));

    map = JSON.parse(redoStack.pop());

    drawMap();

}

function createMap(w, h) {

    map = {
        width: w,
        height: h,
        spawn: { x: 0, y: 0 },
        tiles: [],
        objects: []
    };

    for (let y = 0; y < h; y++) {

        let row = [];

        for (let x = 0; x < w; x++)
            row.push(0);

        map.tiles.push(row);

    }

    drawMap();

}

function newMap() {

    saveState();

    createMap(
        parseInt(w.value),
        parseInt(h.value)
    );

}

function drawMap() {

    const canvas = document.getElementById("map");
    const ctx = canvas.getContext("2d");

    canvas.width = map.width * TILE_SIZE;
    canvas.height = map.height * TILE_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = [
        "#000",
        "#777",
        "#0c0",
        "#09f"
    ];

    for (let y = 0; y < map.height; y++) {

        for (let x = 0; x < map.width; x++) {

            ctx.fillStyle = colors[map.tiles[y][x]];

            ctx.fillRect(
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );

            ctx.strokeStyle = "#333";

            ctx.strokeRect(
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );

        }

    }

    ctx.fillStyle = "yellow";

    for (const o of map.objects) {

        ctx.fillRect(
            o.x * TILE_SIZE + 8,
            o.y * TILE_SIZE + 8,
            16,
            16
        );

    }

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(
        map.spawn.x * TILE_SIZE + TILE_SIZE / 2,
        map.spawn.y * TILE_SIZE + TILE_SIZE / 2,
        8,
        0,
        Math.PI * 2
    );
const canvas = document.getElementById("map");

canvas.oncontextmenu = e => e.preventDefault();

function getMousePos(e) {

    const r = canvas.getBoundingClientRect();

    return {

        x: Math.floor((e.clientX - r.left) / TILE_SIZE),
        y: Math.floor((e.clientY - r.top) / TILE_SIZE)

    };

}

function paint(x, y, rightClick = false) {

    if (x < 0 || y < 0 || x >= map.width || y >= map.height)
        return;

    if (spawnMode) {

        map.spawn = { x, y };

        spawnMode = false;

        drawMap();

        return;

    }

    if (objectMode) {

        const i = map.objects.findIndex(o =>
            o.type === "chest" &&
            o.x === x &&
            o.y === y
        );

        if (i >= 0)
            map.objects.splice(i, 1);
        else
            map.objects.push({
                type: "chest",
                x,
                y
            });

        drawMap();

        return;

    }

    map.tiles[y][x] = rightClick ? 0 : selectedTile;

    drawMap();

}

canvas.onmousedown = e => {

    saveState();

    drawing = true;

    const p = getMousePos(e);

    paint(p.x, p.y, e.button === 2);

};

canvas.onmousemove = e => {

    const p = getMousePos(e);

    coords.textContent = `X:${p.x} Y:${p.y}`;

    if (!drawing)
        return;

    paint(p.x, p.y, (e.buttons & 2) !== 0);

};

window.onmouseup = () => {

    drawing = false;

};

function selectTile(t) {

    selectedTile = t;

    objectMode = false;

    spawnMode = false;

}

function selectChest() {

    objectMode = true;

    spawnMode = false;

}

function selectSpawn() {

    objectMode = false;

    spawnMode = true;

}

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key.toLowerCase() === "z") {

        e.preventDefault();

        undo();

    }

    if (e.ctrlKey && e.key.toLowerCase() === "y") {

        e.preventDefault();

        redo();

    }

});

function exportMap() {

    const blob = new Blob(
        [JSON.stringify(map, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "map.json";

    a.click();

}

function importMap(file) {

    const reader = new FileReader();

    reader.onload = () => {

        saveState();

        map = JSON.parse(reader.result);

        if (!map.spawn)
            map.spawn = { x: 0, y: 0 };

        w.value = map.width;

        h.value = map.height;

        drawMap();

    };

    reader.readAsText(file);

}

createMap(20, 20);
    ctx.fill();

}
