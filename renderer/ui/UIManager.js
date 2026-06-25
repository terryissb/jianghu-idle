import { State, REALMS, ROOTS, MINDS, ELEMENTS, getRealmProgress } from '../engine/State.js';
import { getActiveTechniques, getLearnedTechniques } from '../engine/TechniqueSystem.js';

export class UIManager {
  constructor(kernel) {
    this.kernel = kernel;
    this.ensureDOM();
    this.eventBubble = document.getElementById('eventBubble');
    this.hiddenStats = document.getElementById('hiddenStats');
    this.stateLabel = document.getElementById('stateLabel');
    this.lifePanel = document.getElementById('lifePanel');
  }

  ensureDOM() {
    const ids = ['eventBubble', 'hiddenStats', 'stateLabel', 'lifePanel', 'meditationBtn'];
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

    const panel = document.getElementById('lifePanel');
    if (panel && !document.getElementById('profileSection')) {
      panel.innerHTML = `
        <div class="life-header">
          <span class="life-title">📜 修仙回溯</span>
          <span class="life-close" onclick="document.getElementById('lifePanel').classList.remove('show')">✕</span>
        </div>
        <div class="life-body">
          <div class="life-section" id="profileSection"></div>
          <div class="life-section" id="attributeSection"></div>
          <div class="life-section" id="techniqueSection"></div>
          <div class="life-section" id="timelineSection"></div>
        </div>
      `;
      panel.className = 'life-panel';
    }
  }

  mount() {
    console.log('[UI] mount() called');
    this.updateStats();
  }

  showEvent(event) {
    console.log('[UI] showEvent:', event.title);
    if (!this.eventBubble) return;

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
    if (desc) desc.textContent = event.narrative || event.desc;
    if (result) result.innerHTML = '';
    if (choices) {
      choices.innerHTML = '';
      event.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-label">${ch.id}</span>${ch.text}`;
        btn.onclick = () => {
          console.log('[Click] choice:', ch.id);
          if (this.kernel) {
            this.kernel.handleChoice(event, ch.id);
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

  // ==================== Life Panel (v2.3) ====================
  showHistoryPanel() {
    console.log('[UI] showHistoryPanel');
    if (!this.lifePanel) return;
    this.lifePanel.classList.add('show');
    this.renderLifePanel();
  }

  hideHistoryPanel() {
    if (!this.lifePanel) return;
    this.lifePanel.classList.remove('show');
  }

  renderLifePanel() {
    if (!this.kernel) return;
    const history = this.kernel.historyManager;
    const records = history.getRecentRecords();

    // ① Profile Section
    const profile = document.getElementById('profileSection');
    if (profile) {
      const realm = REALMS[State.realm];
      profile.innerHTML = `
        <div class="profile-card">
          <h2>${State.name || '无名散修'}</h2>
          <p>境界：${realm.name}</p>
          <p>修为：${Math.floor(State.exp)}</p>
          <p>累计事件：${history.getTotalEvents()}</p>
          <p>掌握功法：${State.techniques.learned.length}</p>
          <p>突破次数：${history.getBreakthroughCount()}</p>
        </div>
      `;
    }

    // ② Attribute Section
    const attr = document.getElementById('attributeSection');
    if (attr) {
      const mindMap = { stable: 35, turbulent: 20, enlightenment: 50, demon: 5 };
      const mindVal = mindMap[State.mindState] || 30;
      const bodyVal = Math.floor(State.hp);
      const spiritVal = Math.floor(State.mp);
      const insightVal = Math.floor(State.luck * 2.5);
      attr.innerHTML = `
        <div class="attr-grid">
          <div class="attr-item"><span class="attr-label">心境</span><span class="attr-value">${mindVal}</span></div>
          <div class="attr-item"><span class="attr-label">灵力</span><span class="attr-value">${spiritVal}</span></div>
          <div class="attr-item"><span class="attr-label">肉身</span><span class="attr-value">${bodyVal}</span></div>
          <div class="attr-item"><span class="attr-label">悟性</span><span class="attr-value">${insightVal}</span></div>
        </div>
      `;
    }

    // ③ Technique Section
    const tech = document.getElementById('techniqueSection');
    if (tech) {
      const learned = getLearnedTechniques();
      if (learned.length === 0) {
        tech.innerHTML = '<div class="tc-empty">尚未习得功法</div>';
      } else {
        tech.innerHTML = learned.map(t => `
          <div class="technique-card">
            <div>${t.name}</div>
            <div>Lv.${t.level}</div>
          </div>
        `).join('');
      }
    }

    // ④ Timeline Section
    const timeline = document.getElementById('timelineSection');
    if (timeline) {
      if (records.length === 0) {
        timeline.innerHTML = '<div class="tl-empty">修仙之路刚刚开始，尚无记录。</div>';
      } else {
        timeline.innerHTML = records.map(r => `
          <div class="timeline-item">
            <div class="timeline-title">${r.title}</div>
            <div class="timeline-time">${r.getFormattedTime()}</div>
            <div class="timeline-narrative">${r.narrative}</div>
            <div class="timeline-outcome">${r.outcome}</div>
          </div>
        `).join('');
      }
    }
  }

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
