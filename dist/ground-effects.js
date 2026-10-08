import * as T from './vendor/three.module.js';
import {heightAt} from './world.js';
// Ground effects use world-space meshes and depth testing in both renderers.
export class GroundEffects{
 constructor(scene){this.scene=scene;this.items=new Map();this.circle=new T.CircleGeometry(1,32);this.ring=new T.RingGeometry(.965,1,32);this.plane=new T.PlaneGeometry(1,1);}
 update(engine){const zones=[...(engine.ascFields||[]).filter(f=>f.style==='vortex'),...engine.zones.filter(z=>!z.invisible&&(z.kind!=='warning'||z.host?.hp>0&&z.life>0&&!z.resolved)),...engine.fx.filter(f=>f.kind==='hazardHit'||f.kind==='lord'&&!(f.delay>0))];const m=engine.members[5];if(engine.team.includes(5)&&m.domain>0){this.domain??={kind:'domain'};Object.assign(this.domain,{x:m.x,y:m.y,r:m.domainRadius,life:m.domain});zones.push(this.domain);}const live=new Set(zones);
 for(const [z,g]of this.items)if(!live.has(z)){this.scene.remove(g);g.traverse(o=>o.material?.dispose());this.items.delete(z);}
 for(const z of zones){if(!Number.isFinite(z.x)||!Number.isFinite(z.y))continue;let g=this.items.get(z);const rect=z.shape==='line',danger=z.kind==='warning'||z.kind==='danger'||z.kind==='hazardHit',color=z.kind==='poison'?'#9746dc':z.kind==='lord'?'#ffe29c':z.kind==='domain'?'#91deff':danger?'#ff523e':z.color||'#b183ff';if(!g){g=new T.Group();const material=opacity=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,depthTest:true,side:T.DoubleSide,toneMapped:false});const fill=new T.Mesh(rect?this.plane:this.circle,material(.26));fill.rotation.x=-Math.PI/2;g.add(fill);if(rect){for(let i=0;i<4;i++){const edge=new T.Mesh(this.plane,material(.85));edge.rotation.x=-Math.PI/2;g.add(edge);}}else{const edge=new T.Mesh(this.ring,material(.85));edge.rotation.x=-Math.PI/2;g.add(edge);}this.items.set(z,g);this.scene.add(g);}
 g.position.set(z.x,heightAt(z.x,z.y)+1.8,z.y);g.rotation.y=rect?-z.angle:0;g.children[0].material.opacity=z.style==='vortex'?.065:z.kind==='lord'?(z.hit?.4:.15):z.kind==='hazardHit'?.7:danger?.24+.18*(1-z.life/(z.max||1.2)):.25;
 if(rect){const l=z.length,w=z.width;g.children[0].scale.set(l,w,1);for(let i=0;i<4;i++){const b=g.children[i+1];b.scale.set(i<2?l:5,i<2?5:w,1);b.position.set(i<2?0:(i===2?-l/2:l/2),.2,i<2?(i===0?-w/2:w/2):0);}}else for(const o of g.children)o.scale.set(z.r||50,z.r||50,1);
 }
 }
}
