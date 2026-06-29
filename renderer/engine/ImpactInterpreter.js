/**
 * ImpactInterpreter.js — v2.4.2
 * 将数值变化转化为修仙叙事文本
 * 不再是 "修为 +12"，而是 "灵气运转加快，修为精进 +12"
 */

const STAT_LABELS = {
  cultivation: '修为',
  mind: '心境',
  body: '肉身',
  insight: '悟性',
  fortune: '福缘',
  spirit: '灵力',
  breakthrough: '突破感悟',
  hp: '气血',
  mp: '内力'
};

/** 正数值的叙事原因（按事件类型和属性） */
const POSITIVE_REASONS = {
  cultivation: [
    '灵气运转顺畅，修为精进',
    '感悟天地之道，修为提升',
    '经脉拓宽，灵气吸收加快',
    '苦修有所得，修为渐长'
  ],
  mind: [
    '道心更加稳固',
    '心魔消散，心神清明',
    '静坐感悟，心境提升',
    '杂念尽去，心如明镜'
  ],
  body: [
    '肉身淬炼，筋骨强健',
    '灵气滋养，体魄增强',
    '气血充盈，肉身精进',
    '淬体有成，肉身提升'
  ],
  insight: [
    '灵光一闪，悟性提升',
    '观物悟道，灵感迸发',
    '心境空明，悟性增长',
    '触类旁通，感悟加深'
  ],
  fortune: [
    '气运提升，福缘深厚',
    '机缘降临，运势好转',
    '天道眷顾，气运加身',
    '积德行善，福缘增长'
  ],
  spirit: [
    '灵力充盈，丹田饱满',
    '灵气汇聚，灵力增长',
    '运转周天，灵力提升',
    '吸纳灵气，灵力精进'
  ],
  breakthrough: [
    '瓶颈松动，感悟加深',
    '道基稳固，突破可期',
    '灵气冲击，瓶颈微裂',
    '修为积累，突破感悟增长'
  ],
  hp: [
    '气血恢复，伤势好转',
    '灵气滋养，气血充盈',
    '肉身修复，气血回升'
  ],
  mp: [
    '内力恢复，真气充盈',
    '调息养神，内力回升',
    '灵气转化，内力增长'
  ]
};

/** 负数值的叙事原因 */
const NEGATIVE_REASONS = {
  cultivation: [
    '灵气紊乱，修为受损',
    '走火入魔，修为倒退',
    '心神不宁，修炼受阻',
    '外力干扰，修为折损'
  ],
  mind: [
    '道心动摇，心神受损',
    '心魔滋生，心境下跌',
    '执念缠身，心神不宁',
    '外界干扰，心境受损'
  ],
  body: [
    '肉身受损，筋骨疼痛',
    '灵气反噬，体魄受伤',
    '外力冲击，肉身受创',
    '修炼过度，肉身疲惫'
  ],
  insight: [
    '灵感消散，悟性下降',
    '杂念丛生，感悟受阻',
    '心境蒙尘，悟性减退',
    '遭遇瓶颈，灵感枯竭'
  ],
  fortune: [
    '气运走低，福缘浅薄',
    '霉运缠身，运势下跌',
    '天道考验，气运受损',
    '因果纠缠，福缘消耗'
  ],
  spirit: [
    '灵力枯竭，丹田空虚',
    '灵气散逸，灵力下降',
    '过度消耗，灵力不济',
    '经脉受损，灵力流失'
  ],
  breakthrough: [
    '瓶颈加固，突破更难',
    '感悟消散，突破受阻',
    '灵气溃散，突破感悟倒退',
    '道基动摇，突破艰难'
  ],
  hp: [
    '气血流失，伤势加重',
    '肉身受创，气血下降',
    '灵气反噬，气血受损'
  ],
  mp: [
    '内力耗尽，真气不足',
    '过度消耗，内力下降',
    '经脉受损，内力流失'
  ]
};

/** 随机选取一个原因 */
function pickReason(list) {
  if (!list || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

/** 格式化数值（带正负号） */
function fmtValue(value) {
  if (value > 0) return '+' + value;
  return String(value);
}

/** 将 Impact 转换为叙事化视图 */
export function interpretImpact(impact) {
  if (!impact) return [];

  const items = [];

  for (const [key, value] of Object.entries(impact)) {
    // 跳过非数值和非统计属性
    if (typeof value !== 'number') continue;
    if (key === 'techniqueExp' || key === 'unlocks' || key === 'penalties') continue;

    const label = STAT_LABELS[key];
    if (!label) continue;

    const isPositive = value > 0;
    const reasons = isPositive ? POSITIVE_REASONS[key] : NEGATIVE_REASONS[key];
    const reason = pickReason(reasons);

    items.push({
      stat: key,
      label,
      value: fmtValue(Math.round(value)),
      rawValue: value,
      reason,
      isPositive
    });
  }

  return items;
}

/** 将 Buff 转换为叙事化视图 */
export function interpretBuff(buff) {
  if (!buff) return null;

  const modifiers = buff.modifiers || (buff.type ? [{ target: buff.type, value: buff.value }] : []);
  const durationMin = buff.duration ? Math.floor(buff.duration / 60) : 0;
  const durationSec = buff.duration ? buff.duration % 60 : 0;

  let durationText = '';
  if (durationMin > 0) durationText += durationMin + '分钟';
  if (durationSec > 0) durationText += durationSec + '秒';
  if (!durationText) durationText = '短暂';

  // 构建效果描述
  const effectDesc = modifiers.map(m => {
    const sign = m.value >= 0 ? '+' : '';
    const pct = Math.round(Math.abs(m.value) * 100);
    const label = STAT_LABELS[m.target] || m.target;
    return `${label} ${sign}${pct}%`;
  }).join('，');

  return {
    name: buff.name,
    effect: effectDesc,
    duration: durationText,
    rawDuration: buff.duration
  };
}

/** 从事件类型推断 buff 来源描述 */
export function getBuffSource(eventType) {
  const map = {
    daily: '日常修行感悟',
    qi: '奇遇机缘',
    crisis: '危机磨砺',
    realm_event: '境界突破',
    story_event: '剧情经历'
  };
  return map[eventType] || '神秘机缘';
}
