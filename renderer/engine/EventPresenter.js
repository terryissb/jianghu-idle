/**
 * EventPresenter.js — v2.4.2
 * 将事件结果转换为可视化修仙叙事结构
 * EventEngine 只做逻辑，EventPresenter 负责"表达"
 */
import { interpretImpact, interpretBuff, getBuffSource } from './ImpactInterpreter.js';

export class EventPresenter {
  /**
   * 主入口：将事件 + 原始结果 → 可展示的修仙叙事
   */
  static present(event, rawResult) {
    const impactView = interpretImpact(rawResult.impact);
    const buffView = rawResult.impact?.buff ? interpretBuff(rawResult.impact.buff) : null;

    return {
      title: event.title,
      type: event.type,
      rarity: event.rarity || 'normal',

      // 三段式剧情
      story: rawResult.story || {
        intro: event.narrative || '',
        development: rawResult.narrative || '',
        conclusion: rawResult.outcome || rawResult.msg || ''
      },

      // 结果状态
      success: rawResult.s,
      msg: rawResult.msg,
      outcome: rawResult.outcome,
      flavorText: rawResult.flavorText || '',

      // 可视化影响
      impactView,
      buffView,
      buffSource: getBuffSource(event.type),

      // 功法获取标记
      technique: rawResult.technique || false,

      // 事件链标记
      chainId: event.chainId || null,
      chainStep: event.stage || null,
      nextStage: rawResult.nextStage || null,
      endChain: rawResult.endChain || false
    };
  }

  /**
   * 为 UI 生成事件卡片的 HTML 结构（逐步展示用）
   */
  static buildCard(presented) {
    const rarityClass = presented.rarity === 'rare' ? 'rare' : presented.rarity === 'uncommon' ? 'uncommon' : 'normal';
    const typeMap = { daily: '日常', qi: '奇遇', crisis: '危机', realm_event: '境界', story_event: '剧情' };

    return {
      rarityClass,
      typeLabel: typeMap[presented.type] || presented.type,
      title: presented.title,

      // 三段式（供分步展示）
      intro: presented.story.intro,
      development: presented.story.development,
      conclusion: presented.story.conclusion,

      // 结果
      success: presented.success,
      outcome: presented.outcome,
      flavorText: presented.flavorText,

      // 影响（数组）
      impactView: presented.impactView,
      buffView: presented.buffView,
      buffSource: presented.buffSource,
      technique: presented.technique
    };
  }

  /**
   * 生成影响展示的 HTML 字符串
   */
  static renderImpactHTML(impactView) {
    if (!impactView || impactView.length === 0) return '';

    let html = '<div class="impact-view">';
    html += '<div class="impact-view-title">━━ 修为变化 ━━</div>';

    impactView.forEach(item => {
      const color = item.isPositive ? '#3d7a37' : '#b33939';
      html += `<div class="impact-view-item">`;
      html += `<span class="impact-view-reason">${item.reason}</span>`;
      html += `<span class="impact-view-stat" style="color:${color}">${item.label} ${item.value}</span>`;
      html += `</div>`;
    });

    html += '</div>';
    return html;
  }

  /**
   * 生成 Buff 展示的 HTML 字符串
   */
  static renderBuffHTML(buffView, source) {
    if (!buffView) return '';

    let html = '<div class="buff-view">';
    html += '<div class="buff-view-title">━━ 状态获得 ━━</div>';
    html += `<div class="buff-view-name">「${buffView.name}」</div>`;
    html += `<div class="buff-view-desc">${buffView.effect}</div>`;
    html += `<div class="buff-view-meta">持续 ${buffView.duration} · 来源：${source}</div>`;
    html += '</div>';
    return html;
  }
}
