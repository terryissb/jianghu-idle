import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { InteractionManager } from './interaction/InteractionManager.js';

export function bootstrapGame() {
  console.log('========================');
  console.log('[RECOVERY] bootstrap start');
  console.log('========================');

  try {
    // 1. 强制创建 UI
    const ui = new UIManager();
    ui.mount();
    console.log('[UI] mounted');

    // 2. 启动引擎
    const engine = new GameEngine(ui);
    engine.start();
    console.log('[ENGINE] started');

    // 3. 恢复交互
    const interaction = new InteractionManager(ui, engine);
    interaction.bind();
    console.log('[INTERACTION] bound');

    // 4. 强制注入全局调试
    window.__GAME__ = { ui, engine };
    window.gameEngine = engine;

    console.log('[RECOVERY] bootstrap complete');
    console.log('========================');
  } catch (err) {
    console.error('[RECOVERY] FAILED:', err);
    console.error(err.stack);
    document.body.innerHTML += `<div style="position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:999999;">BOOT ERROR: ${err.message}</div>`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  bootstrapGame();
});
