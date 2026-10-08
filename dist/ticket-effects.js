import * as T from './vendor/three.module.js';
import {heightAt} from './world.js';
export class TicketEffects{
 constructor(scene){this.scene=scene;this.items=new Map();}
 update(e){const live=new Set(e.drops);for(const [d,g]of this.items)if(!live.has(d)){this.scene.remove(g);g.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.items.delete(d);}
 for(const d of e.drops){d.createdAt??=e.time;let g=this.items.get(d);if(!g){g=new T.Group();const ticket=new T.Group();const mat=color=>new T.MeshBasicMaterial({color,toneMapped:false});const body=new T.Mesh(new T.BoxGeometry(36,24,4),mat('#ffe19b'));ticket.add(body);for(const side of [-1,1]){const star=new T.Mesh(new T.OctahedronGeometry(6),mat('#9c64df'));star.position.z=side*4;ticket.add(star);const strip=new T.Mesh(new T.BoxGeometry(3,23,1),mat('#bc8132'));strip.position.set(11,0,side*2.5);ticket.add(strip);}g.add(ticket);const beam=new T.Mesh(new T.CylinderGeometry(7,18,75,12,1,true),new T.MeshBasicMaterial({color:'#d3a2ff',transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false,toneMapped:false}));beam.position.y=38;g.add(beam);const halo=new T.Mesh(new T.RingGeometry(20,25,28),new T.MeshBasicMaterial({color:'#ffdf9b',transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false,toneMapped:false}));halo.rotation.x=-Math.PI/2;halo.position.y=2;g.add(halo);this.items.set(d,g);this.scene.add(g);}
 g.position.set(d.x,heightAt(d.x,d.y),d.y);g.children[0].position.y=40+Math.sin(e.time*3+d.x)*7;g.children[0].rotation.set(.25,e.time*2.4+d.x,.18);const age=e.time-d.createdAt;g.children[1].material.color.setHSL((e.time*.35+d.x*.01)%1,.8,.68);g.children[1].material.opacity=age<1.8?.42:.16;g.children[2].scale.setScalar(1+Math.sin(e.time*4)*.12);
 }
 }
}
