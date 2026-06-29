import { State } from './State.js';

/**
 * LifeEngine.js — v2.5 人生引擎
 * 负责修仙人生记录、重要事件、时间线、命运、称号
 * 不是日志，而是修仙人生小说
 */

export class LifeEngine {
  constructor() {
    this.entries = [];
    this.milestones = [];
    this.titles = [];        // 称号列表
    this.destiny = 0;        // 命运值（影响奇遇概率）
    this.totalPlayTime = 0;  // 总游戏时间（秒）
  }

  /** 记录一次人生事件 */
  record(entry) {
    this.entries.unshift({
      id: entry.id || crypto.randomUUID(),
      timestamp: Date.now(),
      day: this.getDayNumber(),
      title: entry.title,
      narrative: entry.narrative || '',
      outcome: entry.outcome || '',
      flavorText: entry.flavorText || '',
      result: entry.result || 'neutral',
      impact: entry.impact || null,
      realmBefore: entry.realmBefore || '',
      realmAfter: entry.realmAfter || '',
      rarity: entry.rarity || 'normal',
      significance: entry.significance || 1  // 重要度 1-10
    });

    // 只保留最近 100 条
    if (this.entries.length > 100) {
      this.entries = this.entries.slice(0, 100);
    }

    // 检查里程碑
    this.checkMilestones(entry);
  }

  /** 记录里程碑 */
  recordMilestone(milestone) {
    this.milestones.push({
      id: milestone.id || crypto.randomUUID(),
      timestamp: Date.now(),
      title: milestone.title,
      description: milestone.description,
      type: milestone.type || 'milestone',
      realmName: milestone.realmName || ''
    });
  }

  /** 获取人生时间线（按修仙日分组） */
  getTimeline() {
    const groups = {};
    this.entries.forEach(e => {
      const day = `修仙第${e.day}日`;
      if (!groups[day]) groups[day] = [];
      groups[day].push(e);
    });
    return groups;
  }

  /** 获取修仙日数 */
  getDayNumber() {
    return Math.floor(this.totalPlayTime / 3600) + 1;
  }

  /** 获取人生总评价 */
  getLifeSummary() {
    const totalEvents = this.entries.length;
    const breakthroughs = this.milestones.filter(m => m.type === 'breakthrough').length;
    const techniques = this.milestones.filter(m => m.type === 'technique').length;
    const titles = this.titles.length;

    return {
      totalEvents,
      breakthroughs,
      techniques,
      titles,
      destiny: this.destiny,
      playDays: this.getDayNumber()
    };
  }

  /** 获取称号列表 */
  getTitles() {
    return this.titles;
  }

  /** 检查并授予称号 */
  checkTitles() {
    const newTitles = [];

    // 初出茅庐
    if (this.entries.length >= 5 && !this.hasTitle('novice')) {
      newTitles.push({ id: 'novice', name: '初出茅庐', desc: '经历5次事件' });
    }

    // 小有名气
    if (this.entries.length >= 20 && !this.hasTitle('known')) {
      newTitles.push({ id: 'known', name: '小有名气', desc: '经历20次事件' });
    }

    // 命途多舛
    const crisisCount = this.entries.filter(e => e.rarity === 'crisis').length;
    if (crisisCount >= 5 && !this.hasTitle('crisis_master')) {
      newTitles.push({ id: 'crisis_master', name: '命途多舛', desc: '经历5次危机' });
    }

    // 仙缘深厚
    const qiCount = this.entries.filter(e => e.type === 'qi').length;
    if (qiCount >= 5 && !this.hasTitle('blessed')) {
      newTitles.push({ id: 'blessed', name: '仙缘深厚', desc: '经历5次奇遇' });
    }

    newTitles.forEach(t => this.titles.push(t));
    return newTitles;
  }

  hasTitle(id) {
    return this.titles.some(t => t.id === id);
  }

  /** 检查里程碑触发 */
  checkMilestones(entry) {
    if (entry.result === 'success' && entry.realmBefore !== entry.realmAfter) {
      this.recordMilestone({
        title: '境界突破',
        description: `突破至「${entry.realmAfter}」`,
        type: 'breakthrough',
        realmName: entry.realmAfter
      });
      this.destiny += 5;
    }

    if (entry.technique) {
      this.recordMilestone({
        title: '习得功法',
        description: '获得新的功法传承',
        type: 'technique'
      });
    }
  }

  /** 清空 */
  clear() {
    this.entries = [];
    this.milestones = [];
    this.titles = [];
    this.destiny = 0;
    this.totalPlayTime = 0;
  }

  /** 序列化 */
  serialize() {
    return {
      entries: this.entries.slice(0, 50),
      milestones: this.milestones,
      titles: this.titles,
      destiny: this.destiny,
      totalPlayTime: this.totalPlayTime
    };
  }

  /** 反序列化 */
  deserialize(data) {
    if (!data) return;
    this.entries = data.entries || [];
    this.milestones = data.milestones || [];
    this.titles = data.titles || [];
    this.destiny = data.destiny || 0;
    this.totalPlayTime = data.totalPlayTime || 0;
  }
}

export const lifeEngine = new LifeEngine();
