import { State } from './State.js';
import { calculateTechniqueEffects } from './TechniqueSystem.js';

export const EVENTS = [
  {
    id: 'lingqi',
    title: '灵气暴走',
    narrative: '修炼途中，体内灵气忽然逆行，经脉隐隐作痛。',
    type: 'daily',
    choices: [
      { id: 'A', text: '强行镇压（风险）' },
      { id: 'B', text: '顺势引导（平衡）' },
      { id: 'C', text: '暂停修炼（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.6;
        return {
          s: success,
          exp: success ? 50 : -15,
          msg: success ? '镇压成功，修为大涨！' : '镇压失败，经脉受损。',
          outcome: success ? '经过顽强压制，灵气终于归顺，修为大涨。' : '强行镇压失败，灵气反噬，经脉受损。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          exp: 25,
          msg: '顺水推舟，修为稳步提升。',
          outcome: '顺水推舟，灵气自然流转，修为稳步提升。'
        };
      }
      return {
        s: true,
        exp: 8,
        msg: '暂避锋芒，待灵气平息。',
        outcome: '暂时避让，待灵气自行平息，根基未损。'
      };
    }
  },
  {
    id: 'xinmo',
    title: '心魔侵扰',
    narrative: '闭关时，往日遗憾化作幻象，缠绕心神。',
    type: 'daily',
    choices: [
      { id: 'A', text: '直面心魔（风险）' },
      { id: 'B', text: '诵念清心咒（平衡）' },
      { id: 'C', text: '引入幻境（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.5;
        return {
          s: success,
          exp: success ? 60 : -25,
          msg: success ? '破茧而出，心魔尽消！' : '心魔反噬。',
          outcome: success ? '直面心魔，破茧而出，心魔尽消。' : '心魔反噬，心神受损。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          exp: 15,
          msg: '清心咒洗涤心神。',
          outcome: '清心咒缓缓洗涤心神，幻象渐消。'
        };
      }
      const success = Math.random() < 0.3;
      return {
        s: success,
        exp: success ? 120 : -60,
        msg: success ? '置之死地而后生！' : '引魔入体。',
        outcome: success ? '置之死地而后生，心魔化为己用。' : '引魔入体，道心受损。'
      };
    }
  },
  {
    id: 'dunwu',
    title: '顿悟机缘',
    narrative: '观云卷云舒，忽有所感，大道之光照入灵台。',
    type: 'daily',
    choices: [
      { id: 'A', text: '全力感悟（风险）' },
      { id: 'B', text: '徐徐图之（平衡）' },
      { id: 'C', text: '记录感悟（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.5;
        return {
          s: success,
          exp: success ? 100 : 30,
          msg: success ? '灵光一闪，瓶颈松动！' : '时机未到。',
          outcome: success ? '灵光一闪，瓶颈松动，大道可期。' : '时机未到，感悟消散。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          exp: 25,
          msg: '稳扎稳打，根基扎实。',
          outcome: '稳扎稳打，根基愈发扎实。'
        };
      }
      return {
        s: true,
        luck: 8,
        msg: '感悟刻入玉简，气运提升。',
        outcome: '感悟刻入玉简，气运提升，以备后用。'
      };
    }
  },
  {
    id: 'xianren',
    title: '仙人指路',
    narrative: '雾中走来一位白发老者，自称是云游散仙。',
    type: 'qi',
    choices: [
      { id: 'A', text: '跪求指点（风险）' },
      { id: 'B', text: '谨慎试探（平衡）' },
      { id: 'C', text: '婉言谢绝（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.7;
        return {
          s: success,
          exp: success ? 70 : 0,
          msg: success ? '仙人授你心法！' : '老者收了灵石消失。',
          outcome: success ? '仙人见你诚心，授你心法。' : '老者收了灵石，消失于雾中。'
        };
      }
      if (c === 'B') {
        const success = Math.random() < 0.6;
        return {
          s: success,
          exp: success ? 45 : 0,
          msg: success ? '传了半部心法。' : '老者摇头离去。',
          outcome: success ? '传了半部心法，需自行参悟。' : '老者摇头，转身离去。'
        };
      }
      return {
        s: true,
        msg: '虽无所得，亦无失。',
        outcome: '婉言谢绝，虽无所得，亦无失。'
      };
    }
  },
  {
    id: 'moxiu',
    title: '魔修来袭',
    narrative: '一位魔修发现你的洞府，欲夺你灵根炼药！',
    type: 'crisis',
    choices: [
      { id: 'A', text: '拼死一战（风险）' },
      { id: 'B', text: '弃洞逃遁（平衡）' },
      { id: 'C', text: '以灵石贿赂（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.4;
        return {
          s: success,
          exp: success ? 120 : -40,
          msg: success ? '反杀魔修，获其储物袋！' : '重伤逃遁。',
          outcome: success ? '反杀魔修，获其储物袋，满载而归。' : '重伤逃遁，险些丧命。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '保全性命。',
          outcome: '弃洞逃遁，保全性命，待日后再寻洞府。'
        };
      }
      const success = Math.random() < 0.5;
      return {
        s: success,
        msg: success ? '破财消灾。' : '魔修贪得无厌。',
        outcome: success ? '破财消灾，魔修满意离去。' : '魔修贪得无厌，只得再付代价。'
      };
    }
  }
];

