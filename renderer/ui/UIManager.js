import { State, REALMS, ROOTS, MINDS, ELEMENTS, formatTimestamp, getRealmProgress } from '../engine/State.js';
import { getAllHistory } from '../engine/HistorySystem.js';
import { getActiveTechniques, getLearnedTechniques } from '../engine/TechniqueSystem.js';

export class UIManager {
  constructor() {
    this.ensureDOM();
    this.eventBubble = document.getElementById('eventBubble');
    this.hiddenStats = document.getElementById('hiddenStats');
    this.stateLabel = document.getElementById('stateLabel');
    this.historyPanel = document.getElementById('historyPanel');
    this.techniquePanel = document.getElementById('techniquePanel');
    this.realmPanel = document.getElementById('realmPanel');
  }

  ensureDOM() {
    const ids = ['eventBubble', 'hiddenStats', 'stateLabel', 'historyPanel', 'techniquePanel', 'realmPanel', 'meditationBtn'];
    ids.forEach(id => {
      if (!document.getElementById(id)) {
        console.warn('[UI] missing #' + id + ', creating...');
        const el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el);
      }
    });

    const bubble = document.getElementById('eventBubble');
    if (bubble && !document.getElementById('bubbleTitle')) {
      bubble.innerHTML = `
        <div class="bubble-title" id="bubbleTitle"></div>
        <div style="text-align:center"><span class="bubble-type" id="bubbleType"></span></div>
        <div class="bubble-desc" id="bubbleDesc"></div>
        <div class="choices" id="choices"></div>
        <div class="choice-result" id="choiceResult"></div>
      `;
      bubble.className = 'event-bubble';
    }
  }

  mount() {
    console.log('[UI] mount() called');
    this.updateStats();
  }

  // ==================== Event Bubble ====================
  showEvent(event) {
    console.log('[UI] showEvent:', event.title);
    if (!this.eventBubble) {
      console.error('[UI] eventBubble not found');
      return;
    }

    this.eventBubble.style.display = 'block';
    this.eventBubble.style.visibility = 'visible';
    this.eventBubble.style.opacity = '1';
    this.eventBubble.classList.add('show');

    const title = document.getElementById('bubbleTitle');
    const typeEl = document.getElementById('bubbleType');
    const desc = document.getElementById('bubbleDesc');
    const choices = document.getElementById('choices');
    const result = document.getElementById('choiceResult');

    if (title) title.textContent = event.title;
    if (typeEl) {
      typeEl.textContent = event.type === 'daily' ? '日常' : event.type === 'qi' ? '奇遇' : event.type === 'crisis' ? '危机' : '境界';
      typeEl.className = 'bubble-type type-' + (event.type === 'realm_event' ? 'daily' : event.type);
    }
    if (desc) desc.textContent = event.desc;
    if (result) result.innerHTML = '';
    if (choices) {
      choices.innerHTML = '';
      event.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-label">${ch.id}</span>${ch.text}`;
        btn.onclick = () => {
          console.log('[Click] choice:', ch.id);
          if (window.__GAME__ && window.__GAME__.engine) {
            window.__GAME__.engine.handleChoice(event, ch.id);
          }
        };
        choices.appendChild(btn);
      });
    }

    this.setState('受扰');
    State.eventCount++;
  }

  showResult(res) {
    const choices = document.querySelectorAll('.choice-btn');
    choices.forEach(b => b.disabled = true);
    const result = document.getElementById('choiceResult');
    if (result) result.innerHTML = `<strong>${res.s ? '✓' : '✗'}</strong> ${res.msg}`;
  }

  hideEvent() {
    if (!this.eventBubble) return;
    this.eventBubble.classList.remove('show');
    this.eventBubble.style.display = 'none';
    this.eventBubble.style.visibility = 'hidden';
    this.eventBubble.style.opacity = '0';
    this.setState('闭目修炼');
  }

  showSystemBubble(title, desc) {
    const bt = document.getElementById('bubbleTitle');
    const tp = document.getElementById('bubbleType');
    const bd = document.getElementById('bubbleDesc');
    const ch = document.getElementById('choices');
    const cr = document.getElementById('choiceResult');
    if (bt) bt.textContent = title;
    if (tp) { tp.textContent = '系统'; tp.className = 'bubble-type type-daily'; }
    if (bd) bd.textContent = desc;
    if (ch) ch.innerHTML = '';
    if (cr) cr.innerHTML = '';
    this.eventBubble.style.display = 'block';
    this.eventBubble.style.visibility = 'visible';
    this.eventBubble.style.opacity = '1';
    this.eventBubble.classList.add('show');
    setTimeout(() => {
      this.eventBubble.classList.remove('show');
      this.eventBubble.style.display = 'none';
      this.eventBubble.style.visibility = 'hidden';
      this.eventBubble.style.opacity = '0';
    }, 3000);
  }

  // ==================== History Panel ====================
  showHistoryPanel() {
    console.log('[UI] showHistoryPanel');
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
    if (!list) return;
    const events = getAllHistory();
    if (events.length === 0) {
      list.innerHTML = '<div class="panel-empty">修仙之路刚刚开始，尚无记录。</div>';
      return;
    }
    list.innerHTML = events.map(e => {
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
    const activeEl = this.techniquePanel.querySelector('.technique-active');
    const allEl = this.techniquePanel.querySelector('.technique-all');
    if (activeEl) {
      activeEl.innerHTML = active.length === 0
        ? '<div class="panel-empty">暂无激活功法</div>'
        : active.map(t => `
          <div class="technique-item technique-${t.type}">
            <div class="technique-name">${t.name} Lv.${t.level}</div>
            <div class="technique-desc">${t.desc}</div>
            <div class="technique-focus">${t.focus}</div>
          </div>
        `).join('');
    }
    if (allEl) {
      allEl.innerHTML = learned.length === 0
        ? '<div class="panel-empty">尚未习得功法</div>'
        : learned.map(t => `
          <div class="technique-item technique-${t.type}">
            <div class="technique-name">${t.name} Lv.${t.level}</div>
            <div class="technique-desc">${t.desc}</div>
          </div>
        `).join('');
    }
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
    if (!el) return;
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
    if (this.hiddenStats) {
      this.hiddenStats.innerHTML = `
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
