export const REALMS = [
  { name: '炼气期', expNeed: 100 },
  { name: '筑基期', expNeed: 500 },
  { name: '金丹期', expNeed: 2000 },
  { name: '元婴期', expNeed: 8000 },
  { name: '化神期', expNeed: 30000 },
  { name: '合体期', expNeed: 100000 },
  { name: '大乘期', expNeed: 500000 },
  { name: '渡劫期', expNeed: 2000000 },
  { name: '真仙', expNeed: 999999999 }
];

export const ROOTS = {
  heavenly: { name: '天灵根', growth: 2.0 },
  earth: { name: '地灵根', growth: 1.5 },
  mixed: { name: '杂灵根', growth: 1.0 },
  mutated: { name: '变异灵根', growth: 1.8 }
};

export const MINDS = {
  stable: { name: '心境平稳', color: '#3d7a37' },
  turbulent: { name: '心境动荡', color: '#b8860b' },
  enlightenment: { name: '顿悟', color: '#6b3a7d' },
  demon: { name: '入魔边缘', color: '#b33939' }
};

export const ELEMENTS = {
  gold: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土'
};

export let State = {
  realm: 0,
  exp: 0,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  spiritualRoot: 'mixed',
  element: 'wood',
  mindState: 'stable',
  luck: 10,
  gold: 0,
  eventCount: 0,
  totalTime: 0,
  meditationMode: false,
  techniques: { active: [], learned: [] },
  history: { events: [] },
  lastSave: Date.now()
};

export function loadState() {
  const saved = localStorage.getItem('xiuzhen_save_v2');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const offline = Math.floor((Date.now() - data.lastSave) / 1000);
      State = { ...State, ...data };
      if (!State.techniques) State.techniques = { active: [], learned: [] };
      if (!State.history) State.history = { events: [] };
      if (offline > 10) {
        const growth = ROOTS[State.spiritualRoot].growth;
        const gain = Math.floor(offline * 0.3 * growth);
        State.exp += gain;
        return { offline, gain };
      }
      return null;
    } catch (e) {
      console.error('[State] load failed', e);
      return null;
    }
  } else {
    const roots = Object.keys(ROOTS);
    State.spiritualRoot = roots[Math.floor(Math.random() * roots.length)];
    const elements = Object.keys(ELEMENTS);
    State.element = elements[Math.floor(Math.random() * elements.length)];
    return null;
  }
}

export function saveState() {
  State.lastSave = Date.now();
  localStorage.setItem('xiuzhen_save_v2', JSON.stringify(State));
}

export function formatTime(s) {
  if (s < 60) return s + '秒';
  if (s < 3600) return Math.floor(s / 60) + '分';
  return Math.floor(s / 3600) + '小时';
}

export function formatTimestamp(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function addHistory(entry) {
  if (!State.history) State.history = { events: [] };
  State.history.events.unshift({
    time: Date.now(),
    ...entry
  });
  if (State.history.events.length > 50) {
    State.history.events = State.history.events.slice(0, 50);
  }
}

export function getRealmName() {
  return REALMS[State.realm].name;
}

export function getRealmProgress() {
  const realm = REALMS[State.realm];
  return Math.min(100, Math.floor(State.exp / realm.expNeed * 100));
}