export const REALM_EVENTS = [
  {
    id: 'tianjie',
    title: '天劫降临',
    narrative: '乌云压顶，雷劫将至，你感受到天地大道的威压。',
    type: 'realm_event',
    choices: [
      { id: 'A', text: '硬抗雷劫（风险）' },
      { id: 'B', text: '借助法宝（平衡）' },
      { id: 'C', text: '压制突破（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.45;
        return {
          s: success,
          exp: success ? 150 : -50,
          msg: success ? '以身证道，雷劫淬体！' : '雷劫焚身，修为大跌。',
          outcome: success ? '以身证道，雷劫淬体，肉身升华。' : '雷劫焚身，修为大跌。'
        };
      }
      if (c === 'B') {
        const success = Math.random() < 0.7;
        return {
          s: success,
          exp: success ? 80 : -20,
          msg: success ? '法宝护体，安然渡劫。' : '法宝受损，勉强支撑。',
          outcome: success ? '法宝护体，安然渡劫，根基稳固。' : '法宝受损，勉强支撑。'
        };
      }
      return {
        s: true,
        exp: 30,
        msg: '暂时压制，待时机成熟。',
        outcome: '暂时压制突破，待时机成熟再冲击。'
      };
    }
  },
  {
    id: 'pingjing',
    title: '瓶颈阻塞',
    narrative: '修为一再精进，却总差一线，仿佛有无形壁障横亘。',
    type: 'realm_event',
    choices: [
      { id: 'A', text: '强行突破（风险）' },
      { id: 'B', text: '调整功法（平衡）' },
      { id: 'C', text: '沉心修炼（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.4;
        return {
          s: success,
          exp: success ? 100 : -40,
          msg: success ? '破而后立，一步登天！' : '冲击失败，道基动摇。',
          outcome: success ? '破而后立，一步登天！' : '冲击失败，道基动摇。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          exp: 40,
          msg: '功法调整，隐约松动。',
          outcome: '调整功法，瓶颈隐约松动。'
        };
      }
      return {
        s: true,
        exp: 15,
        msg: '厚积薄发，根基愈发扎实。',
        outcome: '沉心修炼，厚积薄发，根基愈发扎实。'
      };
    }
  },
  {
    id: 'tiandi',
    title: '天地共鸣',
    narrative: '万籁俱寂，你感到自身与天地之间产生了某种共鸣。',
    type: 'realm_event',
    choices: [
      { id: 'A', text: '参悟大道（风险）' },
      { id: 'B', text: '稳固境界（平衡）' },
      { id: 'C', text: '引灵入体（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.5;
        return {
          s: success,
          exp: success ? 200 : -30,
          msg: success ? '大道可期，一日千里！' : '道心不稳，感悟消散。',
          outcome: success ? '大道可期，一日千里！' : '道心不稳，感悟消散。'
        };
      }
      if (c === 'B') {
        return {
          s: true,
          exp: 50,
          msg: '境界稳固，根基更牢。',
          outcome: '稳固境界，根基更牢。'
        };
      }
      return {
        s: true,
        exp: 25,
        msg: '灵气充盈，修为稳步提升。',
        outcome: '引灵入体，灵气充盈，修为稳步提升。'
      };
    }
  }
];

export class EventEngine {
  constructor() {
    this.eventInProgress = false;
    this.eventTimer = null;
  }

  getEventChance() {
    let base = State.meditationMode ? 0.95 : 0.92;
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
    const delay = Math.floor(Math.random() * 15000) + 10000;
    console.log('[EventEngine] next event in', (delay / 1000).toFixed(0), 's');
    if (this.eventTimer) clearTimeout(this.eventTimer);
    this.eventTimer = setTimeout(() => {
      if (!this.eventInProgress) {
        this.eventInProgress = true;
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        callback(event);
      } else {
        console.log('[EventEngine] skipped, rescheduling');
        this.schedule(callback);
      }
    }, delay);
  }
}
