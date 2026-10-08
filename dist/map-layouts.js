// Second region: broad lanes and open battle fields, with scenery confined to the edges.
export function createStarfield(){
 const camps=[];
 const trees=[];for(let i=0;i<52;i++){const x=160+(i%26)*172,y=i<26?150:3220;trees.push({x,y,s:1+(i%3)*.12,phase:i});}
 return {world:{w:4800,h:3400,id:'starfield'},buildings:[],lake:{x:-1500,y:-1500,rx:50,ry:50},interacts:[{id:'return',x:390,y:1700,name:'返回晴岚驿站',icon:'↩',sprite:10}],paths:[{x:220,y:1500,w:4350,h:400},{x:2150,y:320,w:400,h:2780}],camps,cliffs:[{x:2400,y:80,w:4480,d:100,h:100},{x:2400,y:3320,w:4480,d:100,h:100},{x:75,y:1700,w:90,d:2850,h:85},{x:4720,y:1700,w:90,d:2850,h:85}],trees,flowers:Array.from({length:1100},(_,i)=>({x:180+(i*271)%4440,y:240+(i*397)%2880,c:(i%10)/10,s:(i%5)/5}))};
}
