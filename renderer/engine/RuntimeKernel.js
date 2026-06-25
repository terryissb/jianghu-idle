import { State, REALMS, ROOTS, MINDS, ELEMENTS, loadState, saveState, formatTime } from './State.js';
import { EventEngine, EVENTS } from './EventEngine.js';
import { UIManager } from '../ui/UIManager.js';
import { InteractionManager } from '../interaction/InteractionManager.js';
import { LifeRecord } from '../models/LifeRecord.js';
import { HistoryManager } from '../models/HistoryManager.js';
import { MilestoneRecord, MilestoneManager } from '../models/MilestoneRecord.js';
import { calculateTechniqueEffects, learnTechnique, activateTechnique, TECHNIQUES } from './TechniqueSystem.js';

export class RuntimeKernel {
  constructor() {
    this.ui = null;
    this.eventEngine = null;
    this.interaction = null;
    this.historyManager = new HistoryManager();
    this.milestoneManager = new MilestoneManager();
    this.timer = null;
    this.eventTimer = null;
    this.tickCount = 0;
    this.meditationTicks = 0;
  }

  init() {
    console.log('[KERNEL] init');

    this.ui = new UIManager(this);
    this.ui.mount();
    console.log('[UI] mounted');

    this.eventEngine = new EventEngine();
    console.log('[ENGINE] created');

    this.interaction = new InteractionManager(this);
    this.interaction.bind();
    console.log('[INTERACTION] bound');

    const offline = loadState();
    this.ui.updateStats();

    if (offline) {
      this.ui.showSystemBubble('离线挂机', `离线 ${formatTime(offline.offline)}，修为 +${offline.gain}`);
    }

    window.__KERNEL__ = this;
    window.kernel = this;

    console.log('[KERNEL] init complete');
  }

  start() {
    console.log('[KERNEL] start');
    this.scheduleEvent();

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);

