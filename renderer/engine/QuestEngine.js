import { State } from './State.js';

/**
 * QuestEngine.js — v2.5 任务/事件链引擎
 * 负责所有长期目标、事件链、奇遇、连续剧情
 */

export class QuestEngine {
  constructor() {
    this.activeChains = new Map(); // chainId -> chainState
    this.completedChains = [];
    this.availableQuests = [];
  }

  /** 加载事件链数据 */
  async loadChains() {
    try {
      const res = await fetch('./data/chains/mysterious_cave.json');
      if (res.ok) {
        const data = await res.json();
        this.registerChain(data);
      }
    } catch (e) {
      console.warn('[QuestEngine] no chains loaded', e);
    }
  }

  /** 注册事件链 */
  registerChain(chainData) {
    if (!chainData || !chainData.chainId) return;
    this.availableQuests.push(chainData);
  }

  /** 检查是否可以开始新的事件链 */
  canStartChain() {
    return this.activeChains.size === 0;
  }

  /** 尝试触发事件链 (3%概率) */
  tryTrigger() {
    if (!this.canStartChain()) return null;
    if (Math.random() > 0.03) return null;

    const available = this.availableQuests.filter(q => !this.completedChains.includes(q.chainId));
    if (available.length === 0) return null;

    const chain = available[Math.floor(Math.random() * available.length)];
    const firstStage = chain.stages[0];

    this.activeChains.set(chain.chainId, {
      chainId: chain.chainId,
      currentStageIndex: 0,
      startedAt: Date.now()
    });

    console.log('[QuestEngine] chain started:', chain.chainId);
    return this.hydrateStage(firstStage, chain.chainId, 1);
  }

  /** 推进事件链 */
  advance(chainId, nextStageId) {
    const state = this.activeChains.get(chainId);
    if (!state) return null;

    const chain = this.availableQuests.find(q => q.chainId === chainId);
    if (!chain) return null;

    const nextStage = chain.stages.find(s => s.id === nextStageId);
    if (!nextStage) {
      // 找不到阶段，结束链
      this.completeChain(chainId);
      return null;
    }

    state.currentStageIndex = chain.stages.indexOf(nextStage);
    console.log('[QuestEngine] advanced to stage', nextStage.stage, ':', nextStage.title);
    return this.hydrateStage(nextStage, chainId, nextStage.stage);
  }

  /** 结束事件链 */
  completeChain(chainId) {
    this.activeChains.delete(chainId);
    if (!this.completedChains.includes(chainId)) {
      this.completedChains.push(chainId);
    }
    console.log('[QuestEngine] chain completed:', chainId);
  }

  /** 重置 */
  reset() {
    this.activeChains.clear();
    this.completedChains = [];
  }

  /** 将 JSON stage 转换为可执行事件 */
  hydrateStage(stage, chainId, stageNum) {
    return {
      id: stage.id,
      chainId: chainId,
      stage: stageNum,
      title: stage.title,
      narrative: stage.narrative,
      type: 'story_event',
      rarity: stage.rarity || 'rare',
      choices: stage.choices,
      resolve: (choiceId) => this.resolveStage(stage, choiceId)
    };
  }

  resolveStage(stage, choiceId) {
    const outcome = stage.outcomes[choiceId];
    if (!outcome) return { s: true, msg: '继续探索...' };

    return {
      s: outcome.success !== false,
      msg: outcome.msg || '事件继续',
      narrative: outcome.narrative || stage.narrative,
      outcome: outcome.outcome || outcome.msg,
      flavorText: outcome.flavorText || '',
      impact: outcome.impact || {},
      buff: outcome.buff || null,
      nextStage: outcome.nextStage || null,
      endChain: outcome.endChain || false
    };
  }

  /** 获取进行中的事件链信息 */
  getActiveChainInfo() {
    const info = [];
    for (const [chainId, state] of this.activeChains) {
      const chain = this.availableQuests.find(q => q.chainId === chainId);
      if (chain) {
        info.push({
          chainId,
          name: chain.name,
          currentStage: state.currentStageIndex + 1,
          totalStages: chain.stages.length
        });
      }
    }
    return info;
  }
}

export const questEngine = new QuestEngine();
