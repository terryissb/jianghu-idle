export class PlayerProfile {
  constructor() {
    this.name = '无名散修';
    this.realm = '炼气期';
    this.cultivation = 0;
    this.attributes = {
      spirit: 10,
      body: 10,
      mind: 10,
      insight: 10
    };
    this.totalCultivationTime = 0;
    this.techniques = [];
  }
}
