import { State, REALMS, ROOTS, MINDS, ELEMENTS, formatTimestamp, getRealmName, getRealmProgress } from '../engine/State.js';
import { getRecentHistory, getAllHistory } from '../engine/HistorySystem.js';
import { getActiveTechniques, getLearnedTechniques, TECHNIQUES } from '../engine/TechniqueSystem.js';

export class UIManager {
  constructor() {
    this.bubble = document.getElementById('eventBubble');
    this.stats = document.getElementById('hiddenStats');
    this.stateLabel = document.getElementById('stateLabel');
    this.historyPanel = document.getElementById('historyPanel');
    this.techniquePanel = document.getElementById('techniquePanel');
    this.realmPanel = document.getElementById('realmPanel');
    console.log('[UI] mounted');
  }

  // ==================== Event Bubble ====================
  showEvent(event) {
    console.log('[UI] showEvent:', event.title);
    if (!this.bubble) return;

    this.bubble.style.display = 'block';
    this.bubble.style.visibility = 'visible';
    this.bubble.style.opacity = '1';
    this.bubble.classList.add('show');

    document.getElementById('bubbleTitle').textContent = event.title;
    const typeEl = document.getElementById('bubbleType');
    typeEl.textContent = event.type === 'daily' ? '日常' : event.type === 'qi' ? '奇遇' : event.type === 'crisis' ? '危机' : '境界';
    typeEl.className = 'bubble-type type-' + (event.type === 'realm_event' ? 'daily' : event.type);
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

  // ==================== History Panel ====================
  showHistoryPanel() {
    if (!this.historyPanel) return;
    this.historyPanel.classList.add('show');
    this.renderHistory();
  }

  hideHistoryPanel() {
    if (!this.historyPanel) return;
    this.historyPanel.classList.remove('show');
  }

  renderHistory() {
    const list = this.historyPanel.querySelector('.panel-content');
    const events = getAllHistory();
    if (events.length === 0) {
      list.innerHTML = '<div class="panel-empty">修仙之路刚刚开始，尚无记录。</div>';
      return;
    }
    list.innerHTML = events.map(e => {
      const typeMap = { event: '事件', breakthrough: '突破', technique: '功法', meditation: '静修' };
      const icon = { event: '⚡', breakthrough: '🔥', technique: '📖', meditation: '🌿' };
      const time = formatTimestamp(e.time);
      return `
        <div class="history-item history-${e.type}">
          <div class="history-icon">${icon[e.type] || '•'}</div>
          <div class="history-body">
            <div class="history-header">
              <span class="history-title">${e.title}</span>
              <span class="history-time">${time}</span>
            </div>
            <div class="history-result">${e.result}</div>
            ${e.realmBefore ? `<div class="history-realm">${e.realmBefore} → ${e.realmAfter}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ==================== Technique Panel ====================
  showTechniquePanel() {
    if (!this.techniquePanel) return;
    this.techniquePanel.classList.add('show');
    this.renderTechniques();
  }

  hideTechniquePanel() {
    if (!this.techniquePanel) return;
    this.techniquePanel.classList.remove('show');
  }

  renderTechniques() {
    const active = getActiveTechniques();
    const learned = getLearnedTechniques();
    const allEl = this.techniquePanel.querySelector('.technique-all');
    const activeEl = this.techniquePanel.querySelector('.technique-active');

    activeEl.innerHTML = active.length === 0
      ? '<div class="panel-empty">暂无激活功法</div>'
      : active.map(t => `
        <div class="technique-item technique-${t.type}">
          <div class="technique-name">${t.name} Lv.${t.level}</div>
          <div class="technique-desc">${t.desc}</div>
          <div class="technique-focus">${t.focus}</div>
        </div>
      `).join('');

    allEl.innerHTML = learned.length === 0
      ? '<div class="panel-empty">尚未习得功法</div>'
      : learned.map(t => `
        <div class="technique-item technique-${t.type}">
          <div class="technique-name">${t.name} Lv.${t.level}</div>
          <div class="technique-desc">${t.desc}</div>
        </div>
      `).join('');
  }

  // ==================== Realm Panel ====================
  showRealmPanel() {
    if (!this.realmPanel) return;
    this.realmPanel.classList.add('show');
    this.renderRealm();
  }

  hideRealmPanel() {
    if (!this.realmPanel) return;
    this.realmPanel.classList.remove('show');
  }

  renderRealm() {
    const realm = REALMS[State.realm];
    const next = REALMS[State.realm + 1];
    const pct = getRealmProgress();
    const el = this.realmPanel.querySelector('.panel-content');
    el.innerHTML = `
      <div class="realm-current">
        <div class="realm-name">${realm.name}</div>
        <div class="realm-progress-bar">
          <div class="realm-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="realm-progress-text">${Math.floor(State.exp)} / ${realm.expNeed} (${pct}%)</div>
      </div>
      ${next ? `<div class="realm-next">下一境界：${next.name}（需 ${next.expNeed} 修为）</div>` : '<div class="realm-next">已至巅峰</div>'}
      <div class="realm-info">
        <div>灵根：${ROOTS[State.spiritualRoot].name}</div>
        <div>五行：${ELEMENTS[State.element]}</div>
        <div>心境：${MINDS[State.mindState].name}</div>
      </div>
    `;
  }

  // ==================== Stats & State ====================
  updateStats() {
    const realm = REALMS[State.realm];
    const root = ROOTS[State.spiritualRoot];
    const mind = MINDS[State.mindState];
    const pct = getRealmProgress();
    const active = getActiveTechniques();
    const meditationTag = State.meditationMode ? ' <span style="color:#3d7a37">[静修]</span>' : '';
    if (this.stats) {
      this.stats.innerHTML = `
        <div class="stat-line">${realm.name} | ${Math.floor(State.exp)}/${realm.expNeed} (${pct}%)</div>
        <div class="stat-line">灵根: ${root.name} | 五行: ${ELEMENTS[State.element]} | 心境: <span style="color:${mind.color}">${mind.name}</span></div>
        <div class="stat-line">气运: ${State.luck} | 事件: ${State.eventCount}${meditationTag}</div>
        ${active.length > 0 ? `<div class="stat-line">功法: ${active.map(t => t.name).join(', ')}</div>` : ''}
      `;
    }
  }

  setState(text) {
    if (this.stateLabel) this.stateLabel.textContent = text;
  }
}
