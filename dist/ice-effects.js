import * as T from './vendor/three.module.js';
import {heightAt} from './world.js';
export class IceEffects{
 constructor(scene){this.scene=scene;this.items=new Map();this.geometry=new T.BoxGeometry(1,1,1);}
 update(e){const live=new Set(e.enemies.filter(a=>a.hp>0&&!a.boss&&a.frozen>0&&Math.hypot(a.x-e.hero.x,a.y-e.hero.y)<1400));
 for(const [a,g]of this.items)if(!live.has(a)){this.scene.remove(g);g.traverse(o=>o.material?.dispose());this.items.delete(a);}
 for(const a of live){let g=this.items.get(a);if(!g){g=new T.Group();for(const [color,opacity,scale]of [['#208ee8',.35,1],['#c4f9ff',.38,.92]]){const m=new T.Mesh(this.geometry,new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,toneMapped:false}));m.scale.set(scale,scale,scale);g.add(m);}this.scene.add(g);this.items.set(a,g);}const size=(a.r||17)*2+25,height=a.boss?170:a.elite?90:72;g.position.set(a.x,heightAt(a.x,a.y)+height/2,a.y);g.scale.set(size,height,size*.7);g.rotation.y=.35;}
 }
}
