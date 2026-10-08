export const goldReach=id=>id===0?300:360;
export const wideGold=id=>[3,4,8,11].includes(id);
export function withinGold(e,id,a){if(wideGold(id))return true;const m=id?e.members[id]:e.hero;return !!m&&Math.hypot(a.x-m.x,a.y-m.y)<=goldReach(id)&&(!id||Math.hypot(a.x-e.hero.x,a.y-e.hero.y)<=500);}
export const facingAngle=m=>[Math.PI/2,Math.PI,0,-Math.PI/2][m.cast>0?(m.attackDir??m.direction??0):(m.direction??0)];
