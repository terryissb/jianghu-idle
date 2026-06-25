export class LifeRecord {
  constructor({
    id,
    timestamp,
    title,
    narrative,
    outcome,
    flavorText = '',
    choice,
    result,
    impact = null,
    realmBefore,
    realmAfter,
    techniquesUnlocked = [],
    rarity = 'normal'
  }) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.narrative = narrative;
    this.outcome = outcome;
    this.flavorText = flavorText;
    this.choice = choice;
    this.result = result;
    this.impact = impact;
    this.realmBefore = realmBefore;
    this.realmAfter = realmAfter;
    this.techniquesUnlocked = techniquesUnlocked;
    this.rarity = rarity;
  }

  getFormattedTime() {
    const d = new Date(this.timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  getDayLabel() {
    const now = new Date();
    const d = new Date(this.timestamp);
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff}天前`;
    if (diff < 30) return `${Math.floor(diff / 7)}周前`;
    return `${Math.floor(diff / 30)}月前`;
  }
}
