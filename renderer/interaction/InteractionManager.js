export class InteractionManager {
  bind() {
    const character = document.getElementById('characterLayer');
    const stats = document.getElementById('hiddenStats');

    if (!character || !stats) {
      console.error('[Interaction] elements not found');
      return;
    }

    character.addEventListener('mouseenter', () => {
      console.log('[HOVER] pet');
      stats.style.opacity = '1';
      stats.style.transform = 'translateX(-50%) translateY(0)';
    });

    character.addEventListener('mouseleave', () => {
      stats.style.opacity = '0';
      stats.style.transform = 'translateX(-50%) translateY(10px)';
    });

    console.log('[Interaction] ready');
  }
}
