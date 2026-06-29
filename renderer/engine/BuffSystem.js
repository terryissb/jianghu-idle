export class BuffSystem {
  /**
   * 添加一个 Buff（v2.4.1 标准格式）
   * buff: {
   *   name: string,
   *   modifiers: [ { target: string, value: number } ],
   *   duration: number (秒)
   * }
   * 兼容旧格式：{ name, type, value, duration }
   */
  static add(player, buff) {
    if (!buff) return;

    player.activeBuffs = player.activeBuffs || [];

    // 标准化 modifiers
    let modifiers = buff.modifiers;
    if (!modifiers && buff.type !== undefined) {
      // 兼容旧格式：{ name, type, value, duration }
      modifiers = [{ target: buff.type, value: buff.value }];
    }
    if (!modifiers || modifiers.length === 0) return;

    player.activeBuffs.push({
      id: buff.name + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: buff.name,
      modifiers: modifiers,
      duration: buff.duration,
      start: Date.now()
    });
  }

  /** 清理过期 Buff */
  static tick(player) {
    if (!player.activeBuffs) return;
    const now = Date.now();
    player.activeBuffs = player.activeBuffs.filter(b => {
      return now - b.start < b.duration * 1000;
    });
  }

  /** 按 target 获取聚合加成值 */
  static getModifier(player, target) {
    if (!player.activeBuffs) return 0;
    let value = 0;
    for (const b of player.activeBuffs) {
      if (!b.modifiers) continue;
      for (const m of b.modifiers) {
        if (m.target === target) value += m.value;
      }
    }
    return value;
  }

  /** 兼容旧接口：按 type 获取 */
  static getMultiplier(player, type) {
    return BuffSystem.getModifier(player, type);
  }

  /** 获取所有 activeBuffs 的汇总说明（用于 UI 显示） */
  static getSummary(player) {
    if (!player.activeBuffs || player.activeBuffs.length === 0) return [];
    const summary = [];
    for (const b of player.activeBuffs) {
      const remaining = Math.ceil((b.start + b.duration * 1000 - Date.now()) / 1000);
      if (remaining <= 0) continue;
      const desc = b.modifiers.map(m => {
        const sign = m.value >= 0 ? '+' : '';
        const pct = Math.round(m.value * 100);
        return `${targetLabel(m.target)} ${sign}${pct}%`;
      }).join(', ');
      summary.push({ name: b.name, desc, remaining, modifiers: b.modifiers });
    }
    return summary;
  }
}

/** 目标属性中文标签 */
function targetLabel(target) {
  const map = {
    cultivationSpeed: '修为获取',
    bodyGrowth: '肉身成长',
    mindGrowth: '心境成长',
    insightGrowth: '悟性成长',
    breakthroughRate: '突破概率',
    eventRate: '事件频率',
    attack: '攻击力',
    defense: '防御力',
    cultivation: '修为',
    body: '肉身',
    mind: '心境',
    insight: '悟性',
    fortune: '福缘',
    spirit: '灵力',
    hp: '气血',
    mp: '内力'
  };
  return map[target] || target;
}
