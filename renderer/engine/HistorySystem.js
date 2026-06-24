import { State, addHistory, REALMS } from './State.js';

export function recordEvent(title, choice, result, changes) {
  const realmBefore = State.realm;
  addHistory({
    type: 'event',
    title,
    choice,
    result,
    realmBefore: getRealmNameAt(realmBefore),
    realmAfter: getRealmNameAt(State.realm),
    ...changes
  });
}

export function recordBreakthrough(success) {
  addHistory({
    type: 'breakthrough',
    title: success ? '境界突破' : '突破失败',
    result: success ? `突破至「${getRealmNameAt(State.realm)}」` : '冲击瓶颈失败',
    realmBefore: getRealmNameAt(State.realm - (success ? 1 : 0)),
    realmAfter: getRealmNameAt(State.realm)
  });
}

export function recordTechniqueLearned(techniqueName) {
  addHistory({
    type: 'technique',
    title: '习得功法',
    result: `习得「${techniqueName}」`,
    techniqueName
  });
}

export function recordMeditation(duration) {
  addHistory({
    type: 'meditation',
    title: '静修',
    result: `静修 ${duration} 秒，修为稳步提升`
  });
}

function getRealmNameAt(idx) {
  if (idx < 0) return '未知';
  return REALMS[idx]?.name || '未知';
}

export function getRecentHistory(limit = 10) {
  return (State.history?.events || []).slice(0, limit);
}

export function getAllHistory() {
  return State.history?.events || [];
}

export function clearHistory() {
  State.history = { events: [] };
}
