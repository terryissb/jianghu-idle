export class Technique {
  constructor({
    id,
    name,
    level = 1,
    proficiency = 0,
    type,
    description,
    obtainedFrom,
    obtainedAt
  }) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.proficiency = proficiency;
    this.type = type;
    this.description = description;
    this.obtainedFrom = obtainedFrom;
    this.obtainedAt = obtainedAt;
  }
}
