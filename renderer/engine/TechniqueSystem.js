import { State } from './State.js';

// ==================== 功法模板数据（v2.4.1） ====================
// type: cultivation(修行), body(炼体), divine(神通), mind(心法)
// 模板不包含 level 和 exp，每个玩家的实例单独存储
export const TECHNIQUE_TEMPLATES = [
  {
    id: 'qingyun', name: '青云吐纳诀', type: 'cultivation',
    baseEffects: { cultivationSpeed: 0.05, spirit: 0.02 },
    maxLevel: 10,
    desc: '基础吐纳法，修炼速度+5%每级，灵力+2%每级',
    expNeed: (lv) => 50 * Math.pow(1.5, lv - 1)  // 升级所需经验公式
  },
  {
    id: 'xuanhuo', name: '玄火炼心诀', type: 'mind',
    baseEffects: { mindGrowth: 0.05, cultivationSpeed: 0.02 },
    maxLevel: 10,
    desc: '炼心法门，心境成长+5%每级，修炼+2%每级',
    expNeed: (lv) => 60 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'taixu', name: '太虚剑意', type: 'divine',
    baseEffects: { attack: 0.06, cultivationSpeed: 0.01 },
    maxLevel: 10,
    desc: '剑意通明，攻击加成+6%每级，修炼+1%每级',
    expNeed: (lv) => 80 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'jiuzhuan', name: '九转归元功', type: 'body',
    baseEffects: { bodyGrowth: 0.05, hp: 0.03 },
    maxLevel: 10,
    desc: '归元炼体，肉身成长+5%每级，气血+3%每级',
    expNeed: (lv) => 70 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'xingchen', name: '星辰观想法', type: 'mind',
    baseEffects: { insightGrowth: 0.05, cultivationSpeed: 0.03 },
    maxLevel: 10,
    desc: '观想星辰，悟性成长+5%每级，修炼+3%每级',
    expNeed: (lv) => 65 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'xuesha', name: '血煞炼体术', type: 'body',
    baseEffects: { bodyGrowth: 0.07, attack: 0.03 },
    maxLevel: 10,
    desc: '血煞炼体，肉身成长+7%每级，攻击+3%每级',
    expNeed: (lv) => 85 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'wuxiang', name: '无相隐息术', type: 'divine',
    baseEffects: { eventRate: -0.05, cultivationSpeed: 0.01 },
    maxLevel: 10,
    desc: '隐息敛气，降低事件频率5%每级，修炼+1%每级',
    expNeed: (lv) => 55 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'lingshou', name: '灵兽通灵诀', type: 'divine',
    baseEffects: { cultivationSpeed: 0.04, fortune: 0.02 },
    maxLevel: 10,
    desc: '通灵万物，修炼+4%每级，福缘+2%每级',
    expNeed: (lv) => 60 * Math.pow(1.5, lv - 1)
  },
  {
    id: 'yinguo', name: '因果轮回诀', type: 'mind',
    baseEffects: { fortune: 0.04, cultivationSpeed: 0.02 },
    maxLevel: 5,
    desc: '因果轮回，福缘+4%每级，修炼+2%每级',
    expNeed: (lv) => 100 * Math.pow(1.8, lv - 1)
  },
  {
    id: 'tianji', name: '天机推演术', type: 'divine',
    baseEffects: { insightGrowth: 0.04, cultivationSpeed: 0.02 },
    maxLevel: 5,
    desc: '推演天机，悟性成长+4%每级，修炼+2%每级',
    expNeed: (lv) => 100 * Math.pow(1.8, lv - 1)
  }
];

/** 获取功法模板 */
export function getTechniqueTemplate(id) {
  return TECHNIQUE_TEMPLATES.find(t => t.id === id);
}

/** 获取玩家的功法实例（如果不存在则创建） */
export function getTechniqueInstance(id) {
  if (!State.techniques.instances) State.techniques.instances = {};
  if (!State.techniques.instances[id]) {
    const tpl = getTechniqueTemplate(id);
    if (!tpl) return null;
    State.techniques.instances[id] = {
      id, level: 1, exp: 0, maxLevel: tpl.maxLevel
    };
  }
  return State.techniques.instances[id];
}

/** 学习功法 */
export function learnTechnique(id) {
  if (!State.techniques) State.techniques = { active: [], learned: [], instances: {} };
  if (State.techniques.learned.includes(id)) return false;
  const tpl = getTechniqueTemplate(id);
  if (!tpl) return false;
  State.techniques.learned.push(id);
  getTechniqueInstance(id); // 初始化实例
  return true;
}

