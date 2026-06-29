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
    this.buff = null;
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
    penalties = [],
    buff = null
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
    impact.buff = buff;
    return impact;
  }

  toDisplay() {
    const items = [];
    if (this.cultivation > 0) items.push(`吸收天地灵气，修为 +${this.cultivation}`);
    if (this.cultivation < 0) items.push(`灵气反噬，修为 ${this.cultivation}`);
    if (this.spirit > 0) items.push(`灵气充盈，灵力 +${this.spirit}`);
    if (this.spirit < 0) items.push(`灵气枯竭，灵力 ${this.spirit}`);
    if (this.body > 0) items.push(`肉身淬炼，肉身 +${this.body}`);
    if (this.body < 0) items.push(`肉身受损，肉身 ${this.body}`);
    if (this.mind > 0) items.push(`道心更加稳固，心境 +${this.mind}`);
    if (this.mind < 0) items.push(`道心动摇，心境 ${this.mind}`);
    if (this.insight > 0) items.push(`感悟加深，悟性 +${this.insight}`);
    if (this.insight < 0) items.push(`灵感消散，悟性 ${this.insight}`);
    if (this.fortune > 0) items.push(`气运提升，福缘 +${this.fortune}`);
    if (this.fortune < 0) items.push(`气运走低，福缘 ${this.fortune}`);
    if (this.breakthrough > 0) items.push(`瓶颈松动，突破感悟 +${this.breakthrough}%`);
    if (this.breakthrough < 0) items.push(`瓶颈更难，突破感悟 ${this.breakthrough}%`);
    if (this.unlocks.length > 0) items.push(`获得：${this.unlocks.join('、')}`);
    if (this.penalties.length > 0) items.push(`失去：${this.penalties.join('、')}`);
    if (this.buff) items.push(`【${this.buff.name}】持续 ${Math.floor(this.buff.duration / 60)} 分钟`);
    return items;
  }
}
