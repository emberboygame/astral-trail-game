// CPU projection of the same Three.js meshes for browsers without WebGL.
// Geometry, orthographic camera, occlusion and directional lighting remain 3D.
import * as T from './vendor/three.module.js';
import {heightAt} from './world.js';
export class SoftwareRenderer {
 constructor({canvas}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.shadowMap={};this.patterns=new Map();this.pixels=new Map();this.tmp=new T.Matrix4();this.matrix=new T.Matrix4();this.v=new T.Vector3();this.sun=new T.Vector3(-510,780,-420).normalize();this.frame=0;this.last=0;}
 setPixelRatio(){}
 setSize(w,h){this.canvas.width=w;this.canvas.height=h;this.w=w;this.h=h;}
 render(scene,camera){
  scene.updateMatrixWorld();camera.updateMatrixWorld();const c=this.ctx;const focus=new T.Vector3();camera.getWorldDirection(focus);focus.multiplyScalar(1088).add(camera.position);const view=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const faces=[],shadows=[];
  const project=v=>{const p=v.clone().applyMatrix4(view);return [(p.x+1)*this.w/2,(1-p.y)*this.h/2,p.z];};
  const meshFaces=(mesh,matrix)=>{
   const geo=mesh.geometry,attr=geo.attributes.position;if(!attr)return;geo.computeBoundingSphere();let center=geo.boundingSphere.center.clone().applyMatrix4(matrix),radius=geo.boundingSphere.radius*matrix.getMaxScaleOnAxis();if(radius<600&&(Math.abs(center.x-focus.x)>this.w*.7+radius||Math.abs(center.z-focus.z)>this.h*.95+radius))return;
   if(radius>2800&&center.y<0)return;const material=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;if(!material||!material.visible)return;
   const idx=geo.index?.array,uv=geo.attributes.uv;let vertices=Array.from({length:attr.count},(_,i)=>new T.Vector3().fromBufferAttribute(attr,i).applyMatrix4(matrix));let projected=vertices.map(project);const normal=new T.Vector3(),ab=new T.Vector3(),ac=new T.Vector3();
   for(let j=0;j<(idx?idx.length:attr.count);j+=3){const a=idx?idx[j]:j,b=idx?idx[j+1]:j+1,d=idx?idx[j+2]:j+2;const pa=projected[a],pb=projected[b],pc=projected[d];if(Math.max(pa[0],pb[0],pc[0])<0||Math.min(pa[0],pb[0],pc[0])>this.w||Math.max(pa[1],pb[1],pc[1])<0||Math.min(pa[1],pb[1],pc[1])>this.h)continue;
    ab.subVectors(vertices[b],vertices[a]);ac.subVectors(vertices[d],vertices[a]);normal.crossVectors(ab,ac).normalize();let toCam=new T.Vector3().subVectors(camera.position,vertices[a]);if(normal.dot(toCam)<0&&material.side!==T.DoubleSide)continue;
    const light=material.isMeshBasicMaterial?1:Math.min(1.25,.48+Math.max(0,normal.dot(this.sun))*.72+(material.emissiveIntensity||0)*.3);
    faces.push({p:[pa,pb,pc],z:(pa[2]+pb[2]+pc[2])/3,color:material.color,light,opacity:material.opacity,map:material.map,uv:uv?[a,b,d].map(k=>[uv.getX(k),uv.getY(k)]):null});
    if(mesh.castShadow&&center.y>20&&radius<220&&normal.y>.1&&material.alphaTest===0){let pp=[vertices[a],vertices[b],vertices[d]].map(v=>{let ground=heightAt(v.x,v.z),t=(v.y-ground)/this.sun.y;return project(new T.Vector3(v.x-this.sun.x*t,ground+.3,v.z-this.sun.z*t));});shadows.push(pp);}
   }
  };
  scene.traverse(mesh=>{if(!mesh.isMesh||!mesh.visible)return;let parent=mesh.parent;while(parent){if(!parent.visible)return;parent=parent.parent;}if(mesh.isInstancedMesh){for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,this.tmp);this.matrix.multiplyMatrices(mesh.matrixWorld,this.tmp);meshFaces(mesh,this.matrix);}}else meshFaces(mesh,mesh.matrixWorld);});
  // Depth-buffered orthographic rasterization, not painter sorting: buildings,
  // transparent sprite silhouettes and roofs correctly occlude one another.
  const ratio=.65,w=Math.ceil(this.w*ratio),h=Math.ceil(this.h*ratio);
  if(!this.buffer||this.buffer.width!==w||this.buffer.height!==h){this.buffer=document.createElement('canvas');this.buffer.width=w;this.buffer.height=h;this.bc=this.buffer.getContext('2d');this.img=this.bc.createImageData(w,h);this.depth=new Float32Array(w*h);}
  const data=this.img.data,depth=this.depth;depth.fill(Infinity);for(let k=0;k<w*h;k++){data[k*4]=151;data[k*4+1]=178;data[k*4+2]=130;data[k*4+3]=255;}
  for(const p of shadows)faces.push({p,z:(p[0][2]+p[1][2]+p[2][2])/3,color:new T.Color('#163820'),light:1,opacity:.07});
  faces.sort((a,b)=>((a.opacity??1)<1)-((b.opacity??1)<1)||b.z-a.z);
  for(const f of faces){let p=f.p.map(v=>[v[0]*ratio,v[1]*ratio,v[2]]),a=p[0],b=p[1],d=p[2];let den=(b[1]-d[1])*(a[0]-d[0])+(d[0]-b[0])*(a[1]-d[1]);if(Math.abs(den)<.0001)continue;
   let minX=Math.max(0,Math.floor(Math.min(a[0],b[0],d[0]))),maxX=Math.min(w-1,Math.ceil(Math.max(a[0],b[0],d[0]))),minY=Math.max(0,Math.floor(Math.min(a[1],b[1],d[1]))),maxY=Math.min(h-1,Math.ceil(Math.max(a[1],b[1],d[1])));
   let tex=null,img=f.map?.image;if(img&&f.uv){tex=this.pixels.get(img);if(!tex){let cn=document.createElement('canvas');cn.width=img.width;cn.height=img.height;let cc=cn.getContext('2d',{willReadFrequently:true});cc.drawImage(img,0,0);tex={data:cc.getImageData(0,0,img.width,img.height).data,w:img.width,h:img.height};this.pixels.set(img,tex);}}
   const hex=f.color?.getHex()??0xffffff,cr=(hex>>16&255)/255,cg=(hex>>8&255)/255,cb=(hex&255)/255,light=f.light??1;
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){let px=x+.5,py=y+.5,wa=((b[1]-d[1])*(px-d[0])+(d[0]-b[0])*(py-d[1]))/den,wb=((d[1]-a[1])*(px-d[0])+(a[0]-d[0])*(py-d[1]))/den,wc=1-wa-wb;if(wa<-.00001||wb<-.00001||wc<-.00001)continue;
    const z=wa*a[2]+wb*b[2]+wc*d[2],k=y*w+x;if(z>depth[k]+.0000001)continue;
    let red=255,green=255,blue=255,alpha=f.opacity??1;if(tex){let u=(wa*f.uv[0][0]+wb*f.uv[1][0]+wc*f.uv[2][0])*f.map.repeat.x+f.map.offset.x,v=1-((wa*f.uv[0][1]+wb*f.uv[1][1]+wc*f.uv[2][1])*f.map.repeat.y+f.map.offset.y);if(f.map.wrapS===T.RepeatWrapping)u=((u%1)+1)%1;if(f.map.wrapT===T.RepeatWrapping)v=((v%1)+1)%1;let tx=Math.min(tex.w-1,Math.max(0,Math.floor(u*tex.w))),ty=Math.min(tex.h-1,Math.max(0,Math.floor(v*tex.h))),tk=(ty*tex.w+tx)*4;let ta=tex.data[tk+3]/255;if(ta<.35)continue;red=tex.data[tk];green=tex.data[tk+1];blue=tex.data[tk+2];if((f.opacity??1)<1)alpha*=ta;}
    const dest=k*4;red=Math.min(255,red*cr*light);green=Math.min(255,green*cg*light);blue=Math.min(255,blue*cb*light);data[dest]=red*alpha+data[dest]*(1-alpha);data[dest+1]=green*alpha+data[dest+1]*(1-alpha);data[dest+2]=blue*alpha+data[dest+2]*(1-alpha);if(alpha>.98)depth[k]=z;
   }
  }
  this.bc.putImageData(this.img,0,0);c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=false;c.drawImage(this.buffer,0,0,this.w,this.h);
  this.canvas.dataset.renderer='software-3d';
 }
}
