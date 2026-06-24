import { State, ROOTS, MINDS, REALMS, loadState, saveState, formatTime } from './State.js';
import { EventEngine } from './EventEngine.js';

export class GameEngine {
  constructor(ui) {
    this.ui = ui;
    this.eventEngine = new EventEngine();
    this.gameTimer = null;
    this.tickCount = 0;
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
      if (this.tickCount >= Math.floor(Math.random() * 20) + 10) {
        this.tickCount = 0;
        const event = this.eventEngine.roll();
        if (event) {
          this.ui.showEvent(event);
        }
      }
    }, 1000);
  }

  tick() {
    const growth = ROOTS[State.spiritualRoot].growth;
    const bonus = State.mindState === 'enlightenment' ? 1.2 : State.mindState === 'demon' ? 0.7 : 1;
    State.exp += 0.5 * growth * bonus;
    State.hp = Math.min(State.maxHp, State.hp + 0.1);
    State.totalTime++;
    this.checkBreakthrough();
    saveState();
    this.ui.updateStats();
  }

  checkBreakthrough() {
    const realm = REALMS[State.realm];
    if (State.exp >= realm.expNeed) {
      const rate = 0.5 + (ROOTS[State.spiritualRoot].growth - 1) * 0.2 + State.luck * 0.001;
      if (Math.random() < rate) {
        State.exp -= realm.expNeed;
        State.realm++;
        State.maxHp += 50 * (State.realm + 1);
        State.maxMp += 30 * (State.realm + 1);
        State.hp = State.maxHp;
        this.ui.showSystemBubble('境界突破', `突破至「${REALMS[State.realm].name}」！`);
      } else {
        State.exp = Math.floor(State.exp * 0.5);
        this.ui.showSystemBubble('突破失败', '冲击瓶颈失败，修为受损。');
      }
      this.ui.updateStats();
    }
  }

  scheduleEvent() {
    this.eventEngine.schedule((event) => {
      this.ui.showEvent(event);
    });
  }

  handleChoice(event, choiceId) {
    console.log('[Engine] resolving choice:', choiceId);
    const res = event.resolve(choiceId);
    if (res.exp) State.exp += res.exp;
    if (res.luck) State.luck += res.luck;
    this.checkBreakthrough();
    saveState();
    this.ui.showResult(res);
    this.eventEngine.reset();
    setTimeout(() => {
      this.ui.hideEvent();
      this.scheduleEvent();
    }, 4000);
  }
}
