import { State } from './State.js';
import { calculateTechniqueEffects } from './TechniqueSystem.js';

export const EVENTS = [
  {
    id: 'lingqi', title: '灵气逆流', desc: '修炼时灵气突然逆流，经脉隐隐作痛。',
    type: 'daily',
    choices: [
      { id: 'A', text: '强行镇压（风险）' },
      { id: 'B', text: '顺势引导（平衡）' },
      { id: 'C', text: '暂停修炼（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.6 ? { s: true, exp: 50, msg: '镇压成功，修为大涨！' } : { s: false, exp: -15, msg: '镇压失败，经脉受损。' };
      if (c === 'B') return { s: true, exp: 25, msg: '顺水推舟，修为稳步提升。' };
      return { s: true, exp: 8, msg: '暂避锋芒，待灵气平息。' };
    }
  },
  {
    id: 'xinmo', title: '心魔侵扰', desc: '闭关时，往日遗憾化作幻象，缠绕心神。',
    type: 'daily',
    choices: [
      { id: 'A', text: '直面心魔（风险）' },
      { id: 'B', text: '诵念清心咒（平衡）' },
      { id: 'C', text: '引入幻境（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.5 ? { s: true, exp: 60, msg: '破茧而出，心魔尽消！' } : { s: false, exp: -25, msg: '心魔反噬。' };
      if (c === 'B') return { s: true, exp: 15, msg: '清心咒洗涤心神。' };
      return Math.random() < 0.3 ? { s: true, exp: 120, msg: '置之死地而后生！' } : { s: false, exp: -60, msg: '引魔入体。' };
    }
  },
  {
    id: 'dunwu', title: '顿悟机缘', desc: '观云卷云舒，忽有所感，大道之光照入灵台。',
    type: 'daily',
    choices: [
      { id: 'A', text: '全力感悟（风险）' },
      { id: 'B', text: '徐徐图之（平衡）' },
      { id: 'C', text: '记录感悟（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.5 ? { s: true, exp: 100, msg: '灵光一闪，瓶颈松动！' } : { s: false, exp: 30, msg: '时机未到。' };
      if (c === 'B') return { s: true, exp: 25, msg: '稳扎稳打，根基扎实。' };
      return { s: true, luck: 8, msg: '感悟刻入玉简，气运提升。' };
    }
  },
  {
    id: 'xianren', title: '仙人指路', desc: '雾中走来一位白发老者，自称是云游散仙。',
    type: 'qi',
    choices: [
      { id: 'A', text: '跪求指点（风险）' },
      { id: 'B', text: '谨慎试探（平衡）' },
      { id: 'C', text: '婉言谢绝（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.7 ? { s: true, exp: 70, msg: '仙人授你心法！' } : { s: false, msg: '老者收了灵石消失。' };
      if (c === 'B') return Math.random() < 0.6 ? { s: true, exp: 45, msg: '传了半部心法。' } : { s: false, msg: '老者摇头离去。' };
      return { s: true, msg: '虽无所得，亦无失。' };
    }
  },
  {
    id: 'moxiu', title: '魔修来袭', desc: '一位魔修发现你的洞府，欲夺你灵根炼药！',
    type: 'crisis',
    choices: [
      { id: 'A', text: '拼死一战（风险）' },
      { id: 'B', text: '弃洞逃遁（平衡）' },
      { id: 'C', text: '以灵石贿赂（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.4 ? { s: true, exp: 120, msg: '反杀魔修，获其储物袋！' } : { s: false, exp: -40, msg: '重伤逃遁。' };
      if (c === 'B') return { s: true, msg: '保全性命。' };
      return Math.random() < 0.5 ? { s: true, msg: '破财消灾。' } : { s: false, exp: -25, msg: '魔修贪得无厌。' };
    }
  }
];

export const REALM_EVENTS = [
  {
    id: 'tianjie', title: '天劫降临', type: 'realm_event',
    desc: '乌云压顶，雷劫将至，你感受到天地大道的威压。',
    choices: [
      { id: 'A', text: '硬抗雷劫（风险）' },
      { id: 'B', text: '借助法宝（平衡）' },
      { id: 'C', text: '压制突破（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.45 ? { s: true, exp: 150, msg: '以身证道，雷劫淬体！' } : { s: false, exp: -50, msg: '雷劫焚身，修为大跌。' };
      if (c === 'B') return Math.random() < 0.7 ? { s: true, exp: 80, msg: '法宝护体，安然渡劫。' } : { s: false, exp: -20, msg: '法宝受损，勉强支撑。' };
      return { s: true, exp: 30, msg: '暂时压制，待时机成熟。' };
    }
  },
  {
    id: 'pingjing', title: '瓶颈阻塞', type: 'realm_event',
    desc: '修为一再精进，却总差一线，仿佛有无形壁障横亘。',
    choices: [
      { id: 'A', text: '强行突破（风险）' },
      { id: 'B', text: '调整功法（平衡）' },
      { id: 'C', text: '沉心修炼（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.4 ? { s: true, exp: 100, msg: '破而后立，一步登天！' } : { s: false, exp: -40, msg: '冲击失败，道基动摇。' };
      if (c === 'B') return { s: true, exp: 40, msg: '功法调整，隐约松动。' };
      return { s: true, exp: 15, msg: '厚积薄发，根基愈发扎实。' };
    }
  },
  {
    id: 'tiandi', title: '天地共鸣', type: 'realm_event',
    desc: '万籁俱寂，你感到自身与天地之间产生了某种共鸣。',
    choices: [
      { id: 'A', text: '参悟大道（风险）' },
      { id: 'B', text: '稳固境界（平衡）' },
      { id: 'C', text: '引灵入体（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.5 ? { s: true, exp: 200, msg: '大道可期，一日千里！' } : { s: false, exp: -30, msg: '道心不稳，感悟消散。' };
      if (c === 'B') return { s: true, exp: 50, msg: '境界稳固，根基更牢。' };
      return { s: true, exp: 25, msg: '灵气充盈，修为稳步提升。' };
    }
  }
];

export class EventEngine {
  constructor() {
    this.eventInProgress = false;
    this.eventTimer = null;
  }

  getEventChance() {
    let base = State.meditationMode ? 0.985 : 0.97;
    const effects = calculateTechniqueEffects(State.techniques.active);
    if (effects.eventReduction > 0) {
      base += effects.eventReduction * 0.05;
    }
    return base;
  }

  roll() {
    const r = Math.random();
    if (r > this.getEventChance()) {
      this.eventInProgress = true;
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      return event;
    }
    return null;
  }

  rollRealmEvent() {
    this.eventInProgress = true;
    const event = REALM_EVENTS[Math.floor(Math.random() * REALM_EVENTS.length)];
    return event;
  }

  reset() {
    this.eventInProgress = false;
  }

  schedule(callback) {
    const delay = Math.floor(Math.random() * 25000) + 15000;
    console.log('[Event] next in', (delay / 1000).toFixed(0), 's');
    if (this.eventTimer) clearTimeout(this.eventTimer);
    this.eventTimer = setTimeout(() => {
      if (!this.eventInProgress) {
        this.eventInProgress = true;
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        callback(event);
      }
    }, delay);
  }
}
