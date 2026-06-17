const TILE_SIZE=32;
let map={width:20,height:20,spawn:{x:0,y:0},tiles:[],objects:[]};
let selectedTile=2,objectMode=false,spawnMode=false;
function createMap(w,h){map={width:w,height:h,spawn:{x:0,y:0},tiles:[],objects:[]};for(let y=0;y<h;y++){let r=[];for(let x=0;x<w;x++)r.push(0);map.tiles.push(r);}drawMap();}
function newMap(){createMap(parseInt(w.value),parseInt(h.value));}
function drawMap(){const c=mapCanvas=document.getElementById('map'),ctx=c.getContext('2d');c.width=map.width*TILE_SIZE;c.height=map.height*TILE_SIZE;
ctx.clearRect(0,0,c.width,c.height);
const col=['#000','#777','#0c0','#09f'];
for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){ctx.fillStyle=col[map.tiles[y][x]];ctx.fillRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);ctx.strokeStyle='#333';ctx.strokeRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);}
ctx.fillStyle='yellow';for(const o of map.objects)ctx.fillRect(o.x*TILE_SIZE+8,o.y*TILE_SIZE+8,16,16);
ctx.beginPath();ctx.fillStyle='white';ctx.arc(map.spawn.x*TILE_SIZE+TILE_SIZE/2,map.spawn.y*TILE_SIZE+TILE_SIZE/2,8,0,Math.PI*2);ctx.fill();}
document.getElementById('map').onclick=e=>{let r=e.target.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/TILE_SIZE),y=Math.floor((e.clientY-r.top)/TILE_SIZE);if(x<0||y<0||x>=map.width||y>=map.height)return;
if(spawnMode){map.spawn={x,y};spawnMode=false;drawMap();return;}
if(objectMode){let i=map.objects.findIndex(o=>o.type==='chest'&&o.x===x&&o.y===y);if(i>=0)map.objects.splice(i,1);else map.objects.push({type:'chest',x,y});}
else map.tiles[y][x]=selectedTile;drawMap();}
function selectTile(t){objectMode=false;spawnMode=false;selectedTile=t;}
function selectChest(){objectMode=true;spawnMode=false;}
function selectSpawn(){objectMode=false;spawnMode=true;}
function exportMap(){let b=new Blob([JSON.stringify(map,null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='map.json';a.click();}
function importMap(f){let r=new FileReader();r.onload=()=>{map=JSON.parse(r.result);if(!map.spawn)map.spawn={x:0,y:0};w.value=map.width;h.value=map.height;drawMap();};r.readAsText(f);}
createMap(20,20);
