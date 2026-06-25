export class MilestoneRecord {
  constructor({
    id,
    timestamp,
    title,
    description,
    type, // 'first_breakthrough', 'first_technique', 'first_beast', 'major_realm'
    realmName
  }) {
    this.id = id;
    this.timestamp = timestamp;
    this.title = title;
    this.description = description;
    this.type = type;
    this.realmName = realmName;
  }

  getFormattedTime() {
    const d = new Date(this.timestamp);
    return `修炼第${Math.floor((Date.now() - this.timestamp) / (1000 * 60 * 60 * 24)) + 1}天`;
  }
}

export class MilestoneManager {
  constructor() {
    this.milestones = [];
    this._firsts = new Set();
  }

  addMilestone(milestone) {
    this.milestones.unshift(milestone);
  }

  hasFirst(type) {
    return this._firsts.has(type);
  }

  markFirst(type) {
    this._firsts.add(type);
  }

  getMilestones() {
    return this.milestones;
  }

  clear() {
    this.milestones = [];
    this._firsts.clear();
  }
}
