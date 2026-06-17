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

let currentTile = 0;
let currentTool = "tile";

let mouseDown = false;

let undoStack = [];
let redoStack = [];

function createMap(w, h) {

    map.width = w;
    map.height = h;

    map.spawn = { x: 0, y: 0 };
    map.objects = [];
    map.tiles = [];

    for (let y = 0; y < h; y++) {

        const row = [];

        for (let x = 0; x < w; x++) {

            row.push(0);

        }

        map.tiles.push(row);

    }

}

function saveState() {

    undoStack.push(JSON.stringify(map));

    if (undoStack.length > 50)
        undoStack.shift();

    redoStack = [];

}

function draw() {

    canvas.width = map.width * TILE;
    canvas.height = map.height * TILE;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const colors=[
        "#000",
        "#777",
        "#00aa00",
        "#0099ff"
    ];

    for(let y=0;y<map.height;y++){

        for(let x=0;x<map.width;x++){

            ctx.fillStyle=colors[map.tiles[y][x]];

            ctx.fillRect(
                x*TILE,
                y*TILE,
                TILE,
                TILE
            );

            ctx.strokeStyle="#444";

            ctx.strokeRect(
                x*TILE,
                y*TILE,
                TILE,
                TILE
            );

        }

    }

    ctx.fillStyle="yellow";

    for(const obj of map.objects){

        ctx.fillRect(
            obj.x*TILE+8,
            obj.y*TILE+8,
            16,
            16
        );

    }

    ctx.beginPath();

    ctx.fillStyle="white";

    ctx.arc(
        map.spawn.x*TILE+16,
        map.spawn.y*TILE+16,
        8,
        0,
        Math.PI*2
    );

    ctx.fill();

}

createMap(20,20);
draw();
function getMouseTile(e){

    const rect = canvas.getBoundingClientRect();

    return {

        x: Math.floor((e.clientX - rect.left) / TILE),
        y: Math.floor((e.clientY - rect.top) / TILE)

    };

}

function paintTile(x,y,rightClick=false){

    if(x<0 || y<0 || x>=map.width || y>=map.height) return;

    if(currentTool==="spawn"){

        map.spawn={x,y};

        draw();

        return;

    }

    if(currentTool==="chest"){

        const i=map.objects.findIndex(o=>o.x===x&&o.y===y);

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

    map.tiles[y][x]=rightClick ? 0 : currentTile;

    draw();

}

canvas.oncontextmenu=e=>e.preventDefault();

canvas.onmousedown=e=>{

    saveState();

    mouseDown=true;

    const p=getMouseTile(e);

    paintTile(p.x,p.y,e.button===2);

};

canvas.onmousemove=e=>{

    const p=getMouseTile(e);

    document.getElementById("coords").textContent=`X:${p.x} Y:${p.y}`;

    if(!mouseDown) return;

    paintTile(p.x,p.y,(e.buttons&2)!==0);

};

window.onmouseup=()=>{

    mouseDown=false;

};

document.querySelectorAll(".tileBtn").forEach(btn=>{

    btn.onclick=()=>{

        currentTile=Number(btn.dataset.tile);

        currentTool="tile";

    };

});

document.getElementById("spawnBtn").onclick=()=>{

    currentTool="spawn";

};

document.getElementById("chestBtn").onclick=()=>{

    currentTool="chest";

};

document.getElementById("newMapBtn").onclick=()=>{

    saveState();

    createMap(
        Number(document.getElementById("w").value),
        Number(document.getElementById("h").value)
    );

    draw();

};
