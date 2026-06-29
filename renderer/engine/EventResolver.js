import { ImpactSystem } from './ImpactSystem.js';
import { BuffSystem } from './BuffSystem.js';

export class EventResolver {
  static resolve(player, event, choice) {
    const result = event.resolve(choice);

    // 1. 应用数值
    ImpactSystem.apply(player, result.impact);

    // 2. Buff 进入系统
    if (result.impact?.buff) {
      BuffSystem.add(player, result.impact.buff);
    }

    return result;
  }
}
