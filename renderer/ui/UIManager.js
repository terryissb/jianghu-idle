import { State, REALMS, ROOTS, MINDS, ELEMENTS, getRealmName, getRealmProgress } from '../engine/State.js';
import { getActiveTechniques, getLearnedTechniques, getTypeLabel, getUpgradeProgress } from '../engine/TechniqueSystem.js';
import { BuffSystem } from '../engine/BuffSystem.js';

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
          <div class="life-section" id="buffSection"></div>
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
      const typeMap = { daily: '日常', qi: '奇遇', crisis: '危机', realm_event: '境界', story_event: '剧情' };
      typeEl.textContent = typeMap[event.type] || event.type;
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
    if (!result) return;

    let html = `<strong>${res.s ? '✓' : '✗'}</strong> ${res.msg}`;

    // 显示 Impact
    if (res.impact) {
      const items = res.impact.toDisplay();
      if (items.length > 0) {
        html += '<div class="impact-display">';
        html += '<div class="impact-divider">━━━━━━━━━━━━━━</div>';
        items.forEach(item => {
          html += `<div class="impact-item">${item}</div>`;
        });
        html += '</div>';
      }
    }

    result.innerHTML = html;
  }

  // ==================== v2.4.2 EventFlow 分步展示 ====================
  showFlowStep(step) {
    const result = document.getElementById('choiceResult');
    if (!result) return;

    // 第一次初始化容器
    if (!result.querySelector('.flow-container')) {
      result.innerHTML = '<div class="flow-container"></div>';
    }
    const container = result.querySelector('.flow-container');

    const el = document.createElement('div');
    el.className = 'flow-step flow-step-' + step.type;
    el.style.animation = 'fadeInUp 0.4s ease forwards';

    switch (step.type) {
      case 'title':
        el.innerHTML = `<div class="flow-title">${step.title}</div>`;
        break;
      case 'intro':
        el.innerHTML = `<div class="flow-narrative flow-intro">${step.text}</div>`;
        break;
      case 'development':
        el.innerHTML = `<div class="flow-narrative flow-development">${step.text}</div>`;
        break;
      case 'conclusion':
        el.innerHTML = `<div class="flow-narrative flow-conclusion ${step.success ? 'success' : 'fail'}">${step.text}</div>`;
        break;
      case 'impact':
        {
          let html = '<div class="flow-impact">';
          html += '<div class="flow-impact-title">━━ 修为变化 ━━</div>';
          step.items.forEach(item => {
            const color = item.isPositive ? '#3d7a37' : '#b33939';
            html += `<div class="flow-impact-item">`;
            html += `<span class="flow-reason">${item.reason}</span>`;
            html += `<span class="flow-stat" style="color:${color}">${item.label} ${item.value}</span>`;
            html += `</div>`;
          });
          html += '</div>';
          el.innerHTML = html;
        }
        break;
      case 'buff':
        el.innerHTML = `
          <div class="flow-buff">
            <div class="flow-buff-title">━━ 状态获得 ━━</div>
            <div class="flow-buff-name">「${step.buff.name}」</div>
            <div class="flow-buff-effect">${step.buff.effect}</div>
            <div class="flow-buff-meta">持续 ${step.buff.duration} · 来源：${step.source}</div>
          </div>
        `;
        break;
      case 'technique':
        el.innerHTML = `<div class="flow-technique">✦ ${step.text}</div>`;
        break;
      case 'flavor':
        el.innerHTML = `<div class="flow-flavor">${step.text}</div>`;
        break;
    }

    container.appendChild(el);
    // 自动滚动到底部
    result.scrollTop = result.scrollHeight;
  }

  onFlowComplete() {
    // 流程完成，可以在这里添加视觉反馈
    const result = document.getElementById('choiceResult');
    if (result) {
      const done = document.createElement('div');
      done.className = 'flow-done';
      done.textContent = '━ 事件结束 ━';
      const container = result.querySelector('.flow-container');
      if (container) container.appendChild(done);
    }
  }

  // 兼容旧版直接展示（非 flow 模式）
  showPresentedResult(presented) {
    const result = document.getElementById('choiceResult');
    if (!result) return;

    let html = `<strong>${presented.success ? '✓' : '✗'}</strong> ${presented.msg || presented.outcome}`;

    if (presented.story && presented.story.conclusion) {
      html += `<div class="presented-conclusion">${presented.story.conclusion}</div>`;
    }

    if (presented.impactView && presented.impactView.length > 0) {
      html += '<div class="impact-display">';
      html += '<div class="impact-divider">━━ 修为变化 ━━</div>';
      presented.impactView.forEach(item => {
        const color = item.isPositive ? '#3d7a37' : '#b33939';
        html += `<div class="impact-item">${item.reason} · <span style="color:${color}">${item.label} ${item.value}</span></div>`;
      });
      html += '</div>';
    }

    if (presented.buffView) {
      html += `
        <div class="buff-display">
          <div class="impact-divider">━━ 状态获得 ━━</div>
          <div class="buff-tag">「${presented.buffView.name}」${presented.buffView.effect} · 持续${presented.buffView.duration}</div>
        </div>
      `;
    }

    if (presented.flavorText) {
      html += `<div class="flavor-text">${presented.flavorText}</div>`;
    }

    result.innerHTML = html;
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
    const milestones = this.kernel.milestoneManager.getMilestones();

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

    // ③ Buff Section (v2.4.1)
    const buffSec = document.getElementById('buffSection');
    if (buffSec) {
      const buffs = BuffSystem.getSummary(State);
      if (buffs.length === 0) {
        buffSec.innerHTML = '<div class="tc-empty">暂无 Buff</div>';
      } else {
        buffSec.innerHTML = buffs.map(b => `
          <div class="buff-card">
            <div class="buff-card-name">${b.name}</div>
            <div class="buff-card-desc">${b.desc}</div>
            <div class="buff-card-time">剩余 ${b.remaining} 秒</div>
          </div>
        `).join('');
      }
    }

    // ④ Technique Section (v2.4.1)
    const tech = document.getElementById('techniqueSection');
    if (tech) {
      const learned = getLearnedTechniques();
      if (learned.length === 0) {
        tech.innerHTML = '<div class="tc-empty">尚未习得功法</div>';
      } else {
        tech.innerHTML = learned.map(t => {
          const progress = getUpgradeProgress(t.id);
          const isMax = t.level >= t.maxLevel;
          return `
            <div class="technique-card">
              <div class="technique-info">
                <div class="technique-name">${t.name}</div>
                <div class="technique-type">${getTypeLabel(t.type)} · Lv.${t.level}</div>
              </div>
              <div class="technique-progress">
                <div class="technique-progress-bar" style="width: ${isMax ? 100 : progress}%"></div>
              </div>
              <div class="technique-progress-text">${isMax ? '已满级' : '升级进度 ' + progress + '%'}</div>
            </div>
          `;
        }).join('');
      }
    }

    // ④ Timeline Section (按日期分组)
    const timeline = document.getElementById('timelineSection');
    if (timeline) {
      if (records.length === 0) {
        timeline.innerHTML = '<div class="tl-empty">修仙之路刚刚开始，尚无记录。</div>';
      } else {
        // 按日期分组
        const groups = {};
        records.forEach(r => {
          const day = r.getDayLabel();
          if (!groups[day]) groups[day] = [];
          groups[day].push(r);
        });

        let html = '';
        
        // 里程碑
        if (milestones.length > 0) {
          html += '<div class="milestone-section">';
          html += '<div class="milestone-title">🏆 人生里程碑</div>';
          milestones.forEach(m => {
            html += `
              <div class="milestone-item">
                <div class="milestone-name">${m.title}</div>
                <div class="milestone-desc">${m.description}</div>
                <div class="milestone-time">${m.getFormattedTime()}</div>
              </div>
            `;
          });
          html += '</div>';
        }

        // 时间线
        Object.keys(groups).forEach(day => {
          html += `<div class="timeline-day">${day}</div>`;
          groups[day].forEach(r => {
            const rarityClass = r.rarity === 'rare' ? 'rare' : r.rarity === 'uncommon' ? 'uncommon' : 'normal';
            html += `
              <div class="timeline-card ${rarityClass}">
                <div class="timeline-card-header">
                  <span class="timeline-card-title">${r.title}</span>
                  <span class="timeline-card-time">${r.getFormattedTime()}</span>
                </div>
                <div class="timeline-card-narrative">${r.narrative.replace(/\n/g, '<br>')}</div>
                <div class="timeline-card-outcome">${r.outcome}</div>
                ${r.impact && r.impact.toDisplay().length > 0 ? `
                  <div class="timeline-card-impact">
                    <div class="timeline-impact-title">获得：</div>
                    ${r.impact.toDisplay().map(item => `<div class="timeline-impact-item">${item}</div>`).join('')}
                  </div>
                ` : ''}
                ${r.flavorText ? `<div class="timeline-card-flavor">${r.flavorText.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `;
          });
        });

        timeline.innerHTML = html;
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
    
    // Buff 显示 (v2.4.1: 使用 BuffSystem.getSummary)
    const buffs = BuffSystem.getSummary(State);
    const buffHtml = buffs.map(b => {
      return `<span class="buff-tag" title="${b.desc}">${b.name} ${b.remaining}s</span>`;
    }).join('');
    
    if (this.hiddenStats) {
      this.hiddenStats.innerHTML = `
        <div class="stat-line">${getRealmName()} | ${Math.floor(State.exp)}/${realm.expNeed} (${pct}%)</div>
        <div class="stat-line">灵根: ${root.name} | 五行: ${ELEMENTS[State.element]} | 心境: <span style="color:${mind.color}">${mind.name}</span></div>
        <div class="stat-line">气运: ${State.luck} | 事件: ${State.eventCount}${meditationTag}</div>
        ${active.length > 0 ? `<div class="stat-line">功法: ${active.map(t => t.name + ' Lv.' + t.level).join(', ')}</div>` : ''}
        ${buffHtml ? `<div class="stat-line">${buffHtml}</div>` : ''}
      `;
    }
  }

  setState(text) {
    if (this.stateLabel) this.stateLabel.textContent = text;
  }
}