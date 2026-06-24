import { State, REALMS, ROOTS, MINDS, loadState, saveState, formatTime } from './State.js';
import { EventEngine } from './EventEngine.js';
import { calculateTechniqueEffects, getActiveTechniques, activateTechnique, recordTechniqueLearned, TECHNIQUES, learnTechnique } from './TechniqueSystem.js';
import { recordEvent, recordBreakthrough, recordMeditation } from './HistorySystem.js';

export class GameEngine {
  constructor(ui) {
    this.ui = ui;
    this.eventEngine = new EventEngine();
    this.gameTimer = null;
    this.tickCount = 0;
    this.meditationTicks = 0;
  }

  start() {
    console.log('[Engine] start');
    const offline = loadState();
    this.ui.updateStats();

    if (offline) {
      this.ui.showSystemBubble('离线挂机', `离线 ${formatTime(offline.offline)}，修为 +${offline.gain}`);
    }

    this.scheduleEvent();

    this.gameTimer = setInterval(() => {
      this.tick();
      this.tickCount++;
      const checkInterval = State.meditationMode ? 20 : Math.floor(Math.random() * 20) + 10;
      if (this.tickCount >= checkInterval) {
        this.tickCount = 0;
        if (!State.meditationMode) {
          const event = this.eventEngine.roll();
          if (event) {
            this.ui.showEvent(event);
          }
        }
      }
    }, 1000);
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
    console.log('[Engine] resolving choice:', choiceId);
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

  scheduleEvent() {
    this.eventEngine.schedule((event) => {
      this.ui.showEvent(event);
    });
  }

  toggleMeditation() {
    State.meditationMode = !State.meditationMode;
    if (State.meditationMode) {
      this.meditationTicks = 0;
      this.ui.setState('入定静修');
      console.log('[Engine] meditation mode ON');
    } else {
      if (this.meditationTicks > 0) {
        recordMeditation(this.meditationTicks);
      }
      this.ui.setState('闭目修炼');
      console.log('[Engine] meditation mode OFF');
    }
    this.ui.updateStats();
    saveState();
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
