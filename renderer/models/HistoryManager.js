export class HistoryManager {
  constructor() {
    this.records = [];
  }

  addRecord(record) {
    this.records.unshift(record);
  }

  getRecentRecords(limit = 50) {
    return this.records.slice(0, limit);
  }

  getTotalEvents() {
    return this.records.length;
  }

  getBreakthroughCount() {
    return this.records.filter(
      r => r.realmBefore !== r.realmAfter
    ).length;
  }

  getTechniqueUnlockCount() {
    return this.records.reduce(
      (count, record) => count + record.techniquesUnlocked.length,
      0
    );
  }

  getAllRecords() {
    return this.records;
  }

  clear() {
    this.records = [];
  }
}