    console.log('[KERNEL] running');
  }

  tick() {
    const effects = calculateTechniqueEffects(State.techniques.active);
    const growth = ROOTS[State.spiritualRoot].growth * (1 + effects.cultivationSpeed);
    const bonus = State.mindState === 'enlightenment' ? 1.2 : State.mindState === 'demon' ? 0.7 : 1;
    const meditationBonus = State.meditationMode ? 1.5 : 1;

    State.exp += 0.5 * growth * bonus * meditationBonus;
    State.hp = Math.min(State.maxHp, State.hp + 0.1 * (1 + effects.bodyGrowth));
    State.totalTime++;

    if (State.meditationMode) {
      this.meditationTicks++;
    }

    this.checkBreakthrough();
    saveState();
    this.ui.updateStats();

    this.tickCount++;
    const checkInterval = State.meditationMode ? 15 : Math.floor(Math.random() * 10) + 5;
    if (this.tickCount >= checkInterval) {
      this.tickCount = 0;
      console.log('[KERNEL] event check');
      if (!State.meditationMode) {
        const event = this.eventEngine.roll();
        if (event) {
          this.ui.showEvent(event);
        }
      }
    }
  }

  checkBreakthrough() {
    const realm = REALMS[State.realm];
    if (State.exp >= realm.expNeed) {
      const effects = calculateTechniqueEffects(State.techniques.active);
      const rate = 0.5 + (ROOTS[State.spiritualRoot].growth - 1) * 0.2 + State.luck * 0.001 + effects.breakthroughRate;
      const realmBefore = REALMS[State.realm].name;
      if (Math.random() < rate) {
        State.exp -= realm.expNeed;
        State.realm++;
        State.maxHp += 50 * (State.realm + 1);
        State.maxMp += 30 * (State.realm + 1);
        State.hp = State.maxHp;
        const realmAfter = REALMS[State.realm].name;

        const record = new LifeRecord({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          title: '境界突破',
          narrative: '冲击瓶颈，修为水到渠成。\n灵气汇聚，道基初凝。',
          outcome: `突破至「${realmAfter}」！`,
          flavorText: '每一次突破，\n都是逆天而行。',
          result: 'success',
          realmBefore,
          realmAfter,
          rarity: 'rare'
        });
        this.historyManager.addRecord(record);

        // 里程碑
        if (!this.milestoneManager.hasFirst('first_breakthrough')) {
          this.milestoneManager.markFirst('first_breakthrough');
          const ms = new MilestoneRecord({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            title: '首次突破',
            description: `首次突破至「${realmAfter}」`,
            type: 'first_breakthrough',
            realmName: realmAfter
          });
          this.milestoneManager.addMilestone(ms);
        }
        if (State.realm >= 3 && !this.milestoneManager.hasFirst('major_realm')) {
          this.milestoneManager.markFirst('major_realm');
          const ms = new MilestoneRecord({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            title: '踏入金丹',
            description: '正式踏入金丹大道',
            type: 'major_realm',
            realmName: realmAfter
          });
          this.milestoneManager.addMilestone(ms);
        }

        this.ui.showSystemBubble('境界突破', `突破至「${realmAfter}」！`);
        this.ui.updateStats();
        setTimeout(() => {
          const event = this.eventEngine.rollRealmEvent();
          this.ui.showEvent(event);
        }, 2000);
      } else {
        State.exp = Math.floor(State.exp * 0.5);
        const record = new LifeRecord({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          title: '突破失败',
          narrative: '冲击瓶颈，未能成功。\n灵气溃散，修为折损。',
          outcome: '冲击瓶颈失败，修为受损。',
          flavorText: '大道修行，\n从来不是一帆风顺。',
          result: 'fail',
          realmBefore,
          realmAfter: realmBefore,
          rarity: 'normal'
        });
        this.historyManager.addRecord(record);

        this.ui.showSystemBubble('突破失败', '冲击瓶颈失败，修为受损。');
        this.ui.updateStats();
      }
    }
  }

  handleChoice(event, choiceId) {
    console.log('[KERNEL] choice:', choiceId);
    const res = event.resolve(choiceId);
    if (res.exp) State.exp += res.exp;
    if (res.luck) State.luck += res.luck;

    const realmBefore = REALMS[State.realm].name;
    this.checkBreakthrough();
    const realmAfter = REALMS[State.realm].name;
    saveState();

    const record = new LifeRecord({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      title: event.title,
      narrative: res.narrative || event.narrative,
      outcome: res.outcome || res.msg,
      flavorText: res.flavorText || '',
      choice: choiceId,
      result: res.s ? 'success' : 'fail',
      rewards: res.rewards || { exp: res.exp, luck: res.luck },
      realmBefore,
      realmAfter,
      rarity: event.rarity || 'normal'
    });
    this.historyManager.addRecord(record);

    this.ui.showResult(res);
    this.eventEngine.reset();

    setTimeout(() => {
      this.ui.hideEvent();
      this.scheduleEvent();
    }, 4000);
  }

  handlePetClick() {
    console.log('[KERNEL] pet click');
    this.ui.showHistoryPanel();
  }

  toggleMeditation() {
    State.meditationMode = !State.meditationMode;
    if (State.meditationMode) {
      this.meditationTicks = 0;
      this.ui.setState('入定静修');
      console.log('[KERNEL] meditation ON');
    } else {
      if (this.meditationTicks > 0) {
        const record = new LifeRecord({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          title: '静修',
          narrative: '入定静修，心神合一。\n远离纷扰，专注修行。',
          outcome: `静修 ${this.meditationTicks} 秒，修为稳步提升。`,
          flavorText: '静能生慧，\n定能生慧。',
          result: 'success',
          rarity: 'normal'
        });
        this.historyManager.addRecord(record);
      }
      this.ui.setState('闭目修炼');
      console.log('[KERNEL] meditation OFF');
    }
    this.ui.updateStats();
    saveState();
  }

  scheduleEvent() {
    const delay = Math.floor(Math.random() * 15000) + 10000;
    console.log('[KERNEL] next event in', (delay / 1000).toFixed(0), 's');
    if (this.eventTimer) clearTimeout(this.eventTimer);
    this.eventTimer = setTimeout(() => {
      if (!this.eventEngine.eventInProgress && !State.meditationMode) {
        this.eventEngine.eventInProgress = true;
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        this.ui.showEvent(event);
      } else {
        console.log('[KERNEL] event skipped, rescheduling');
        this.scheduleEvent();
      }
    }, delay);
  }

  learnRandomTechnique() {
    const available = TECHNIQUES.filter(t => !State.techniques.learned.includes(t.id));
    if (available.length === 0) return false;
    const t = available[Math.floor(Math.random() * available.length)];
    learnTechnique(t.id);
    activateTechnique(t.id);

    const record = new LifeRecord({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      title: '习得功法',
      narrative: `偶然机缘，习得「${t.name}」。\n功法奥妙，需细细参悟。`,
      outcome: `掌握「${t.name}」，修为有所增益。`,
      flavorText: '功法传承，\n亦是道统延续。',
      result: 'success',
      techniquesUnlocked: [t.name],
      rarity: t.type === 'rare' ? 'rare' : 'uncommon'
    });
    this.historyManager.addRecord(record);

    // 里程碑
    if (!this.milestoneManager.hasFirst('first_technique')) {
      this.milestoneManager.markFirst('first_technique');
      const ms = new MilestoneRecord({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: '首部功法',
        description: `获得《${t.name}》`,
        type: 'first_technique',
        realmName: REALMS[State.realm].name
      });
      this.milestoneManager.addMilestone(ms);
    }

    return t;
  }

  resetGame() {
    console.log('[KERNEL] reset game');
    localStorage.removeItem('xiuzhen_save_v2');

    State.name = '无名散修';
    State.realm = 0;
    State.exp = 0;
    State.hp = 100;
    State.maxHp = 100;
    State.mp = 50;
    State.maxMp = 50;
    State.luck = 10;
    State.gold = 0;
    State.eventCount = 0;
    State.totalTime = 0;
    State.meditationMode = false;
    State.techniques = { active: [], learned: [] };
    State.history = { events: [] };

    const roots = Object.keys(ROOTS);
    State.spiritualRoot = roots[Math.floor(Math.random() * roots.length)];
    const elements = Object.keys(ELEMENTS);
    State.element = elements[Math.floor(Math.random() * elements.length)];

    this.historyManager.clear();
    this.milestoneManager.clear();
    this.tickCount = 0;
    this.meditationTicks = 0;
    this.eventEngine.reset();

    if (this.eventTimer) clearTimeout(this.eventTimer);
    this.scheduleEvent();

    this.ui.updateStats();
    this.ui.setState('闭目修炼');
    this.ui.showSystemBubble('从头开始', '修为散尽，重新踏上修仙之路。');

    console.log('[KERNEL] reset complete');
  }
}