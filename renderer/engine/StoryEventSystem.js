import { EventImpact } from '../models/Impact.js';

/** 事件链定义（v2.4.1） */
export const STORY_CHAINS = {
  mysterious_cave: {
    chainId: 'mysterious_cave',
    name: '神秘洞穴',
    stages: [
      {
        id: 'mysterious_cave_1',
        chainId: 'mysterious_cave',
        stage: 1,
        title: '山中异响',
        narrative: '修炼时，远处山洞传来阵阵低语，\n似有人声，又似风声。',
        type: 'story_event',
        rarity: 'rare',
        choices: [
          { id: 'A', text: '进入探查' },
          { id: 'B', text: '继续修炼' }
        ],
        resolve: (c) => {
          if (c === 'A') {
            return {
              s: true,
              msg: '你决定进入洞穴探查...',
              narrative: '修炼时听见异响，\n你选择进入探查。',
              outcome: '洞穴幽深，灵气浓郁。',
              flavorText: '好奇之心，\n也是修行之道。',
              impact: EventImpact.from({
                cultivation: 8,
                insight: 1
              }),
              nextStage: 'mysterious_cave_2'
            };
          }
          return {
            s: true,
            msg: '低语渐消，你继续修炼。',
            narrative: '你选择了继续修炼，\n低语渐渐消失。',
            outcome: '低语消失，仿佛从未存在。',
            flavorText: '有时候，\n不知道也是一种福分。',
            impact: EventImpact.from({
              cultivation: 3,
              mind: 1
            }),
            endChain: true
          };
        }
      },
      {
        id: 'mysterious_cave_2',
        chainId: 'mysterious_cave',
        stage: 2,
        title: '洞中秘境',
        narrative: '洞穴深处，一处石室散发幽光，\n中央矗立着一块刻满符文的石碑。',
        type: 'story_event',
        rarity: 'rare',
        choices: [
          { id: 'A', text: '触碰石碑' },
          { id: 'B', text: '谨慎观察' }
        ],
        resolve: (c) => {
          if (c === 'A') {
            const success = Math.random() < 0.6;
            return {
              s: success,
              msg: success ? '石碑中涌出灵气，传承开启！' : '石碑释放禁制，你被震退。',
              narrative: success ? '你触碰石碑，\n灵气如潮水般涌入。' : '你触碰石碑，\n一道禁制将你震退。',
              outcome: success ? '传承之门开启。' : '禁制强大，难以破解。',
              flavorText: success ? '机缘所至，\n不可强求。' : '实力不足，\n强行触碰只会受伤。',
              impact: EventImpact.from({
                cultivation: success ? 20 : -10,
                body: success ? 0 : -2,
                insight: success ? 2 : 0
              }),
              nextStage: success ? 'mysterious_cave_3' : 'mysterious_cave_2_retry'
            };
          }
          return {
            s: true,
            msg: '你仔细观察，发现石碑端倪。',
            narrative: '你谨慎观察，\n发现石碑符文有规律。',
            outcome: '发现石碑规律，灵气运行更顺畅。',
            flavorText: '谨慎观察，\n也是修行的一部分。',
            impact: EventImpact.from({
              cultivation: 10,
              insight: 2
            }),
            nextStage: 'mysterious_cave_3_safe'
          };
        }
      },
      {
        id: 'mysterious_cave_2_retry',
        chainId: 'mysterious_cave',
        stage: 2,
        title: '再探石碑',
        narrative: '你被震退后，\n决定再次尝试。',
        type: 'story_event',
        rarity: 'rare',
        choices: [
          { id: 'A', text: '以灵气试探' },
          { id: 'B', text: '离开洞穴' }
        ],
        resolve: (c) => {
          if (c === 'A') {
            return {
              s: true,
              msg: '灵气与石碑共鸣，禁制消散！',
              narrative: '你以灵气试探，\n石碑禁制消散。',
              outcome: '禁制消散，传承之门开启。',
              flavorText: '以柔克刚，\n方为大道。',
              impact: EventImpact.from({
                cultivation: 15,
                insight: 1
              }),
              nextStage: 'mysterious_cave_3'
            };
          }
          return {
            s: true,
            msg: '你离开洞穴，修行为重。',
            narrative: '你选择离开洞穴，\n继续修行。',
            outcome: '虽无所得，但保全了自身。',
            flavorText: '留得青山在，\n不怕没柴烧。',
            impact: EventImpact.from({
              cultivation: 5,
              mind: 2
            }),
            endChain: true
          };
        }
      },
      {
        id: 'mysterious_cave_3',
        chainId: 'mysterious_cave',
        stage: 3,
        title: '传承现世',
        narrative: '石碑裂开，一道虚影浮现——\n是一位古修留下的传承意志。',
        type: 'story_event',
        rarity: 'rare',
        choices: [
          { id: 'A', text: '接受传承' },
          { id: 'B', text: '只取宝物' }
        ],
        resolve: (c) => {
          if (c === 'A') {
            return {
              s: true,
              msg: '传承入体，修为大进！',
              narrative: '你接受传承，\n古修意志融入体内。',
              outcome: '获得古修传承，修为突飞猛进。',
              flavorText: '前人栽树，\n后人乘凉。',
              impact: EventImpact.from({
                cultivation: 80,
                insight: 5,
                mind: 3,
                buff: {
                  name: '古修传承',
                  modifiers: [
                    { target: 'cultivationSpeed', value: 0.3 },
                    { target: 'insightGrowth', value: 0.2 }
                  ],
                  duration: 300
                }
              }),
              endChain: true
            };
          }
          return {
            s: true,
            msg: '你取走宝物，传承消散。',
            narrative: '你只取走宝物，\n传承意志消散。',
            outcome: '获得宝物，但错失传承。',
            flavorText: '舍本逐末，\n也是一种选择。',
            impact: EventImpact.from({
              cultivation: 30,
              fortune: 10,
              buff: {
                name: '宝物加持',
                modifiers: [
                  { target: 'cultivationSpeed', value: 0.15 }
                ],
                duration: 180
              }
            }),
            endChain: true
          };
        }
      },
      {
        id: 'mysterious_cave_3_safe',
        chainId: 'mysterious_cave',
        stage: 3,
        title: '安然所得',
        narrative: '你以观察所得的规律，\n安全地激活了石碑。',
        type: 'story_event',
        rarity: 'rare',
        choices: [
          { id: 'A', text: '静心领悟' }
        ],
        resolve: (c) => {
          return {
            s: true,
            msg: '领悟石碑真意，修为大增。',
            narrative: '你静心领悟石碑，\n获得古修部分传承。',
            outcome: '获得部分传承，根基稳固。',
            flavorText: '稳扎稳打，\n也是一种大道。',
            impact: EventImpact.from({
              cultivation: 50,
              insight: 3,
              mind: 2,
              buff: {
                name: '石碑真意',
                modifiers: [
                  { target: 'cultivationSpeed', value: 0.2 },
                  { target: 'mindGrowth', value: 0.1 }
                ],
                duration: 240
              }
            }),
            endChain: true
          };
        }
      }
    ]
  }
};

