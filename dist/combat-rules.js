// Distances are world units; follow distance is independent of attack range.
export const RANGED_FOLLOW_START=250;
export const RANGED_FOLLOW_STOP=150;
export const RANGED_ATTACK_RANGE=1200;
export const isRanged=c=>!['melee','scythe','spin','shield','lord'].includes(c.kind);
export const attackRange=c=>isRanged(c)&&c.kind!=='heal'?(c.expansion?c.range:((c.owner??c.id)===1?360:(c.owner??c.id)===7?420:Math.max(c.range,RANGED_ATTACK_RANGE*(1+.2*(c.growth?.range||0))))):c.range;
// Skill poses and their captured direction always take precedence over walking.
export function actorFrame(a,stride){
 if(a.frozen>0&&!a.boss)return {row:0,col:a.direction||0};
 if(a.cast>0)return {row:a.cast>(a.boss?.6:.21)?4:5,col:a.attackDir??a.direction??0};
 return {row:a.moving?[1,2,3,2][Math.floor(stride/17)%4]:0,col:a.direction??0};
}
