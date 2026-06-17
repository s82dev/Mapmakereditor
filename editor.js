
const BASE_TILE=32;
let zoom=1;
let map={width:20,height:20,spawn:{x:0,y:0},tiles:[],objects:[]};
let selectedTile=2,objectMode=false,spawnMode=false,fillMode=false,rectMode=false;
let undo=[],redo=[];
let drawing=false,startRect=null;

function saveState(){undo.push(JSON.stringify(map));if(undo.length>50)undo.shift();redo=[];}
function doUndo(){if(!undo.length)return;redo.push(JSON.stringify(map));map=JSON.parse(undo.pop());drawMap();}
function doRedo(){if(!redo.length)return;undo.push(JSON.stringify(map));map=JSON.parse(redo.pop());drawMap();}
function createMap(w,h){map={width:w,height:h,spawn:{x:0,y:0},tiles:Array.from({length:h},()=>Array(w).fill(0)),objects:[]};drawMap();}
function newMap(){saveState();createMap(parseInt(w.value),parseInt(h.value));}
function tileSize(){return BASE_TILE*zoom;}
function drawMap(){
 const c=document.getElementById('map'),ctx=c.getContext('2d'),ts=tileSize();
 c.width=map.width*ts;c.height=map.height*ts;
 ctx.clearRect(0,0,c.width,c.height);
 const col=['#000','#777','#0c0','#09f'];
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
  ctx.fillStyle=col[map.tiles[y][x]];
  ctx.fillRect(x*ts,y*ts,ts,ts);
  ctx.strokeStyle='#333';ctx.strokeRect(x*ts,y*ts,ts,ts);
 }
 ctx.fillStyle='yellow';
 for(const o of map.objects)ctx.fillRect(o.x*ts+ts*.25,o.y*ts+ts*.25,ts*.5,ts*.5);
 ctx.beginPath();ctx.fillStyle='white';ctx.arc((map.spawn.x+.5)*ts,(map.spawn.y+.5)*ts,ts*.25,0,Math.PI*2);ctx.fill();
}
function getPos(e){let r=map.getBoundingClientRect?document.getElementById('map').getBoundingClientRect():e.target.getBoundingClientRect();const ts=tileSize();return{x:Math.floor((e.clientX-r.left)/ts),y:Math.floor((e.clientY-r.top)/ts)}}
function flood(x,y,oldv,newv){if(oldv===newv)return;let q=[[x,y]];while(q.length){let [cx,cy]=q.pop();if(cx<0||cy<0||cx>=map.width||cy>=map.height)continue;if(map.tiles[cy][cx]!==oldv)continue;map.tiles[cy][cx]=newv;q.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);}}
function paint(x,y,right){
 if(x<0||y<0||x>=map.width||y>=map.height)return;
 if(spawnMode){map.spawn={x,y};spawnMode=false;drawMap();return;}
 if(objectMode){let i=map.objects.findIndex(o=>o.type==='chest'&&o.x===x&&o.y===y);if(i>=0)map.objects.splice(i,1);else map.objects.push({type:'chest',x,y});drawMap();return;}
 if(fillMode){flood(x,y,map.tiles[y][x],right?0:selectedTile);drawMap();return;}
 map.tiles[y][x]=right?0:selectedTile;drawMap();
}
const canvas=document.getElementById('map');
canvas.oncontextmenu=e=>e.preventDefault();
canvas.onmousedown=e=>{const p=getPos(e);saveState();drawing=true;if(rectMode){startRect=p;return;}paint(p.x,p.y,e.button===2);}
canvas.onmousemove=e=>{const p=getPos(e);coords.textContent=`X:${p.x} Y:${p.y}`;if(drawing&&!rectMode)paint(p.x,p.y,e.buttons===2);}
window.onmouseup=e=>{if(!drawing)return;drawing=false;if(rectMode&&startRect){const p=getPos(e);for(let y=Math.min(startRect.y,p.y);y<=Math.max(startRect.y,p.y);y++)for(let x=Math.min(startRect.x,p.x);x<=Math.max(startRect.x,p.x);x++)map.tiles[y][x]=selectedTile;startRect=null;drawMap();}}
function selectTile(t){selectedTile=t;objectMode=spawnMode=fillMode=rectMode=false;}
function selectChest(){objectMode=true;spawnMode=fillMode=rectMode=false;}
function selectSpawn(){spawnMode=true;objectMode=fillMode=rectMode=false;}
function selectFill(){fillMode=true;objectMode=spawnMode=rectMode=false;}
function selectRect(){rectMode=true;objectMode=spawnMode=fillMode=false;}
function setZoom(v){zoom=parseFloat(v);drawMap();}
function exportMap(){let b=new Blob([JSON.stringify(map,null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='map.json';a.click();}
function importMap(f){let r=new FileReader();r.onload=()=>{saveState();map=JSON.parse(r.result);if(!map.spawn)map.spawn={x:0,y:0};w.value=map.width;h.value=map.height;drawMap();};r.readAsText(f);}
createMap(20,20);
