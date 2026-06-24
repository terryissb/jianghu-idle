export const EVENTS = [
  {
    title: '灵气逆流',
    desc: '修炼时灵气突然逆流，经脉隐隐作痛。',
    type: 'daily',
    choices: [
      { id: 'A', text: '强行镇压' },
      { id: 'B', text: '顺势引导' },
      { id: 'C', text: '暂停修炼' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.6 ? { s: true, exp: 40, msg: '镇压成功，修为大涨！' } : { s: false, exp: -10, msg: '镇压失败，经脉受损。' };
      if (c === 'B') return { s: true, exp: 20, msg: '顺水推舟，修为稳步提升。' };
      return { s: true, exp: 5, msg: '暂避锋芒，待灵气平息。' };
    }
  },
  {
    title: '心魔侵扰',
    desc: '闭关时，往日遗憾化作幻象，缠绕心神。',
    type: 'daily',
    choices: [
      { id: 'A', text: '直面心魔' },
      { id: 'B', text: '诵念清心咒' },
      { id: 'C', text: '引入幻境' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.5 ? { s: true, exp: 50, msg: '破茧而出，心魔尽消！' } : { s: false, exp: -20, msg: '心魔反噬。' };
      if (c === 'B') return { s: true, exp: 10, msg: '清心咒洗涤心神。' };
      return Math.random() < 0.3 ? { s: true, exp: 100, msg: '置之死地而后生！' } : { s: false, exp: -50, msg: '引魔入体。' };
    }
  },
  {
    title: '顿悟机缘',
    desc: '观云卷云舒，忽有所感，大道之光照入灵台。',
    type: 'daily',
    choices: [
      { id: 'A', text: '全力感悟' },
      { id: 'B', text: '徐徐图之' },
      { id: 'C', text: '记录感悟' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.5 ? { s: true, exp: 80, msg: '灵光一闪，瓶颈松动！' } : { s: false, exp: 20, msg: '时机未到。' };
      if (c === 'B') return { s: true, exp: 20, msg: '稳扎稳打，根基扎实。' };
      return { s: true, luck: 5, msg: '感悟刻入玉简，气运提升。' };
    }
  },
  {
    title: '仙人指路',
    desc: '雾中走来一位白发老者，自称是云游散仙。',
    type: 'qi',
    choices: [
      { id: 'A', text: '跪求指点' },
      { id: 'B', text: '谨慎试探' },
      { id: 'C', text: '婉言谢绝' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.7 ? { s: true, exp: 60, msg: '仙人授你心法！' } : { s: false, msg: '老者收了灵石消失。' };
      if (c === 'B') return Math.random() < 0.6 ? { s: true, exp: 40, msg: '传了半部心法。' } : { s: false, msg: '老者摇头离去。' };
      return { s: true, msg: '虽无所得，亦无失。' };
    }
  },
  {
    title: '魔修来袭',
    desc: '一位魔修发现你的洞府，欲夺你灵根炼药！',
    type: 'crisis',
    choices: [
      { id: 'A', text: '拼死一战' },
      { id: 'B', text: '弃洞逃遁' },
      { id: 'C', text: '以灵石贿赂' }
    ],
    resolve: (c) => {
      if (c === 'A') return Math.random() < 0.4 ? { s: true, exp: 100, msg: '反杀魔修，获其储物袋！' } : { s: false, exp: -30, msg: '重伤逃遁。' };
      if (c === 'B') return { s: true, msg: '保全性命。' };
      return Math.random() < 0.5 ? { s: true, msg: '破财消灾。' } : { s: false, exp: -20, msg: '魔修贪得无厌。' };
    }
  }
];

export class EventEngine {
  constructor() {
    this.eventInProgress = false;
    this.eventTimer = null;
  }

  roll() {
    const r = Math.random();
    if (r > 0.92) {
      this.eventInProgress = true;
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      return event;
    }
    return null;
  }

  reset() {
    this.eventInProgress = false;
  }

  schedule(callback) {
    const delay = Math.floor(Math.random() * 20000) + 10000;
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
