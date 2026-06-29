import { State, ROOTS } from '../engine/State.js';

/**
 * EventLoader.js — v2.5 数据驱动事件加载器
 * 从 JSON 文件加载事件数据，替代硬编码
 */

class EventLoader {
  constructor() {
    this.events = [];
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this.events;

    const eventIds = [
      'lingqi', 'xinmo', 'dunwu', 'xianren',
      'moxiu', 'gongfa_canjuan', 'caiyao_dan',
      'fangshi_jiaoyi', 'daoyou_lundao', 'biguan_kuxiu',
      'guxiu_yifu', 'lingshou_chumo', 'lingmai_yidong',
      'zouhuo_rumo', 'choujia_zhuishang', 'tianjiang_yixiang'
    ];

    const promises = eventIds.map(async (id) => {
      try {
        const res = await fetch(`./data/events/${id}.json`);
        if (!res.ok) throw new Error(`Failed to load ${id}`);
        const data = await res.json();
        return this.hydrate(data);
      } catch (e) {
        console.warn('[EventLoader] failed to load', id, e);
        return null;
      }
    });

    const results = await Promise.all(promises);
    this.events = results.filter(Boolean);
    this.loaded = true;
    console.log('[EventLoader] loaded', this.events.length, 'events');
    return this.events;
  }

  /** 将 JSON 数据转换为可执行的事件对象 */
  hydrate(data) {
    return {
      id: data.id,
      title: data.title,
      narrative: data.narrative,
      type: data.type,
      rarity: data.rarity,
      choices: data.choices,
      resolve: (choiceId) => this.resolve(data, choiceId)
    };
  }

  /** 根据数据和选择执行结果 */
  resolve(data, choiceId) {
    const outcome = data.outcomes[choiceId];
    if (!outcome) return { s: true, msg: '无事发生' };

    // 简单结果（无成功率）
    if (outcome.msg && !outcome.successRate) {
      return {
        s: true,
        msg: outcome.msg,
        narrative: outcome.narrative || data.narrative,
        outcome: outcome.outcome || outcome.msg,
        flavorText: outcome.flavorText || '',
        impact: outcome.impact || {},
        buff: outcome.buff || null,
        technique: outcome.technique || false,
        nextStage: outcome.nextStage || null,
        endChain: outcome.endChain || false
      };
    }

    // 有成功率的结果
    const success = Math.random() < (outcome.successRate || 1);
    const branch = success ? outcome.success : outcome.fail;

    return {
      s: success,
      msg: branch.msg,
      narrative: branch.narrative || data.narrative,
      outcome: branch.outcome || branch.msg,
      flavorText: branch.flavorText || '',
      impact: branch.impact || {},
      buff: branch.buff || null,
      technique: branch.technique || false,
      nextStage: branch.nextStage || null,
      endChain: branch.endChain || false
    };
  }
}

export const eventLoader = new EventLoader();