/** 事件链系统 */
export class StoryEventSystem {
  constructor() {
    this.activeChainId = null;   // 当前进行中的事件链ID
    this.currentStageIndex = 0;  // 当前阶段索引
  }

  /** 检查是否可以触发新的事件链 */
  canTrigger() {
    return this.activeChainId === null;
  }

  /** 尝试触发事件链（3%概率） */
  tryTrigger() {
    if (!this.canTrigger()) return null;
    if (Math.random() > 0.03) return null; // 3%概率

    const chains = Object.values(STORY_CHAINS);
    const chain = chains[Math.floor(Math.random() * chains.length)];
    this.activeChainId = chain.chainId;
    this.currentStageIndex = 0;
    console.log('[STORY] 触发事件链:', chain.name);
    return chain.stages[0];
  }

  /** 获取当前阶段 */
  getCurrentStage() {
    if (!this.activeChainId) return null;
    const chain = STORY_CHAINS[this.activeChainId];
    if (!chain) return null;
    return chain.stages[this.currentStageIndex];
  }

  /** 推进事件链到指定阶段 */
  advance(nextStageId) {
    if (!this.activeChainId) return null;
    const chain = STORY_CHAINS[this.activeChainId];
    if (!chain) return null;
    const nextStage = chain.stages.find(s => s.id === nextStageId);
    if (nextStage) {
      this.currentStageIndex = chain.stages.indexOf(nextStage);
      console.log('[STORY] 推进到阶段', nextStage.stage, ':', nextStage.title);
      return nextStage;
    }
    // 找不到阶段则结束链
    console.log('[STORY] 阶段未找到，结束链');
    this.end();
    return null;
  }

  /** 结束当前事件链 */
  end() {
    if (this.activeChainId) {
      console.log('[STORY] 结束事件链:', this.activeChainId);
    }
    this.activeChainId = null;
    this.currentStageIndex = 0;
  }

  /** 重置 */
  reset() {
    this.activeChainId = null;
    this.currentStageIndex = 0;
  }
}
