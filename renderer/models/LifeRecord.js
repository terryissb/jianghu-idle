export class LifeRecord {
  constructor({
    id,
    timestamp,
    title,
    narrative,
    outcome,
    choice,
    result,
    rewards = {},
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
    this.choice = choice;
    this.result = result;
    this.rewards = rewards;
    this.realmBefore = realmBefore;
    this.realmAfter = realmAfter;
    this.techniquesUnlocked = techniquesUnlocked;
    this.rarity = rarity;
  }

  getFormattedTime() {
    const d = new Date(this.timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}
