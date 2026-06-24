import { State, REALMS, ROOTS, MINDS, ELEMENTS } from '../engine/State.js';

export class UIManager {
  constructor() {
    this.bubble = document.getElementById('eventBubble');
    this.stats = document.getElementById('hiddenStats');
    this.stateLabel = document.getElementById('stateLabel');
    console.log('[UI] mounted');
  }

  showEvent(event) {
    console.log('[UI] showEvent:', event.title);
    if (!this.bubble) return;

    this.bubble.style.display = 'block';
    this.bubble.style.visibility = 'visible';
    this.bubble.style.opacity = '1';
    this.bubble.classList.add('show');

    document.getElementById('bubbleTitle').textContent = event.title;
    const typeEl = document.getElementById('bubbleType');
    typeEl.textContent = event.type === 'daily' ? '日常' : event.type === 'qi' ? '奇遇' : '危机';
    typeEl.className = 'bubble-type type-' + event.type;
    document.getElementById('bubbleDesc').textContent = event.desc;
    document.getElementById('choiceResult').innerHTML = '';
    const choices = document.getElementById('choices');
    choices.innerHTML = '';

    event.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-label">${ch.id}</span>${ch.text}`;
      btn.onclick = () => {
        console.log('[Click] choice:', ch.id);
        window.gameEngine.handleChoice(event, ch.id);
      };
      choices.appendChild(btn);
    });

    this.setState('受扰');
    State.eventCount++;
  }

  showResult(res) {
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    document.getElementById('choiceResult').innerHTML = `<strong>${res.s ? '✓' : '✗'}</strong> ${res.msg}`;
  }

  hideEvent() {
    this.bubble.classList.remove('show');
    this.bubble.style.display = 'none';
    this.bubble.style.visibility = 'hidden';
    this.bubble.style.opacity = '0';
    this.setState('闭目修炼');
  }

  showSystemBubble(title, desc) {
    document.getElementById('bubbleTitle').textContent = title;
    const typeEl = document.getElementById('bubbleType');
    typeEl.textContent = '系统';
    typeEl.className = 'bubble-type type-daily';
    document.getElementById('bubbleDesc').textContent = desc;
    document.getElementById('choices').innerHTML = '';
    document.getElementById('choiceResult').innerHTML = '';
    this.bubble.style.display = 'block';
    this.bubble.style.visibility = 'visible';
    this.bubble.style.opacity = '1';
    this.bubble.classList.add('show');
    setTimeout(() => {
      this.bubble.classList.remove('show');
      this.bubble.style.display = 'none';
      this.bubble.style.visibility = 'hidden';
      this.bubble.style.opacity = '0';
    }, 3000);
  }

  updateStats() {
    const realm = REALMS[State.realm];
    const root = ROOTS[State.spiritualRoot];
    const mind = MINDS[State.mindState];
    const pct = Math.min(100, Math.floor(State.exp / realm.expNeed * 100));
    if (this.stats) {
      this.stats.innerHTML = `
        <div class="stat-line">${realm.name} | ${Math.floor(State.exp)}/${realm.expNeed} (${pct}%)</div>
        <div class="stat-line">灵根: ${root.name} | 五行: ${ELEMENTS[State.element]} | 心境: <span style="color:${mind.color}">${mind.name}</span></div>
        <div class="stat-line">气运: ${State.luck} | 事件: ${State.eventCount}</div>
      `;
    }
  }

  setState(text) {
    if (this.stateLabel) this.stateLabel.textContent = text;
  }
}
