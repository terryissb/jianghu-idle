export function createEventTemplate(event) {
  const typeMap = { daily: '日常', qi: '奇遇', crisis: '危机' };
  return {
    title: event.title,
    type: typeMap[event.type] || '日常',
    desc: event.desc,
    choices: event.choices
  };
}
