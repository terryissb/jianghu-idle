import { State, REALMS, ROOTS, MINDS, loadState, saveState, formatTime } from './State.js';
import { EventEngine, EVENTS } from './EventEngine.js';
import { UIManager } from '../ui/UIManager.js';
import { InteractionManager } from '../interaction/InteractionManager.js';
import { recordEvent, recordBreakthrough, recordMeditation } from './HistorySystem.js';
import { calculateTechniqueEffects, learnTechnique, activateTechnique, TECHNIQUES } from './TechniqueSystem.js';

export class RuntimeKernel {
  constructor() {
    this.ui = null;
    this.eventEngine = null;
    this.interaction = null;
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
      if (Math.random() < rate) {
        State.exp -= realm.expNeed;
        State.realm++;
        State.maxHp += 50 * (State.realm + 1);
        State.maxMp += 30 * (State.realm + 1);
        State.hp = State.maxHp;
        recordBreakthrough(true);
        this.ui.showSystemBubble('境界突破', `突破至「${REALMS[State.realm].name}」！`);
        this.ui.updateStats();
        setTimeout(() => {
          const event = this.eventEngine.rollRealmEvent();
          this.ui.showEvent(event);
        }, 2000);
      } else {
        State.exp = Math.floor(State.exp * 0.5);
        recordBreakthrough(false);
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

    recordEvent(event.title, choiceId, res.msg, { expChange: res.exp, luckChange: res.luck });

    this.checkBreakthrough();
    saveState();
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
        recordMeditation(this.meditationTicks);
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
        console.log('[KERNEL] event skipped (in progress or meditation), rescheduling');
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
    return t;
  }
}
