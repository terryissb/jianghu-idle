import { State } from './State.js';

export const TECHNIQUES = [
  {
    id: 'qingyun', name: '青云吐纳诀', type: 'foundation', level: 1,
    effect: { cultivationSpeed: 0.10 }, desc: '修炼速度+10%',
    focus: '灵气吸收', maxLevel: 5
  },
  {
    id: 'xuanhuo', name: '玄火炼心诀', type: 'mental', level: 1,
    effect: { mindResist: 0.20 }, desc: '心境稳定+20%',
    focus: '抗心魔', maxLevel: 5
  },
  {
    id: 'taixu', name: '太虚剑意', type: 'combat', level: 1,
    effect: { attackGrowth: 0.15 }, desc: '攻击成长+15%',
    focus: '杀伐之道', maxLevel: 5
  },
  {
    id: 'jiuzhuan', name: '九转归元功', type: 'advanced', level: 1,
    effect: { breakthroughRate: 0.10 }, desc: '突破概率提升10%',
    focus: '境界突破', maxLevel: 5
  },
  {
    id: 'lingshou', name: '灵兽通灵诀', type: 'beast', level: 1,
    effect: { beastAffinity: 0.30 }, desc: '灵兽亲和+30%',
    focus: '灵兽系统', maxLevel: 5
  },
  {
    id: 'xingchen', name: '星辰观想法', type: 'spiritual', level: 1,
    effect: { insight: 0.15 }, desc: '悟性+15%',
    focus: '顿悟概率', maxLevel: 5
  },
  {
    id: 'xuesha', name: '血煞炼体术', type: 'body', level: 1,
    effect: { bodyGrowth: 0.20 }, desc: '肉身+20%',
    focus: '体修路线', maxLevel: 5
  },
  {
    id: 'wuxiang', name: '无相隐息术', type: 'utility', level: 1,
    effect: { eventReduction: 0.30 }, desc: '降低事件触发概率30%',
    focus: '沉静修行', maxLevel: 5
  },
  {
    id: 'yinguo', name: '因果轮回诀', type: 'rare', level: 1,
    effect: { futureInfluence: 0.15 }, desc: '影响未来事件结构+15%',
    focus: '命运线', maxLevel: 3
  },
  {
    id: 'tianji', name: '天机推演术', type: 'rare', level: 1,
    effect: { foresight: 0.25 }, desc: '预知部分事件概率+25%',
    focus: '概率控制', maxLevel: 3
  }
];

export function getTechnique(id) {
  return TECHNIQUES.find(t => t.id === id);
}

export function calculateTechniqueEffects(activeIds) {
  const effects = {
    cultivationSpeed: 0, mindResist: 0, attackGrowth: 0,
    breakthroughRate: 0, beastAffinity: 0, insight: 0,
    bodyGrowth: 0, eventReduction: 0, futureInfluence: 0, foresight: 0
  };
  activeIds.forEach(id => {
    const t = getTechnique(id);
    if (!t) return;
    for (const [k, v] of Object.entries(t.effect)) {
      if (effects[k] !== undefined) {
        effects[k] += v * t.level;
      }
    }
  });
  return effects;
}

export function learnTechnique(id) {
  if (!State.techniques) State.techniques = { active: [], learned: [] };
  const t = getTechnique(id);
  if (!t) return false;
  if (State.techniques.learned.includes(id)) return false;
  State.techniques.learned.push(id);
  return true;
}

export function activateTechnique(id) {
  if (!State.techniques.learned.includes(id)) return false;
  if (!State.techniques.active.includes(id)) {
    State.techniques.active.push(id);
  }
  return true;
}

export function deactivateTechnique(id) {
  State.techniques.active = State.techniques.active.filter(x => x !== id);
}

export function upgradeTechnique(id) {
  const t = getTechnique(id);
  if (!t || t.level >= t.maxLevel) return false;
  t.level++;
  return true;
}

export function getActiveTechniques() {
  return State.techniques.active.map(id => getTechnique(id)).filter(Boolean);
}

export function getLearnedTechniques() {
  return State.techniques.learned.map(id => getTechnique(id)).filter(Boolean);
}
