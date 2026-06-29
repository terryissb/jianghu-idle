import { EventImpact } from '../models/Impact.js';
import { State } from './State.js';
import { calculateTechniqueEffects } from './TechniqueSystem.js';

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
            breakthrough: success ? 3 : 0,
            buff: success ? {
              name: '灵气归顺',
              modifiers: [{ target: 'cultivationSpeed', value: 0.2 }],
              duration: 90
            } : null
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
            breakthrough: success ? 6 : 0,
            buff: success ? {
              name: '心魔尽消',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.3 },
                { target: 'mindGrowth', value: 0.2 }
              ],
              duration: 120
            } : null
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
            breakthrough: success ? 8 : 0,
            buff: success ? {
              name: '顿悟',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.5 },
                { target: 'insightGrowth', value: 0.3 }
              ],
              duration: 60
            } : null
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
            breakthrough: success ? 5 : 0,
            buff: success ? {
              name: '仙缘',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.25 },
                { target: 'fortune', value: 0.1 }
              ],
              duration: 150
            } : null
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
            breakthrough: success ? 15 : 0,
            buff: success ? {
              name: '魔修战意',
              modifiers: [
                { target: 'attack', value: 0.2 },
                { target: 'cultivationSpeed', value: 0.1 }
              ],
              duration: 180
            } : null
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
  }),

  makeEvent({
    id: 'gongfa_canjuan',
    title: '功法残卷',
    narrative: '路过古战场，\n草丛中露出半截泛黄卷轴。',
    type: 'qi',
    rarity: 'uncommon',
    choices: [
      { id: 'A', text: '拾取参悟（风险）' },
      { id: 'B', text: '就地研读（平衡）' },
      { id: 'C', text: '带走收藏（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.6;
        return {
          s: success,
          msg: success ? '残卷中藏有功法！' : '残卷残缺，无法参悟。',
          narrative: '路过古战场，\n你拾取残卷尝试参悟。',
          outcome: success ? '参悟残卷，获得功法！' : '残卷破损，无法参悟。',
          flavorText: success ? '机缘所至，\n不可强求。' : '残缺之物，\n难以使用。',
          impact: EventImpact.from({
            cultivation: success ? 15 : 0,
            insight: success ? 1 : 0
          }),
          technique: true
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '你研读残卷，修为提升。',
          narrative: '路过古战场，\n你就在原地研读残卷。',
          outcome: '研读残卷，修为有所提升。',
          flavorText: '书中自有颜如玉，\n书中自有黄金屋。',
          impact: EventImpact.from({
            cultivation: 10,
            insight: 1
          })
        };
      }
      return {
        s: true,
        msg: '你带走残卷，待日后研究。',
        narrative: '路过古战场，\n你带走残卷收藏。',
        outcome: '残卷收藏，待日后研究。',
        flavorText: '好记性不如烂笔头，\n收藏也是一种智慧。',
        impact: EventImpact.from({
        })
      };
    }
  }),

  makeEvent({
    id: 'caiyao_dan',
    title: '采药炼丹',
    narrative: '后山灵气汇聚，\n一片灵药园浮现眼前。',
    type: 'daily',
    rarity: 'normal',
    choices: [
      { id: 'A', text: '冒险采药（风险）' },
      { id: 'B', text: '稳妥采摘（平衡）' },
      { id: 'C', text: '只取少许可（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.55;
        return {
          s: success,
          msg: success ? '采得珍稀灵药！' : '惊动守护灵兽。',
          narrative: '后山灵气汇聚，\n你选择冒险深入采药。',
          outcome: success ? '采得珍稀灵药，炼丹有成。' : '惊动守护灵兽，狼狈逃回。',
          flavorText: success ? '富贵险中求。' : '贪心不足蛇吞象。',
          impact: EventImpact.from({
            cultivation: success ? 15 : -5,
            body: success ? 0 : -3,
            buff: success ? {
              name: '灵药丹成',
              modifiers: [{ target: 'cultivationSpeed', value: 0.15 }, { target: 'bodyGrowth', value: 0.1 }],
              duration: 120
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '稳妥采摘，小有收获。',
          narrative: '后山灵气汇聚，\n你稳妥采摘灵药。',
          outcome: '采摘数株灵药，小有收获。',
          flavorText: '稳中求胜。',
          impact: EventImpact.from({
            cultivation: 8,
            body: 1
          })
        };
      }
      return {
        s: true,
        msg: '只取少许，不伤根本。',
        narrative: '后山灵气汇聚，\n你只取少量灵药。',
        outcome: '取少许灵药，不伤药园根本。',
        flavorText: '取之有度，\n用之不竭。',
        impact: EventImpact.from({
          cultivation: 4,
          mind: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'fangshi_jiaoyi',
    title: '坊市交易',
    narrative: '途经修仙坊市，\n人声鼎沸，宝光流转。',
    type: 'daily',
    rarity: 'normal',
    choices: [
      { id: 'A', text: '豪赌买宝（风险）' },
      { id: 'B', text: '谨慎挑选（平衡）' },
      { id: 'C', text: '只看不买（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.45;
        return {
          s: success,
          msg: success ? '捡到天大便宜！' : '买到假货，血本无归。',
          narrative: '途经修仙坊市，\n你豪赌买宝。',
          outcome: success ? '捡漏获得稀世灵材！' : '买到假货，损失惨重。',
          flavorText: success ? '运气也是实力。' : '人心险恶。',
          impact: EventImpact.from({
            cultivation: success ? 20 : -10,
            fortune: success ? 5 : -5,
            buff: success ? {
              name: '捡漏之喜',
              modifiers: [{ target: 'fortune', value: 0.15 }],
              duration: 90
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '稳妥交易，小赚一笔。',
          narrative: '途经修仙坊市，\n你谨慎挑选货物。',
          outcome: '交易几件灵材，小赚一笔。',
          flavorText: '货比三家不吃亏。',
          impact: EventImpact.from({
            cultivation: 6,
            fortune: 2
          })
        };
      }
      return {
        s: true,
        msg: '只看不买，心无旁骛。',
        narrative: '途经修仙坊市，\n你只看不买。',
        outcome: '观摩他人交易，眼界大开。',
        flavorText: '眼界也是一种财富。',
        impact: EventImpact.from({
          cultivation: 3,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'daoyou_lundao',
    title: '道友论道',
    narrative: '山亭偶遇同道中人，\n对方邀请你论道切磋。',
    type: 'daily',
    rarity: 'normal',
    choices: [
      { id: 'A', text: '全力切磋（风险）' },
      { id: 'B', text: '点到为止（平衡）' },
      { id: 'C', text: '只论不斗（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.5;
        return {
          s: success,
          msg: success ? '略胜一筹，对方叹服！' : '惜败半招，受益匪浅。',
          narrative: '山亭偶遇同道，\n你全力切磋。',
          outcome: success ? '略胜一筹，对方叹服离去。' : '惜败半招，但收获良多。',
          flavorText: success ? '以武会友。' : '失败也是修行。',
          impact: EventImpact.from({
            cultivation: success ? 12 : 5,
            insight: success ? 2 : 1,
            body: success ? 0 : -2
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '点到为止，皆大欢喜。',
          narrative: '山亭偶遇同道，\n你们点到为止切磋。',
          outcome: '点到为止，双方各有所悟。',
          flavorText: '和为贵。',
          impact: EventImpact.from({
            cultivation: 8,
            insight: 1,
            mind: 1
          })
        };
      }
      return {
        s: true,
        msg: '坐而论道，不涉斗法。',
        narrative: '山亭偶遇同道，\n你只论道不斗法。',
        outcome: '论道三刻，双方心境皆有所提升。',
        flavorText: '论道亦是修行。',
        impact: EventImpact.from({
          cultivation: 5,
          mind: 2,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'biguan_kuxiu',
    title: '闭关苦修',
    narrative: '寻得一处洞府，\n灵气充沛，正是闭关好时机。',
    type: 'daily',
    rarity: 'normal',
    choices: [
      { id: 'A', text: '冲击瓶颈（风险）' },
      { id: 'B', text: '稳固修为（平衡）' },
      { id: 'C', text: '冥想养神（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.4;
        return {
          s: success,
          msg: success ? '冲破瓶颈，修为大进！' : '冲击失败，灵气反噬。',
          narrative: '寻得洞府闭关，\n你冲击瓶颈。',
          outcome: success ? '冲破瓶颈，修为大进！' : '冲击失败，灵气反噬。',
          flavorText: success ? '破而后立。' : '欲速则不达。',
          impact: EventImpact.from({
            cultivation: success ? 25 : -8,
            body: success ? 0 : -3,
            breakthrough: success ? 8 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '稳固修为，根基扎实。',
          narrative: '寻得洞府闭关，\n你稳固修为。',
          outcome: '闭关三日，修为稳固。',
          flavorText: '稳扎稳打。',
          impact: EventImpact.from({
            cultivation: 10,
            body: 2,
            mind: 1
          })
        };
      }
      return {
        s: true,
        msg: '冥想养神，心神合一。',
        narrative: '寻得洞府闭关，\n你冥想养神。',
        outcome: '冥想养神，心神合一。',
        flavorText: '静能生慧。',
        impact: EventImpact.from({
          cultivation: 5,
          mind: 3,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'guxiu_yifu',
    title: '古修遗府',
    narrative: '山崩地裂，\n一座古老洞府显露眼前。',
    type: 'qi',
    rarity: 'rare',
    choices: [
      { id: 'A', text: '强行闯入（风险）' },
      { id: 'B', text: '破解禁制（平衡）' },
      { id: 'C', text: '在外参悟（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.35;
        return {
          s: success,
          msg: success ? '闯过禁制，获得传承！' : '触发禁制，身受重伤。',
          narrative: '山崩地裂，古修遗府显露。\n你强行闯入。',
          outcome: success ? '闯过禁制，获得古修传承！' : '触发禁制，身受重伤。',
          flavorText: success ? '富贵险中求。' : '禁制重重。',
          impact: EventImpact.from({
            cultivation: success ? 60 : -15,
            body: success ? 0 : -5,
            insight: success ? 3 : 0,
            buff: success ? {
              name: '古修传承',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.35 },
                { target: 'insightGrowth', value: 0.2 }
              ],
              duration: 180
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '破解禁制，安然入内。',
          narrative: '山崩地裂，古修遗府显露。\n你破解禁制。',
          outcome: '破解禁制，安然入内获得机缘。',
          flavorText: '智慧胜过蛮力。',
          impact: EventImpact.from({
            cultivation: 30,
            insight: 2,
            mind: 1
          })
        };
      }
      return {
        s: true,
        msg: '在外参悟，略有所得。',
        narrative: '山崩地裂，古修遗府显露。\n你在外参悟。',
        outcome: '参悟洞府外溢灵气，略有所得。',
        flavorText: '远观亦有道。',
        impact: EventImpact.from({
          cultivation: 12,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'lingshou_chumo',
    title: '灵兽出没',
    narrative: '林间异动，\n一只灵兽正在觅食。',
    type: 'qi',
    rarity: 'uncommon',
    choices: [
      { id: 'A', text: '尝试驯服（风险）' },
      { id: 'B', text: '远远观察（平衡）' },
      { id: 'C', text: '绕道而行（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.45;
        return {
          s: success,
          msg: success ? '灵兽认主，福缘深厚！' : '灵兽受惊，反噬伤你。',
          narrative: '林间异动，灵兽觅食。\n你尝试驯服。',
          outcome: success ? '灵兽认主，成为你的伙伴！' : '灵兽受惊，反噬伤你。',
          flavorText: success ? '万物有灵。' : '强求不得。',
          impact: EventImpact.from({
            cultivation: success ? 20 : -8,
            body: success ? 0 : -3,
            fortune: success ? 8 : -2,
            buff: success ? {
              name: '灵兽相伴',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.2 },
                { target: 'fortune', value: 0.1 }
              ],
              duration: 150
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '观察灵兽，获得感悟。',
          narrative: '林间异动，灵兽觅食。\n你远远观察。',
          outcome: '观察灵兽习性，获得感悟。',
          flavorText: '观物悟道。',
          impact: EventImpact.from({
            cultivation: 8,
            insight: 2,
            fortune: 2
          })
        };
      }
      return {
        s: true,
        msg: '绕道而行，不扰灵兽。',
        narrative: '林间异动，灵兽觅食。\n你绕道而行。',
        outcome: '不扰灵兽，各自安好。',
        flavorText: '敬而远之。',
        impact: EventImpact.from({
          cultivation: 3,
          mind: 2
        })
      };
    }
  }),

  makeEvent({
    id: 'lingmai_yidong',
    title: '灵脉异动',
    narrative: '大地微震，\n灵气突然从地底喷涌而出。',
    type: 'qi',
    rarity: 'uncommon',
    choices: [
      { id: 'A', text: '全力吸收（风险）' },
      { id: 'B', text: '适度吸收（平衡）' },
      { id: 'C', text: '记录位置（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.55;
        return {
          s: success,
          msg: success ? '吸收大量灵气，修为大增！' : '灵气过盛，经脉受损。',
          narrative: '大地微震，灵气喷涌。\n你全力吸收。',
          outcome: success ? '吸收大量灵气，修为大增！' : '灵气过盛，经脉受损。',
          flavorText: success ? '机不可失。' : '过犹不及。',
          impact: EventImpact.from({
            cultivation: success ? 35 : -10,
            body: success ? 0 : -4,
            spirit: success ? 3 : 0,
            buff: success ? {
              name: '灵脉加持',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.3 },
                { target: 'spirit', value: 0.2 }
              ],
              duration: 120
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '适度吸收，修为稳步提升。',
          narrative: '大地微震，灵气喷涌。\n你适度吸收。',
          outcome: '适度吸收灵气，修为稳步提升。',
          flavorText: '量力而行。',
          impact: EventImpact.from({
            cultivation: 15,
            spirit: 2
          })
        };
      }
      return {
        s: true,
        msg: '记录位置，待日后利用。',
        narrative: '大地微震，灵气喷涌。\n你记录位置。',
        outcome: '记录灵脉位置，待日后利用。',
        flavorText: '好记性不如烂笔头。',
        impact: EventImpact.from({
          cultivation: 5,
          fortune: 5,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'zouhuo_rumo',
    title: '走火入魔',
    narrative: '修炼中气息突然逆行，\n丹田剧痛，意识模糊。',
    type: 'crisis',
    rarity: 'rare',
    choices: [
      { id: 'A', text: '强行逆转（风险）' },
      { id: 'B', text: '散功保命（平衡）' },
      { id: 'C', text: '顺其自然（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.35;
        return {
          s: success,
          msg: success ? '逆转成功，因祸得福！' : '走火入魔，修为大损。',
          narrative: '气息逆行，丹田剧痛。\n你强行逆转。',
          outcome: success ? '逆转成功，修为反而精进！' : '走火入魔，修为大损。',
          flavorText: success ? '置之死地而后生。' : '强行逆转，反受其害。',
          impact: EventImpact.from({
            cultivation: success ? 30 : -20,
            body: success ? 0 : -5,
            mind: success ? 0 : -4,
            buff: success ? {
              name: '逆练成功',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.25 },
                { target: 'breakthroughRate', value: 0.15 }
              ],
              duration: 180
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '散功保命，保全根基。',
          narrative: '气息逆行，丹田剧痛。\n你选择散功保命。',
          outcome: '散功保命，修为受损但根基保全。',
          flavorText: '留得青山在。',
          impact: EventImpact.from({
            cultivation: -8,
            body: 1,
            mind: 2
          })
        };
      }
      return {
        s: true,
        msg: '顺其自然，气息渐稳。',
        narrative: '气息逆行，丹田剧痛。\n你顺其自然。',
        outcome: '顺其自然，气息渐稳，修为微降。',
        flavorText: '无为而无不为。',
        impact: EventImpact.from({
          cultivation: -3,
          mind: 3,
          insight: 1
        })
      };
    }
  }),

  makeEvent({
    id: 'choujia_zhuishang',
    title: '仇家追杀',
    narrative: '远处传来杀气，\n你的仇家带着人手追来了！',
    type: 'crisis',
    rarity: 'rare',
    choices: [
      { id: 'A', text: '正面迎战（风险）' },
      { id: 'B', text: '边战边退（平衡）' },
      { id: 'C', text: '隐匿遁走（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.4;
        return {
          s: success,
          msg: success ? '大败仇家，威名远扬！' : '寡不敌众，身受重伤。',
          narrative: '仇家追来，\n你选择正面迎战。',
          outcome: success ? '大败仇家，威名远扬！' : '寡不敌众，身受重伤。',
          flavorText: success ? '一夫当关。' : '双拳难敌四手。',
          impact: EventImpact.from({
            cultivation: success ? 50 : -15,
            body: success ? 0 : -5,
            fortune: success ? 5 : -3,
            buff: success ? {
              name: '大胜余威',
              modifiers: [
                { target: 'attack', value: 0.2 },
                { target: 'cultivationSpeed', value: 0.1 }
              ],
              duration: 150
            } : null
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '边战边退，保全性命。',
          narrative: '仇家追来，\n你边战边退。',
          outcome: '边战边退，虽受轻伤但保全性命。',
          flavorText: '识时务者为俊杰。',
          impact: EventImpact.from({
            cultivation: 5,
            body: -2,
            mind: 2
          })
        };
      }
      return {
        s: true,
        msg: '隐匿遁走，避开锋芒。',
        narrative: '仇家追来，\n你隐匿遁走。',
        outcome: '成功隐匿，避过仇家追捕。',
        flavorText: '退一步海阔天空。',
        impact: EventImpact.from({
          cultivation: 3,
          mind: 2,
          fortune: 3
        })
      };
    }
  }),

  makeEvent({
    id: 'tianjiang_yixiang',
    title: '天降异象',
    narrative: '天空异象纷呈，\n星辰移位，日月同辉。',
    type: 'crisis',
    rarity: 'rare',
    choices: [
      { id: 'A', text: '参悟异象（风险）' },
      { id: 'B', text: '躲避天威（平衡）' },
      { id: 'C', text: '静观其变（静修）' }
    ],
    resolve: (c) => {
      if (c === 'A') {
        const success = Math.random() < 0.45;
        return {
          s: success,
          msg: success ? '参悟天道，顿悟突破！' : '异象太强，心神受损。',
          narrative: '天空异象纷呈，\n你选择参悟。',
          outcome: success ? '参悟天道，顿悟突破！' : '异象太强，心神受损。',
          flavorText: success ? '天人合一。' : '天道难测。',
          impact: EventImpact.from({
            cultivation: success ? 45 : -10,
            insight: success ? 3 : -2,
            mind: success ? 0 : -3,
            breakthrough: success ? 12 : 0
          })
        };
      }
      if (c === 'B') {
        return {
          s: true,
          msg: '躲避天威，安然无恙。',
          narrative: '天空异象纷呈，\n你躲避天威。',
          outcome: '躲避天威，虽未参悟但安然无恙。',
          flavorText: '知进退。',
          impact: EventImpact.from({
            cultivation: 8,
            body: 2
          })
        };
      }
      return {
        s: true,
        msg: '静观其变，略有所得。',
        narrative: '天空异象纷呈，\n你静观其变。',
        outcome: '静观异象，略有所悟。',
        flavorText: '静观自得。',
        impact: EventImpact.from({
          cultivation: 6,
          insight: 1,
          mind: 1
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
            breakthrough: success ? 20 : 0,
            buff: success ? {
              name: '雷劫淬体',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.4 },
                { target: 'bodyGrowth', value: 0.2 }
              ],
              duration: 180
            } : null
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
            breakthrough: success ? 25 : 0,
            buff: success ? {
              name: '天地共鸣',
              modifiers: [
                { target: 'cultivationSpeed', value: 0.6 },
                { target: 'insightGrowth', value: 0.4 }
              ],
              duration: 120
            } : null
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
  constructor(director) {
    this.director = director;
    this.eventInProgress = false;
    this.eventTimer = null;
  }

  getEventChance() {
    let base = State.meditationMode ? 0.95 : 0.92;
    const effects = calculateTechniqueEffects(State.techniques.active);
    if (effects.eventRate < 0) {
      base += effects.eventRate; // 负值降低事件概率
    }
    return base;
  }

  roll() {
    const r = Math.random();
    if (r > this.getEventChance()) {
      this.eventInProgress = true;
      const event = this.director.select(EVENTS, State);
      if (event) this.director.record(State, event);
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
        const event = this.director.select(EVENTS, State);
        if (event) this.director.record(State, event);
        callback(event);
      } else {
        console.log('[EventEngine] skipped, rescheduling');
        this.schedule(callback);
      }
    }, delay);
  }
}
