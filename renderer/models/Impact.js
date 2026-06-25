export class EventImpact {
  constructor() {
    this.cultivation = 0;
    this.spirit = 0;
    this.body = 0;
    this.mind = 0;
    this.insight = 0;
    this.fortune = 0;
    this.breakthrough = 0;
    this.techniqueExp = [];
    this.unlocks = [];
    this.penalties = [];
  }

  static from({
    cultivation = 0,
    spirit = 0,
    body = 0,
    mind = 0,
    insight = 0,
    fortune = 0,
    breakthrough = 0,
    techniqueExp = [],
    unlocks = [],
    penalties = []
  }) {
    const impact = new EventImpact();
    impact.cultivation = cultivation;
    impact.spirit = spirit;
    impact.body = body;
    impact.mind = mind;
    impact.insight = insight;
    impact.fortune = fortune;
    impact.breakthrough = breakthrough;
    impact.techniqueExp = techniqueExp;
    impact.unlocks = unlocks;
    impact.penalties = penalties;
    return impact;
  }

  toDisplay() {
    const items = [];
    if (this.cultivation > 0) items.push(`修为 +${this.cultivation}`);
    if (this.cultivation < 0) items.push(`修为 ${this.cultivation}`);
    if (this.spirit > 0) items.push(`灵力 +${this.spirit}`);
    if (this.spirit < 0) items.push(`灵力 ${this.spirit}`);
    if (this.body > 0) items.push(`肉身 +${this.body}`);
    if (this.body < 0) items.push(`肉身 ${this.body}`);
    if (this.mind > 0) items.push(`心境 +${this.mind}`);
    if (this.mind < 0) items.push(`心境 ${this.mind}`);
    if (this.insight > 0) items.push(`悟性 +${this.insight}`);
    if (this.insight < 0) items.push(`悟性 ${this.insight}`);
    if (this.fortune > 0) items.push(`福缘 +${this.fortune}`);
    if (this.fortune < 0) items.push(`福缘 ${this.fortune}`);
    if (this.breakthrough > 0) items.push(`突破感悟 +${this.breakthrough}%`);
    if (this.breakthrough < 0) items.push(`突破感悟 ${this.breakthrough}%`);
    if (this.unlocks.length > 0) items.push(`获得：${this.unlocks.join('、')}`);
    if (this.penalties.length > 0) items.push(`失去：${this.penalties.join('、')}`);
    return items;
  }
}

export class ImpactEngine {
  static apply(state, impact) {
    if (impact.cultivation) state.exp += impact.cultivation;
    if (impact.spirit) state.mp = Math.min(state.maxMp + impact.spirit, state.mp + impact.spirit);
    if (impact.body) state.hp = Math.min(state.maxHp + impact.body, state.hp + impact.body);
    if (impact.mind) {
      const mindMap = { stable: 35, turbulent: 20, enlightenment: 50, demon: 5 };
      // 简单模拟：mind 正向变化保持心境稳定
      if (impact.mind > 0 && state.mindState === 'demon') state.mindState = 'stable';
      if (impact.mind < 0 && state.mindState === 'stable') state.mindState = 'turbulent';
      if (impact.mind < -2 && state.mindState === 'turbulent') state.mindState = 'demon';
    }
    if (impact.insight) state.luck += impact.insight;
    if (impact.fortune) state.luck += impact.fortune;
    if (impact.breakthrough) {
      // 突破感悟加到 exp 上，作为额外修为
      state.exp += impact.breakthrough * 0.5;
    }
  }
}
