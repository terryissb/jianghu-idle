import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { InteractionManager } from './interaction/InteractionManager.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('========================');
  console.log('Jianghu Idle v2.2 Boot');
  console.log('========================');

  try {
    console.log('[BOOT] start');

    // DOM 自检：确保关键元素存在
    ensureDOM();
    console.log('[BOOT] DOM check passed');

    const ui = new UIManager();
    console.log('[UI] mounted');

    const engine = new GameEngine(ui);
    console.log('[Engine] created');

    const interaction = new InteractionManager(ui);
    console.log('[Interaction] created');

    window.gameEngine = engine;

    engine.start();
    console.log('[Engine] started');

    interaction.bind();
    console.log('[Interaction] bound');

    console.log('[BOOT] complete');
    console.log('========================');
  } catch (err) {
    console.error('[BOOT] FAILED:', err);
    console.error(err.stack);
    document.body.innerHTML += `<div style="position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:999999;">BOOT ERROR: ${err.message}</div>`;
  }
});

function ensureDOM() {
  const ids = ['uiLayer', 'eventBubble', 'hiddenStats', 'stateLabel', 'historyPanel', 'techniquePanel', 'realmPanel', 'meditationBtn'];
  ids.forEach(id => {
    if (!document.getElementById(id)) {
      console.warn('[DOM] missing #' + id + ', creating...');
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
  });

  // 确保 eventBubble 有内部结构
  const bubble = document.getElementById('eventBubble');
  if (bubble && !document.getElementById('bubbleTitle')) {
    bubble.innerHTML = `
      <div class="bubble-title" id="bubbleTitle"></div>
      <div style="text-align:center"><span class="bubble-type" id="bubbleType"></span></div>
      <div class="bubble-desc" id="bubbleDesc"></div>
      <div class="choices" id="choices"></div>
      <div class="choice-result" id="choiceResult"></div>
    `;
  }
}
