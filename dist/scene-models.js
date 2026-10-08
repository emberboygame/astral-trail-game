import * as T from './vendor/three.module.js';
import {WORLD,BUILDINGS,LAKE,TREES,FLOWERS,PATH,CLIFFS,CAMPS,INTERACTS,seeded,heightAt,pathAt,inLake} from './world.js';
const rng=seeded(63251);
const mat=(color,extra={})=>new T.MeshLambertMaterial({color,...extra});
function texture(w,h,paint){let c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.LinearMipmapLinearFilter;return t;}
export function buildModels(scene){
 const trial=WORLD.id==='starfield';const world=new T.Group();scene.add(world);
 const materials={wood:mat('#805331'),trim:mat('#493b28'),wall:mat('#f2dfb0'),stone:mat('#a0a494'),darkStone:mat('#747d77'),gold:mat('#d7b56c'),window:mat('#b9edee',{emissive:'#4c8488',emissiveIntensity:.35})};
 const box=(parent,w,h,d,x,y,z,m,shadow=true)=>{const a=new T.Mesh(new T.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.castShadow=shadow;a.receiveShadow=true;parent.add(a);return a;};
 const groundTex=texture(3100,1100,(c,w,h)=>{
  c.fillStyle=trial?'#527e86':'#75a749';c.fillRect(0,0,w,h);
  for(let i=0;i<65000;i++){let x=rng()*w,y=rng()*h;c.fillStyle=(trial?['#5f8991','#568088','#4e7880','#688d90']:['#80ae4e','#78a84a','#70a046','#85b153'])[i%4];c.fillRect(x,y,1+rng()*3,1+rng()*3);}
  c.save();c.scale(w/WORLD.w,h/WORLD.h);
  let g=c.createLinearGradient(2750,0,6000,0);g.addColorStop(0,'#a6ab4d00');g.addColorStop(.35,'#a8ae4b66');g.addColorStop(1,'#cfb27370');c.fillStyle=g;if(!trial)c.fillRect(2700,0,3500,2200);
  for(const [col,pad] of (trial?[['#426c76',10],['#829f9e',5],['#a8bab1',0]]:[['#4f8138',10],['#bba472',5],['#d9b978',0]])){c.fillStyle=col;for(const p of PATH)c.fillRect(p.x-pad,p.y-pad,p.w+pad*2,p.h+pad*2);}
  for(let i=0;i<10000;i++){let x=rng()*WORLD.w,y=rng()*WORLD.h;if(pathAt(x,y)){c.fillStyle=i%2?'#c5a66b80':'#ebce9740';c.fillRect(x,y,2+rng()*5,2);}}
  c.fillStyle='#d8c18c';c.beginPath();c.ellipse(LAKE.x,LAKE.y,LAKE.rx+18,LAKE.ry+18,0,0,7);c.fill();
  c.fillStyle='#367d88';c.beginPath();c.ellipse(LAKE.x,LAKE.y,LAKE.rx-3,LAKE.ry-3,0,0,7);c.fill();
  for(let i=0;i<(trial?0:95);i++){let a=i*2.399,r=Math.sqrt(i/95)*218;c.fillStyle=i%3?'#8f9990':'#b2b2a1';c.fillRect(5870+Math.cos(a)*r-15,680+Math.sin(a)*r*.7-9,30,18);}
  c.restore();
 });
 const groundGeo=new T.PlaneGeometry(WORLD.w,WORLD.h,124,44);groundGeo.rotateX(-Math.PI/2);groundGeo.translate(WORLD.w/2,0,WORLD.h/2);let pos=groundGeo.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,heightAt(pos.getX(i),pos.getZ(i)));groundGeo.computeVertexNormals();
 const ground=new T.Mesh(groundGeo,mat('#ffffff',{map:groundTex}));ground.receiveShadow=true;world.add(ground);
 // A thick terrain foundation makes the scene a real volume, with layered rock sides.
 box(world,WORLD.w,90,WORLD.h,WORLD.w/2,-47,WORLD.h/2,mat('#766348'));
 for(const cliff of CLIFFS){let base=heightAt(cliff.x,cliff.y);for(let j=0;j<3;j++)box(world,cliff.w-j*8,cliff.h/3,cliff.d-j*8,cliff.x,base+cliff.h/6+j*cliff.h/3,cliff.y,mat(j===2?'#789347':j===1?'#958969':'#7c765d'));for(let i=0;i<12;i++){let x=cliff.x-cliff.w/2+rng()*cliff.w;box(world,15+rng()*25,18,15,x,base+cliff.h+4,cliff.y+cliff.d/2-5,mat('#9caa66'));}}
 const roofTex=texture(128,128,c=>{c.fillStyle='#b2602e';c.fillRect(0,0,128,128);for(let y=0;y<128;y+=16)for(let x=-8;x<128;x+=24){const xx=x+(y/16%2)*12;c.fillStyle=['#c97433','#d4813e','#bc642f'][Math.floor(rng()*3)];c.fillRect(xx+1,y+1,22,13);c.fillStyle='#e59b4d';c.fillRect(xx+2,y+2,20,3);c.fillStyle='#8b4427';c.fillRect(xx,y+14,24,2);}});roofTex.wrapS=roofTex.wrapT=T.RepeatWrapping;roofTex.repeat.set(2,2);
 const roofMat=mat('#ffffff',{map:roofTex});
 for(const b of BUILDINGS){const house=new T.Group();house.position.set(b.x,0,b.y);world.add(house);box(house,b.w+12,16,b.d+12,0,8,0,materials.stone);box(house,b.w,b.h,b.d,0,16+b.h/2,0,materials.wall);
  for(const x of [-b.w/2,b.w/2]){box(house,12,b.h+6,b.d+5,x,18+b.h/2,0,materials.wood);}
  for(const y of [27,b.h-2])box(house,b.w+9,10,b.d+8,0,y,0,materials.wood);
  // Pitched roof is a closed triangular prism; both slopes receive light separately.
  const rw=b.w/2+17,rd=b.d/2+20,base=b.h+17,rise=72;
  const v=[-rw,base,-rd,rw,base,-rd,0,base+rise,-rd,-rw,base,rd,rw,base,rd,0,base+rise,rd];
  const geo=new T.BufferGeometry();const rp=[],ru=[];const tri=(ids,uvs)=>{for(let i=0;i<3;i++){rp.push(...v.slice(ids[i]*3,ids[i]*3+3));ru.push(...uvs[i]);}};tri([0,2,1],[[0,0],[.5,1],[1,0]]);tri([3,4,5],[[0,0],[1,0],[.5,1]]);tri([0,3,5],[[0,0],[0,1],[1,1]]);tri([0,5,2],[[0,0],[1,1],[1,0]]);tri([1,2,5],[[0,0],[1,0],[1,1]]);tri([1,5,4],[[0,0],[1,1],[0,1]]);geo.setAttribute('position',new T.Float32BufferAttribute(rp,3));geo.setAttribute('uv',new T.Float32BufferAttribute(ru,2));geo.computeVertexNormals();const roof=new T.Mesh(geo,roofMat);roof.castShadow=true;roof.receiveShadow=true;house.add(roof);
  box(house,14,13,b.d+50,0,base+rise,0,materials.trim);
  const chimney=box(house,27,78,26,b.w*.27,base+50,-b.d*.22,materials.stone);box(house,34,9,33,chimney.position.x,base+93,chimney.position.z,materials.darkStone);
  const doorX=-b.w*.2,z=b.d/2+2;box(house,42,70,8,doorX,49,z,materials.trim);box(house,31,61,9,doorX,46,z+2,materials.wood);box(house,4,4,3,doorX+8,45,z+8,materials.gold);
  for(const wx of [b.w*.25]){box(house,48,43,9,wx,76,z,materials.trim);box(house,37,32,10,wx,76,z+1,materials.window);box(house,4,34,12,wx,76,z+3,materials.wood);box(house,39,4,12,wx,76,z+3,materials.wood);box(house,58,10,17,wx,52,z+8,materials.wood);}
  box(house,10,44,48,b.w/2+2,76,0,materials.trim);box(house,11,32,35,b.w/2+3,76,0,materials.window);box(house,13,34,4,b.w/2+5,76,0,materials.wood);
  for(let j=0;j<3;j++)box(house,52,5,20,doorX,12-j*4,z+10+j*13,materials.stone);
 }
 // Instanced trunks and three-dimensional clustered foliage keep draw calls bounded.
 const trunkGeo=new T.CylinderGeometry(7,13,63,7);const canopyGeo=new T.IcosahedronGeometry(1,1);const trunk=new T.InstancedMesh(trunkGeo,mat('#795035'),TREES.length);world.add(trunk);trunk.castShadow=true;trunk.receiveShadow=true;
 const leafTex=texture(64,64,c=>{c.fillStyle='#c7dd82';c.fillRect(0,0,64,64);for(let i=0;i<900;i++){c.fillStyle=i%3===0?'#91af58':i%3===1?'#e0eca8':'#b0cb74';c.fillRect(rng()*64,rng()*64,2+rng()*5,2+rng()*4);}});
 const leafMat=mat('#86ac40',{map:leafTex,flatShading:true});const leaves=new T.InstancedMesh(canopyGeo,leafMat,TREES.length*7);world.add(leaves);leaves.castShadow=true;leaves.receiveShadow=true;const dummy=new T.Object3D();const leafData=[];
 TREES.forEach((t,i)=>{const base=heightAt(t.x,t.y);dummy.position.set(t.x,base+31*t.s,t.y);dummy.scale.set(t.s,t.s,t.s);dummy.updateMatrix();trunk.setMatrixAt(i,dummy.matrix);
  for(let j=0;j<7;j++){let a=j*2.4;let x=t.x+(j?Math.cos(a)*33:0)*t.s,z=t.y+(j?Math.sin(a)*27:0)*t.s,y=base+(j?83+j%3*11:123)*t.s;let sx=(j?39:43)*t.s,sy=(j?38:44)*t.s,sz=(j?35:40)*t.s;leafData.push({x,y,z,sx,sy,sz,tree:t});dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(j*.3,a,0);dummy.updateMatrix();leaves.setMatrixAt(i*7+j,dummy.matrix);leaves.setColorAt(i*7+j,new T.Color().setHSL(.22+rng()*.035,.47,.43+rng()*.12));}
 });
 trunk.instanceMatrix.needsUpdate=true;leaves.instanceMatrix.needsUpdate=true;if(leaves.instanceColor)leaves.instanceColor.needsUpdate=true;
 // Lake is a lit transparent surface; highlights and shoreline stones give it depth.
 const waterGeo=new T.CircleGeometry(1,72);waterGeo.rotateX(-Math.PI/2);const water=new T.Mesh(waterGeo,new T.MeshPhongMaterial({color:'#5db9b1',transparent:true,opacity:.75,shininess:95,specular:'#c0ecda'}));water.scale.set(LAKE.rx-7,1,LAKE.ry-7);water.position.set(LAKE.x,2,LAKE.y);world.add(water);const ripples=[];for(let i=0;i<25;i++){let x=LAKE.x+(rng()-.5)*500,z=LAKE.y+(rng()-.5)*290;let a=box(world,12+rng()*17,.2,1.2,x,3,z,new T.MeshBasicMaterial({color:'#e0f6d2',transparent:true,opacity:.4}),false);ripples.push(a);}
 if(!trial)for(let x=680;x<904;x+=13)box(world,11,8,61,x,9,1050,materials.wood);if(!trial)for(const x of [680,892])for(const z of [1021,1079])box(world,9,36,9,x,18,z,materials.trim);
 // Floor details: stones, individual flower tufts and lit lanterns.
 const tuftGeo=new T.ConeGeometry(3,10,4);let usable=FLOWERS.filter(f=>!pathAt(f.x,f.y,7)&&!inLake(f.x,f.y));const grass=new T.InstancedMesh(tuftGeo,mat('#b6ce6a'),usable.length);world.add(grass);usable.forEach((f,i)=>{dummy.position.set(f.x,heightAt(f.x,f.y)+4,f.y);dummy.scale.set(1+f.s,1,1);dummy.rotation.set(0,f.c*6,0);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);grass.setColorAt(i,new T.Color(f.c>.88?'#fff0a4':f.c>.74?'#e9d7ed':'#92b550'));});grass.instanceMatrix.needsUpdate=true;
 for(const [x,z] of (trial?[[320,1510],[320,1880],...CAMPS.map(c=>[c.x+180,c.y-180])]:[[565,470],[940,570],[1270,750],[2140,530],[2800,550],[3290,1100],[4230,1480],[4870,680]])){let base=heightAt(x,z);box(world,8,66,8,x,base+33,z,materials.trim);box(world,20,24,20,x,base+75,z,materials.gold);box(world,13,17,13,x,base+75,z,mat('#ffeaa4',{emissive:'#ffb65f',emissiveIntensity:.65}));box(world,28,5,28,x,base+91,z,materials.trim);}
 const interactModels=new Map();
 for(const n of INTERACTS){const g=new T.Group();g.position.set(n.x,heightAt(n.x,n.y),n.y);world.add(g);interactModels.set(n.id,g);if(n.id.startsWith('chest')){box(g,32,19,23,0,11,0,materials.wood);box(g,34,10,25,0,24,0,materials.gold);box(g,5,10,3,0,20,13,materials.trim);}else if(n.id==='beacon'){const crystal=new T.Mesh(new T.OctahedronGeometry(23,0),new T.MeshPhongMaterial({color:'#bfa3ee',emissive:'#67318b',emissiveIntensity:.4,shininess:80}));crystal.position.y=55;crystal.castShadow=true;g.add(crystal);box(g,58,14,58,0,7,0,materials.stone);}else if(n.id==='slots'){box(g,36,49,27,0,27,0,materials.trim);box(g,31,21,2,0,35,15,materials.window);box(g,38,6,29,0,55,0,materials.gold);}else if(n.id==='return'){const ring=new T.Mesh(new T.TorusGeometry(49,5,8,32),materials.gold);ring.position.y=70;g.add(ring);box(g,125,12,100,0,6,0,materials.stone);}else if(n.id==='endless'){box(g,9,80,10,-28,40,0,materials.trim);box(g,9,80,10,28,40,0,materials.trim);box(g,90,35,8,0,65,0,materials.wood);}
 }
 // Stone arches mark each endless camp; lights telegraph regeneration.
 const campCrystals=new Map();for(const camp of CAMPS.filter(c=>c.endless)){let base=heightAt(camp.x,camp.y);const g=new T.Group();g.position.set(camp.x,base,camp.y-110);world.add(g);for(const x of [-40,40])box(g,23,76,25,x,38,0,materials.stone);box(g,103,19,30,0,83,0,materials.darkStone);const gem=new T.Mesh(new T.OctahedronGeometry(14),new T.MeshPhongMaterial({color:'#93d8db',emissive:'#2b9d9e',emissiveIntensity:.5}));gem.position.y=61;g.add(gem);campCrystals.set(camp.id,gem);}
 if(trial){const pad=new T.Mesh(new T.RingGeometry(160,174,48),new T.MeshBasicMaterial({color:'#bfe2de',side:T.DoubleSide}));pad.rotation.x=-Math.PI/2;pad.position.set(2350,.5,1700);world.add(pad);}
 return {world,ground,water,ripples,leaves,leafData,interactModels,campCrystals};
}
