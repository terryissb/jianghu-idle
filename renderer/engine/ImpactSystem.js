import { addExpToType, addExpToTechnique } from './TechniqueSystem.js';

function applyDelta(target, key, value) {
  if (typeof value !== 'number') return;
  if (target[key] === undefined) target[key] = 0;
  target[key] += value;
}

export class ImpactSystem {
  static apply(player, impact) {
    if (!impact) return;

    // 修为
    if (impact.cultivation !== undefined) {
      player.exp += impact.cultivation;
      // 功法经验分配：修行功法获得修为的10%
      if (impact.cultivation > 0) {
        addExpToType(player, 'cultivation', impact.cultivation * 0.1);
      }
    }

    // 属性
    if (impact.mind !== undefined) {
      applyDelta(player, 'mind', impact.mind);
      // 心法获得心境收益的5%
      if (impact.mind > 0) {
        addExpToType(player, 'mind', impact.mind * 0.05);
      }
    }
    if (impact.body !== undefined) {
      applyDelta(player, 'body', impact.body);
      // 炼体功法获得肉身收益的8%
      if (impact.body > 0) {
        addExpToType(player, 'body', impact.body * 0.08);
      }
    }
    if (impact.insight !== undefined) {
      applyDelta(player, 'insight', impact.insight);
      // 心法/神通获得悟性收益的5%
      if (impact.insight > 0) {
        addExpToType(player, 'mind', impact.insight * 0.05);
      }
    }
    if (impact.fortune !== undefined) {
      applyDelta(player, 'fortune', impact.fortune);
    }

    // 灵力
    if (impact.spirit !== undefined) {
      applyDelta(player, 'spirit', impact.spirit);
    }

    // 境界进度
    if (impact.breakthrough !== undefined) {
      applyDelta(player, 'breakthrough', impact.breakthrough);
    }

    // 功法/技能经验直接分配
    if (impact.techniqueExp) {
      for (const entry of impact.techniqueExp) {
        // entry: { id, exp } 或 { type, exp }
        if (entry.id) {
          addExpToTechnique(entry.id, entry.exp);
        } else if (entry.type) {
          addExpToType(player, entry.type, entry.exp);
        }
      }
    }
  }
}
