const TILE_SIZE=32;
let map={width:20,height:20,tiles:[],objects:[]};
let selectedTile=2,objectMode=false;
function createMap(w,h){map.width=w;map.height=h;map.tiles=[];for(let y=0;y<h;y++){let r=[];for(let x=0;x<w;x++)r.push(0);map.tiles.push(r);}map.objects=[];drawMap();}
function drawMap(){const c=document.getElementById("map"),ctx=c.getContext("2d");c.width=map.width*TILE_SIZE;c.height=map.height*TILE_SIZE;ctx.clearRect(0,0,c.width,c.height);
for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){ctx.fillStyle=["#000","#777","#00cc00","#0099ff"][map.tiles[y][x]];ctx.fillRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);ctx.strokeStyle="#333";ctx.strokeRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);}
ctx.fillStyle="yellow";for(const o of map.objects){if(o.type==="chest")ctx.fillRect(o.x*TILE_SIZE+8,o.y*TILE_SIZE+8,16,16);}}
document.getElementById("map").onclick=e=>{const r=e.target.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/TILE_SIZE),y=Math.floor((e.clientY-r.top)/TILE_SIZE);
if(objectMode){const i=map.objects.findIndex(o=>o.type==="chest"&&o.x===x&&o.y===y);if(i>=0)map.objects.splice(i,1);else map.objects.push({type:"chest",x,y});}
else map.tiles[y][x]=selectedTile;drawMap();}
function selectTile(t){objectMode=false;selectedTile=t;}
function selectChest(){objectMode=true;}
function exportMap(){const b=new Blob([JSON.stringify(map,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="map.json";a.click();}
function importMap(f){const r=new FileReader();r.onload=()=>{map=JSON.parse(r.result);drawMap();};r.readAsText(f);}
createMap(20,20);