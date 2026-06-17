const TILE = 32;

const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

let map = {
    width: 20,
    height: 20,
    spawn: { x: 0, y: 0 },
    tiles: [],
    objects: []
};

let selectedTile = 0;
let tool = "tile";

let drawing = false;

let undo = [];
let redo = [];

function saveState() {
    undo.push(JSON.stringify(map));

    if (undo.length > 50)
        undo.shift();

    redo = [];
}

function undoMap() {

    if (undo.length === 0) return;

    redo.push(JSON.stringify(map));

    map = JSON.parse(undo.pop());

    draw();

}

function redoMap() {

    if (redo.length === 0) return;

    undo.push(JSON.stringify(map));

    map = JSON.parse(redo.pop());

    draw();

}

function createMap(w, h) {

    map.width = w;
    map.height = h;

    map.tiles = [];

    map.objects = [];

    map.spawn = { x: 0, y: 0 };

    for (let y = 0; y < h; y++) {

        let row = [];

        for (let x = 0; x < w; x++)
            row.push(0);

        map.tiles.push(row);

    }

    draw();

}

function draw() {

    canvas.width = map.width * TILE;
    canvas.height = map.height * TILE;

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
                x * TILE,
                y * TILE,
                TILE,
                TILE
            );

            ctx.strokeStyle = "#333";

            ctx.strokeRect(
                x * TILE,
                y * TILE,
                TILE,
                TILE
            );

        }

    }

    ctx.fillStyle = "yellow";

    for (const o of map.objects) {

        ctx.fillRect(
            o.x * TILE + 8,
            o.y * TILE + 8,
            16,
            16
        );

    }

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(
        map.spawn.x * TILE + TILE / 2,
        map.spawn.y * TILE + TILE / 2,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

}

createMap(20,20);
function getTilePos(e){

    const rect=canvas.getBoundingClientRect();

    return{
        x:Math.floor((e.clientX-rect.left)/TILE),
        y:Math.floor((e.clientY-rect.top)/TILE)
    };

}

function paint(x,y,right=false){

    if(x<0||y<0||x>=map.width||y>=map.height) return;

    if(tool==="spawn"){

        map.spawn={x,y};

        draw();

        return;

    }

    if(tool==="chest"){

        const i=map.objects.findIndex(o=>o.type==="chest"&&o.x===x&&o.y===y);

        if(i>=0){

            map.objects.splice(i,1);

        }else{

            map.objects.push({
                type:"chest",
                x,
                y
            });

        }

        draw();

        return;

    }

    map.tiles[y][x]=right?0:selectedTile;

    draw();

}

canvas.oncontextmenu=e=>e.preventDefault();

canvas.onmousedown=e=>{

    saveState();

    drawing=true;

    const p=getTilePos(e);

    paint(p.x,p.y,e.button===2);

};

canvas.onmousemove=e=>{

    const p=getTilePos(e);

    document.getElementById("coords").textContent=`X:${p.x} Y:${p.y}`;

    if(!drawing) return;

    paint(p.x,p.y,(e.buttons&2)!==0);

};

window.onmouseup=()=>{

    drawing=false;

};

document.querySelectorAll(".tileBtn").forEach(btn=>{

    btn.onclick=()=>{

        selectedTile=parseInt(btn.dataset.tile);

        tool="tile";

    };

});

document.getElementById("spawnBtn").onclick=()=>{

    tool="spawn";

};

document.getElementById("chestBtn").onclick=()=>{

    tool="chest";

};

document.getElementById("newMapBtn").onclick=()=>{

    saveState();

    createMap(

        parseInt(document.getElementById("w").value),

        parseInt(document.getElementById("h").value)

    );

};
