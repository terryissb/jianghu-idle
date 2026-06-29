/**
 * StoryDirector.js — v2.5 轻量版事件导演
 * 不改变 EventEngine 逻辑，只加一层事件筛选层
 * 通过评分 + 权重 + 状态感知 + 冷却机制，使事件生成具有节奏感
 */
export class StoryDirector {
  constructor() {
    // 类型冷却：同一类型事件在短时间内权重降低
    this.typeCooldown = new Map();
    // 最小冷却间隔（毫秒）
    this.cooldownMs = 8000;
  }

  /** 主入口：从事件池中筛选 */
  select(events, player) {
    if (!events || events.length === 0) return null;

    const scored = events.map(e => ({
      event: e,
      score: this.score(e, player)
    }));

    // 按分数降序排列
    scored.sort((a, b) => b.score - a.score);

    // 取前 30%（至少 3 个）+ 加权随机
    const topCount = Math.max(3, Math.floor(scored.length * 0.3));
    const top = scored.slice(0, topCount);

    return this.weightedRandom(top);
  }

  /** 事件评分（核心逻辑） */
  score(event, player) {
    let score = 1; // 基础分

    // ===== 稀有度加权 =====
    if (event.rarity === 'rare') score += 2;
    if (event.rarity === 'uncommon') score += 1;

    // ===== 状态驱动（玩家状态影响事件倾向） =====
    // 心境低时更容易触发危机（心魔、魔修等）
    if (event.type === 'crisis' && player.mind < 0) score += 3;
    // 福缘高时奇遇更容易出现
    if (event.type === 'qi' && player.fortune > 10) score += 2;
    // 静修时日常事件更频繁
    if (event.type === 'daily' && !player.meditationMode) score += 1.5;
    if (event.type === 'daily' && player.meditationMode) score += 0.5;
    // 突破感悟高时境界事件更可能出现
    if (event.type === 'realm_event' && player.breakthrough > 60) score += 4;

    // ===== 时间驱动（修炼时长影响事件） =====
    if (player.totalTime) {
      // 修炼超过30秒后，顿悟更容易出现
      if (event.id === 'dunwu' && player.totalTime > 30) score += 2;
      // 修炼超过60秒后，心魔更容易出现
      if (event.id === 'xinmo' && player.totalTime > 60) score += 1.5;
    }

    // ===== 防重复机制（冷却惩罚） =====
    const now = Date.now();
    const mem = player.eventMemory;
    if (mem && now - mem.lastEventTime < this.cooldownMs) {
      if (event.type === mem.lastType) score -= 3; // 同类型冷却
      if (event.id === mem.lastId) score -= 5;      // 同事件冷却
    }

    // ===== 类型权重基础值 =====
    const typeBase = { daily: 3, qi: 2, crisis: 1.5, realm_event: 1, story_event: 2.5 };
    score += typeBase[event.type] || 1;

    return Math.max(0.1, score); // 确保分数为正
  }

  /** 加权随机 */
  weightedRandom(list) {
    let total = 0;
    for (const item of list) total += item.score;
    let r = Math.random() * total;
    for (const item of list) {
      r -= item.score;
      if (r <= 0) return item.event;
    }
    return list[0].event;
  }

  /** 记录事件历史 */
  record(player, event) {
    if (!player) return;
    player.eventMemory = {
      lastType: event.type,
      lastId: event.id,
      lastEventTime: Date.now()
    };
  }
}