/** 激活功法 */
export function activateTechnique(id) {
  if (!State.techniques.learned.includes(id)) return false;
  if (!State.techniques.active.includes(id)) {
    State.techniques.active.push(id);
  }
  return true;
}

/** 取消激活 */
export function deactivateTechnique(id) {
  State.techniques.active = State.techniques.active.filter(x => x !== id);
}

/** 给功法增加经验（按类型分配） */
export function addExpToType(player, type, amount) {
  if (!player.techniques || !player.techniques.active) return;
  const targets = player.techniques.active
    .map(id => getTechniqueTemplate(id))
    .filter(t => t && t.type === type);
  if (targets.length === 0) return;
  const perTarget = amount / targets.length;
  for (const tpl of targets) {
    addExpToTechnique(tpl.id, perTarget);
  }
}

/** 给单个功法增加经验 */
export function addExpToTechnique(id, amount) {
  const inst = getTechniqueInstance(id);
  if (!inst) return false;
  const tpl = getTechniqueTemplate(id);
  if (!tpl || inst.level >= inst.maxLevel) return false;
  inst.exp += amount;
  // 检查升级
  const need = tpl.expNeed(inst.level);
  if (inst.exp >= need) {
    inst.exp -= need;
    inst.level++;
    console.log('[TECHNIQUE] 升级:', tpl.name, 'Lv.', inst.level);
    return true; // 返回 true 表示升级了
  }
  return false;
}

/** 计算所有激活功法的效果（按类型聚合） */
export function calculateTechniqueEffects(activeIds) {
  const effects = {
    cultivationSpeed: 0, mindGrowth: 0, attack: 0, defense: 0,
    bodyGrowth: 0, insightGrowth: 0, breakthroughRate: 0,
    eventRate: 0, fortune: 0, spirit: 0, hp: 0, mp: 0
  };
  if (!activeIds) return effects;
  activeIds.forEach(id => {
    const tpl = getTechniqueTemplate(id);
    if (!tpl) return;
    const inst = getTechniqueInstance(id);
    if (!inst) return;
    const level = inst.level || 1;
    for (const [k, v] of Object.entries(tpl.baseEffects)) {
      if (effects[k] !== undefined) {
        effects[k] += v * level;
      }
    }
  });
  return effects;
}

/** 获取激活功法实例列表（含当前等级） */
export function getActiveTechniques() {
  if (!State.techniques || !State.techniques.active) return [];
  return State.techniques.active.map(id => {
    const tpl = getTechniqueTemplate(id);
    const inst = getTechniqueInstance(id);
    if (!tpl || !inst) return null;
    return { ...tpl, ...inst, currentLevel: inst.level, currentExp: inst.exp };
  }).filter(Boolean);
}

/** 获取已学习功法实例列表 */
export function getLearnedTechniques() {
  if (!State.techniques || !State.techniques.learned) return [];
  return State.techniques.learned.map(id => {
    const tpl = getTechniqueTemplate(id);
    const inst = getTechniqueInstance(id);
    if (!tpl || !inst) return null;
    return { ...tpl, ...inst, currentLevel: inst.level, currentExp: inst.exp };
  }).filter(Boolean);
}

/** 获取功法类型中文名 */
export function getTypeLabel(type) {
  const map = { cultivation: '修行', body: '炼体', divine: '神通', mind: '心法' };
  return map[type] || type;
}

/** 计算升级进度百分比 */
export function getUpgradeProgress(id) {
  const inst = getTechniqueInstance(id);
  if (!inst) return 0;
  const tpl = getTechniqueTemplate(id);
  if (!tpl || inst.level >= inst.maxLevel) return 100;
  const need = tpl.expNeed(inst.level);
  return Math.min(100, Math.floor((inst.exp / need) * 100));
}

/** 迁移旧存档（v2.4 → v2.4.1） */
export function migrateTechniques(data) {
  if (!data.techniques) return;
  // 旧格式：{ active: [], learned: [] }
  // 新格式：{ active: [], learned: [], instances: {} }
  if (!data.techniques.instances) {
    data.techniques.instances = {};
    for (const id of data.techniques.learned || []) {
      const tpl = getTechniqueTemplate(id);
      if (!tpl) continue;
      data.techniques.instances[id] = {
        id, level: 1, exp: 0, maxLevel: tpl.maxLevel
      };
    }
  }
}
