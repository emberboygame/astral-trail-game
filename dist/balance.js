export const NORMAL_XP=10;
export const NORMAL_TICKET_CHANCE=.05;
export const BOSS_HP=3600;
export const TRIAL_TICKET_CHANCE=.01;
export const TRIAL_TICKET_CAP=12;
// Requirement to advance FROM this level; ordinary enemies give 10 XP.
export const xpForLevel=level=>level>=25?1500*2**(level-24):level>=15?900:level>=10?500:[100,120,150,180,220,270,330,400,460][Math.max(0,level-1)];
export const trialBossHP=level=>Math.round(15000*Math.pow(5,level-1));
export const bossAttackInterval=(tier=1,enraged=false)=>Math.max(.35,(Math.max(.45,1.6-tier*.15))*(enraged?.8:1));
export const companionXP=level=>120+Math.max(0,level-1)*60;
export const COMPANION_MAX_LEVEL=8;
export const CAMP_RESPAWN_SECONDS=16;
export const MAX_LIVING_ENEMIES=110;
