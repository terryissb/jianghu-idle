import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { InteractionManager } from './interaction/InteractionManager.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('========================');
  console.log('Jianghu Idle v2.2 Boot');
  console.log('========================');
  console.log('[BOOT] start');

  const ui = new UIManager();
  const engine = new GameEngine(ui);
  const interaction = new InteractionManager(ui);

  window.gameEngine = engine;

  engine.start();
  interaction.bind();

  console.log('[BOOT] complete');
  console.log('========================');
});
