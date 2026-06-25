import { State } from './State.js';
import { calculateTechniqueEffects } from './TechniqueSystem.js';
import { EventImpact } from '../models/Impact.js';

function makeEvent({ id, title, narrative, type, rarity, choices, resolve }) {
  return { id, title, narrative, type, rarity, choices, resolve };
}

export const EVENTS = [
  makeEvent({
    id: 'lingqi',
    title: '灵气暴走',
    narrative: '修炼途中，体内灵气忽然逆行，\n经脉隐隐作痛。',
    type: 'daily',
    rarity: 'normal',
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
          msg: success ? '镇压成功，修为大涨！' : '镇压失败，经脉受损。',
          narrative: '修炼途中，灵气忽然逆行。\n\n你选择强行镇压。',
          outcome: success ? '经过顽强压制，灵气终于归顺。' : '强行镇压失败，灵气反噬。',
          flavorText: success ? '大道修行，\n从来不是一帆风顺。' : '强求不得，\n反受其害。',
          impact: EventImpact.from({
            cultivation: success ? 12 : -8,
            body: success ? 0 : -2,
            breakthrough: success ? 3 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '顺水推舟，修为稳步提升。',
          narrative: '修炼途中，灵气忽然逆行。\n\n你选择顺势引导。',
          outcome: '顺水推舟，灵气自然流转。',
          flavorText: '顺势而为，\n方为上策。',
          impact: EventImpact.from({
            cultivation: 8,
            breakthrough: 2
          })
        };
      }
      return {
        s: true,
        msg: '暂避锋芒，待灵气平息。',
        narrative: '修炼途中，灵气忽然逆行。\n\n你选择暂停修炼，暂避锋芒。',
        outcome: '暂避锋芒，待灵气自行平息。',
        flavorText: '知止而后有定，\n定而后能静。',
        impact: EventImpact.from({
          cultivation: 3,
          mind: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'xinmo',
    title: '心魔侵扰',
    narrative: '闭关时，往日遗憾化作幻象，\n缠绕心神。',
    type: 'daily',
    rarity: 'normal',
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
          msg: success ? '破茧而出，心魔尽消！' : '心魔反噬。',
          narrative: '闭关时，幻象缠绕心神。\n\n你选择直面心魔。',
          outcome: success ? '破茧而出，心魔尽消。' : '心魔反噬，心神受损。',
          flavorText: success ? '心魔即是己心，\n破之方能见道。' : '道心不稳，\n尚需磨砺。',
          impact: EventImpact.from({
            cultivation: success ? 18 : -10,
            mind: success ? 4 : -3,
            insight: success ? 1 : 0,
            breakthrough: success ? 6 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '清心咒洗涤心神。',
          narrative: '闭关时，幻象缠绕心神。\n\n你诵念清心咒。',
          outcome: '清心咒缓缓洗涤心神，幻象渐消。',
          flavorText: '心静则神清，\n神清则道现。',
          impact: EventImpact.from({
            cultivation: 6,
            mind: 2,
            breakthrough: 1
          })
        };
      }
      const success = Math.random() < 0.3;
      return {
        s: success,
        msg: success ? '置之死地而后生！' : '引魔入体。',
        narrative: '闭关时，幻象缠绕心神。\n\n你引入幻境。',
        outcome: success ? '置之死地而后生，心魔化为己用。' : '引魔入体，道心受损。',
        flavorText: success ? '死地求生，\n破而后立。' : '一念之差，\n万劫不复。',
        impact: EventImpact.from({
          cultivation: success ? 40 : -20,
          mind: success ? 2 : -5,
          insight: success ? 3 : -1,
          breakthrough: success ? 10 : 0
        })
      };
    }
  }),

  makeEvent({
    id: 'dunwu',
    title: '顿悟机缘',
    narrative: '观云卷云舒，忽有所感，\n大道之光照入灵台。',
    type: 'daily',
    rarity: 'uncommon',
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
          msg: success ? '灵光一闪，瓶颈松动！' : '时机未到。',
          narrative: '观云卷云舒，忽有所感。\n\n你全力感悟。',
          outcome: success ? '灵光一闪，瓶颈松动。' : '时机未到，感悟消散。',
          flavorText: success ? '顿悟有时，\n只在刹那。' : '机不可失，\n时不再来。',
          impact: EventImpact.from({
            cultivation: success ? 30 : 5,
            insight: success ? 2 : 0,
            breakthrough: success ? 8 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '稳扎稳打，根基扎实。',
          narrative: '观云卷云舒，忽有所感。\n\n你徐徐图之。',
          outcome: '稳扎稳打，根基愈发扎实。',
          flavorText: '欲速则不达，\n慢即是快。',
          impact: EventImpact.from({
            cultivation: 10,
            insight: 1,
            breakthrough: 3
          })
        };
      }
      return {
        s: true,
        msg: '感悟刻入玉简，气运提升。',
        narrative: '观云卷云舒，忽有所感。\n\n你记录感悟。',
        outcome: '感悟刻入玉简，以备后用。',
        flavorText: '好记性不如烂笔头，\n修行亦然。',
        impact: EventImpact.from({
          cultivation: 5,
          fortune: 8,
          insight: 2
        })
      };
    }
  }),

  makeEvent({
    id: 'xianren',
    title: '仙人指路',
    narrative: '雾中走来一位白发老者，\n自称是云游散仙。',
    type: 'qi',
    rarity: 'uncommon',
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
          msg: success ? '仙人授你心法！' : '老者收了灵石消失。',
          narrative: '雾中走来一位白发老者。\n\n你跪求指点。',
          outcome: success ? '仙人见你诚心，授你心法。' : '老者收了灵石，消失于雾中。',
          flavorText: success ? '诚心所致，\n金石为开。' : '人心难测，\n仙心亦难测。',
          impact: EventImpact.from({
            cultivation: success ? 25 : 0,
            insight: success ? 2 : 0,
            breakthrough: success ? 5 : 0
          })
        };
      }
      if (c === 'B') {
        const success = Math.random() < 0.6;
        return {
          s: success,
          msg: success ? '传了半部心法。' : '老者摇头离去。',
          narrative: '雾中走来一位白发老者。\n\n你谨慎试探。',
          outcome: success ? '传了半部心法，需自行参悟。' : '老者摇头，转身离去。',
          flavorText: success ? '半部心法亦足以问道。' : '机缘未到，\n莫要强求。',
          impact: EventImpact.from({
            cultivation: success ? 15 : 0,
            insight: success ? 1 : 0
          })
        };
      }
      return {
        s: true,
        msg: '虽无所得，亦无失。',
        narrative: '雾中走来一位白发老者。\n\n你婉言谢绝。',
        outcome: '婉言谢绝，虽无所得，亦无失。',
        flavorText: '无缘不强求，\n有缘自会来。',
        impact: EventImpact.from({
          mind: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'moxiu',
    title: '魔修来袭',
    narrative: '一位魔修发现你的洞府，\n欲夺你灵根炼药！',
    type: 'crisis',
    rarity: 'rare',
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
          msg: success ? '反杀魔修，获其储物袋！' : '重伤逃遁。',
          narrative: '魔修发现你的洞府，欲夺灵根。\n\n你拼死一战。',
          outcome: success ? '反杀魔修，获其储物袋。' : '重伤逃遁，险些丧命。',
          flavorText: success ? '杀伐亦是修行。' : '留得青山在，\n不怕没柴烧。',
          impact: EventImpact.from({
            cultivation: success ? 80 : -15,
            body: success ? 0 : -5,
            fortune: success ? 10 : 0,
            breakthrough: success ? 15 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '保全性命。',
          narrative: '魔修发现你的洞府。\n\n你弃洞逃遁。',
          outcome: '弃洞逃遁，保全性命。',
          flavorText: '退一步海阔天空，\n忍一时风平浪静。',
          impact: EventImpact.from({
            mind: 2,
            breakthrough: 2
          })
        };
      }
      const success = Math.random() < 0.5;
      return {
        s: success,
        msg: success ? '破财消灾。' : '魔修贪得无厌。',
        narrative: '魔修发现你的洞府。\n\n你以灵石贿赂。',
        outcome: success ? '破财消灾，魔修满意离去。' : '魔修贪得无厌，只得再付代价。',
        flavorText: success ? '财散人安乐，\n修为最重要。' : '人心不足蛇吞象。',
        impact: EventImpact.from({
          cultivation: success ? 0 : -5,
          fortune: success ? -10 : -20
        })
      };
    }
  })
];

export const REALM_EVENTS = [
  makeEvent({
    id: 'tianjie',
    title: '天劫降临',
    narrative: '乌云压顶，雷劫将至，\n你感受到天地大道的威压。',
    type: 'realm_event',
    rarity: 'rare',
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
          msg: success ? '以身证道，雷劫淬体！' : '雷劫焚身，修为大跌。',
          narrative: '乌云压顶，雷劫将至。\n\n你硬抗雷劫。',
          outcome: success ? '以身证道，雷劫淬体，肉身升华。' : '雷劫焚身，修为大跌。',
          flavorText: success ? '天行健，君子以自强不息。' : '劫数难逃，\n唯有重头来过。',
          impact: EventImpact.from({
            cultivation: success ? 100 : -20,
            body: success ? 5 : -5,
            breakthrough: success ? 20 : 0
          })
        };
      }
      if (c === 'B') {
        const success = Math.random() < 0.7;
        return {
          s: success,
          msg: success ? '法宝护体，安然渡劫。' : '法宝受损，勉强支撑。',
          narrative: '乌云压顶，雷劫将至。\n\n你借助法宝。',
          outcome: success ? '法宝护体，安然渡劫，根基稳固。' : '法宝受损，勉强支撑。',
          flavorText: success ? '工欲善其事，必先利其器。' : '法宝亦有限，\n不可过度依赖。',
          impact: EventImpact.from({
            cultivation: success ? 50 : -10,
            breakthrough: success ? 10 : 0
          })
        };
      }
      return {
        s: true,
        msg: '暂时压制，待时机成熟。',
        narrative: '乌云压顶，雷劫将至。\n\n你暂时压制突破。',
        outcome: '暂时压制突破，待时机成熟再冲击。',
        flavorText: '厚积薄发，\n方能一举成功。',
        impact: EventImpact.from({
          cultivation: 15,
          mind: 2,
          breakthrough: 3
        })
      };
    }
  }),

  makeEvent({
    id: 'pingjing',
    title: '瓶颈阻塞',
    narrative: '修为一再精进，却总差一线，\n仿佛有无形壁障横亘。',
    type: 'realm_event',
    rarity: 'rare',
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
          msg: success ? '破而后立，一步登天！' : '冲击失败，道基动摇。',
          narrative: '修为精进，却总差一线。\n\n你强行突破。',
          outcome: success ? '破而后立，一步登天！' : '冲击失败，道基动摇。',
          flavorText: success ? '不破不立，\n大破大立。' : '欲速则不达，\n道基动摇。',
          impact: EventImpact.from({
            cultivation: success ? 60 : -15,
            body: success ? 0 : -3,
            breakthrough: success ? 15 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '功法调整，隐约松动。',
          narrative: '修为精进，却总差一线。\n\n你调整功法。',
          outcome: '调整功法，瓶颈隐约松动。',
          flavorText: '变则通，\n通则久。',
          impact: EventImpact.from({
            cultivation: 20,
            insight: 1,
            breakthrough: 5
          })
        };
      }
      return {
        s: true,
        msg: '厚积薄发，根基愈发扎实。',
        narrative: '修为精进，却总差一线。\n\n你沉心修炼。',
        outcome: '沉心修炼，厚积薄发，根基愈发扎实。',
        flavorText: '沉住气，\n方能成大器。',
        impact: EventImpact.from({
          cultivation: 8,
          mind: 2,
          body: 1,
          breakthrough: 3
        })
      };
    }
  }),

  makeEvent({
    id: 'tiandi',
    title: '天地共鸣',
    narrative: '万籁俱寂，你感到自身与天地之间\n产生了某种共鸣。',
    type: 'realm_event',
    rarity: 'rare',
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
          msg: success ? '大道可期，一日千里！' : '道心不稳，感悟消散。',
          narrative: '万籁俱寂，天地共鸣。\n\n你参悟大道。',
          outcome: success ? '大道可期，一日千里！' : '道心不稳，感悟消散。',
          flavorText: success ? '天人合一，\n道法自然。' : '道心不稳，\n尚需磨砺。',
          impact: EventImpact.from({
            cultivation: success ? 120 : -10,
            insight: success ? 3 : -1,
            breakthrough: success ? 25 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '境界稳固，根基更牢。',
          narrative: '万籁俱寂，天地共鸣。\n\n你稳固境界。',
          outcome: '稳固境界，根基更牢。',
          flavorText: '根基稳固，\n方能走得更远。',
          impact: EventImpact.from({
            cultivation: 30,
            body: 2,
            mind: 1,
            breakthrough: 8
          })
        };
      }
      return {
        s: true,
        msg: '灵气充盈，修为稳步提升。',
        narrative: '万籁俱寂，天地共鸣。\n\n你引灵入体。',
        outcome: '引灵入体，灵气充盈，修为稳步提升。',
        flavorText: '天地灵气，\n为我所用。',
        impact: EventImpact.from({
          cultivation: 15,
          spirit: 3,
          breakthrough: 5
        })
      };
    }
  })
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
