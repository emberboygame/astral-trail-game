// Documentation only: imports final runtime definitions, never modifies game files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {CHARS} from '../dist/data.js';
import {GROWTH_CARDS,cardsFor} from '../dist/growth.js';
import * as balance from '../dist/balance.js';
import {floorGoal,floorHealth,floorSpawnInterval} from '../dist/trial.js';
const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const check=process.argv.includes('--check');
const version=JSON.parse(fs.readFileSync('package.json')).version;
const escape=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(p,x.name)):[path.join(p,x.name)]).sort();
const write=(p,s)=>{if(check){if(!fs.existsSync(p)||fs.readFileSync(p,'utf8')!==s)throw Error('Documentation stale: '+p);}else fs.writeFileSync(p,s);};
const pre=title=>`# ${title}\n\n由 scripts/generate-docs.mjs 从 v${version} 的最终运行时定义生成；不要直接编辑本文件。运行 \`node scripts/generate-docs.mjs\` 更新，\`--check\` 校验。\n\n`;
if(process.argv.includes('--capture-history')){
 if(check)throw Error('Do not capture history in check mode');
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 const commits=git('rev-list','--reverse','d54782f').split('\n').map(sha=>{
  let version=null;try{version=JSON.parse(git('show',sha+':package.json')).version;}catch{}
  return {sha,date:git('show','-s','--format=%aI',sha),version,subject:git('show','-s','--format=%s',sha),files:git('diff-tree','--root','--no-commit-id','--name-only','-r',sha).split('\n').filter(Boolean)};
 });
 fs.writeFileSync('docs/history.json',JSON.stringify({origin:'Original local Sites repository, through d54782f; not imported as GitHub commit ancestry',commits},null,2)+'\n');
}
const history=JSON.parse(fs.readFileSync('docs/history.json'));
write('docs/HISTORY.md',pre('原始开发提交档案')+'这是原始本地仓库的提交元数据归档。GitHub 以源码快照导入，以下旧 SHA 不保证能在 GitHub 打开。版本取自每个提交的 package.json，日期为提交作者时间；标题记录当时的修改意图，不代表今天仍沿用该机制。当前规则见 [RULES.md](RULES.md)。\n\n'+history.commits.map(c=>`## ${c.version??'未标版本'} · ${c.subject}\n\n- SHA：\`${c.sha}\`\n- 作者时间：${c.date}\n- 变动文件：${c.files.map(p=>'`'+p+'`').join('、')}\n`).join('\n'));
const modules=id=>id===0?'growth-combat.js / gold-combat.js':id<15?'growth-combat.js / combo.js / gold-combat.js':id===21?'ascension-combat.js / firefly-combat.js':[18,19].includes(id)?'expansion-combat.js':'ascension-combat.js / expansion-combat.js';
write('docs/CHARACTERS.md',pre('角色定义索引')+'这些是数据层的基础值，实际射程、冷却、伤害受战斗规则和成长覆盖，不能把 range 列直接当最终攻击距离。0 为主角；1–11 为初始伙伴；15–24 为新增伙伴。12–14 等动画 ID 不是可招募伙伴，不要重排现有 ID。\n\n| ID | 角色 | 星级 | 元素 | 类型 | 基础伤害 | 基础冷却秒 | 数据 range | 普通/黄金牌 |\n|---|---|---|---|---|---|---|---|---|\n'+CHARS.map(c=>`| ${c.id} | ${escape(c.name)} | ${c.star} | ${c.element} | ${c.kind} | ${c.damage} | ${c.cd} | ${c.range} | ${cardsFor(c.id).filter(x=>!x.gold).length}/${cardsFor(c.id).filter(x=>x.gold).length} |`).join('\n')+'\n\n'+CHARS.map(c=>`## ${c.id} · ${c.name}\n\n- 技能：${c.skill}。数据描述：${c.desc}\n- 实现入口：${modules(c.id).split(' / ').map(p=>`[${p}](../dist/${p})`).join('、')}\n${c.guide?'- 数据中的搭配提示：'+c.guide+'\n':''}- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。\n`).join('\n'));
write('docs/CARDS.md',pre('成长牌完整目录')+`共 ${GROWTH_CARDS.length} 张：普通 ${GROWTH_CARDS.filter(c=>!c.gold).length}、黄金 ${GROWTH_CARDS.filter(c=>c.gold).length}。主角 ${cardsFor(0).length} 张，伙伴 ${CHARS.length} × 8 张。\n\n卡牌定义加载顺序：growth.js 基础池 → installComboCards → installGoldEvolutions → installCardCopy → NEW_POOLS → tagsFor。下文是**最终界面文案**，不是从战斗公式反推的效果证明；“效果增强”等笼统描述的精确系数应查实现入口。稳定标识是 owner:key，显示名称允许改变。每张最多 III 级。\n\n`+[0,...CHARS.map(c=>c.id)].map(id=>`<a id="角色-${id}"></a>\n\n## ${id} · ${id?CHARS.find(c=>c.id===id).name:'穹'}\n\n实现：${modules(id).split(' / ').map(p=>`[${p}](../dist/${p})`).join('、')}\n\n| ID / 名称 | 品质 / 标签 | I 级文案 | II 级文案 | III 级文案 |\n|---|---|---|---|---|\n`+cardsFor(id).map(c=>`| ${c.id} · ${escape(c.name)} | ${c.gold?'黄金':'普通'}${c.tags.length?' · '+c.tags.join('、'):''} | ${[1,2,3].map(r=>escape(c.describe(r))).join(' | ')} |`).join('\n')).join('\n\n')+'\n');
write('docs/BALANCE.md',pre('数值与成长曲线')+'来源：[balance.js](../dist/balance.js)、[trial.js](../dist/trial.js)。经验列表示从当前等级升到下一级，普通敌人按 10 XP 折算，精英/首领不同。\n\n| 当前等级 | 下级所需 XP | 等价普通敌人 |\n|---|---|---|\n'+Array.from({length:30},(_,i)=>i+1).map(n=>`| ${n} | ${balance.xpForLevel(n)} | ${balance.xpForLevel(n)/balance.NORMAL_XP} |`).join('\n')+'\n\n| 伙伴当前等级 | 下级 XP |\n|---|---|\n'+Array.from({length:7},(_,i)=>i+1).map(n=>`| ${n} | ${balance.companionXP(n)} |`).join('\n')+'\n\n伙伴 8 级封顶，升级不发成长牌。\n\n| 层数 | 怪物预算（不含首领） | HP 倍率 | 理论批次间隔秒 | 首领 HP | 随机票上限 |\n|---|---|---|---|---|---|\n'+Array.from({length:6},(_,i)=>i+1).map(n=>`| ${n} | ${floorGoal(n)} | ${floorHealth(n)} | ${floorSpawnInterval(n)} | ${balance.trialBossHP(n)} | ${balance.TRIAL_TICKET_CAP} |`).join('\n')+'\n\n刷怪每批最多 10 只，补偿错过的批次，但场上存活上限 90，因此实际出现速率受上限、帧步长和击杀速度约束。初始地图营地的 MAX_LIVING_ENEMIES=110 是另一套限制。\n\n| 常量 | 当前值 |\n|---|---|\n'+Object.entries(balance).filter(([,v])=>typeof v!=='function').map(([k,v])=>`| ${k} | ${v} |`).join('\n')+'\n');
const files=[...walk('dist'),...walk('tests'),'package.json','package-lock.json','vite.config.js','vite.local.config.js','scripts/package-local.mjs','.github/workflows/pages.yml'];
write('docs/source-manifest.json',JSON.stringify({version,algorithm:'sha256',scope:'Game source, assets, tests and build/deploy inputs; excludes docs and this generator',files:Object.fromEntries(files.map(p=>[p,hash(fs.readFileSync(p))]))},null,2)+'\n');
if(CHARS.length!==21||GROWTH_CARDS.length!==186||new Set(GROWTH_CARDS.map(c=>c.id)).size!==186)throw Error('Roster changed: review documentation counts');
for(const c of CHARS)if(cardsFor(c.id).filter(x=>x.gold).length!==3||cardsFor(c.id).filter(x=>!x.gold).length!==5)throw Error('Pool shape '+c.id);
console.log(check?'Generated documentation matches current source.':'Generated characters, cards, balance, history and source manifest.');
