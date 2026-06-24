export class InteractionManager {
  constructor(ui) {
    this.ui = ui;
  }

  bind() {
    const character = document.getElementById('characterLayer');
    const stats = document.getElementById('hiddenStats');

    if (!character || !stats) {
      console.error('[Interaction] elements not found');
      return;
    }

    // Hover stats
    character.addEventListener('mouseenter', () => {
      console.log('[HOVER] pet');
      stats.style.opacity = '1';
      stats.style.transform = 'translateX(-50%) translateY(0)';
    });

    character.addEventListener('mouseleave', () => {
      stats.style.opacity = '0';
      stats.style.transform = 'translateX(-50%) translateY(10px)';
    });

    // Click to open history
    character.addEventListener('click', (e) => {
      // Only click on non-drag area
      if (e.target.classList.contains('drag-zone')) return;
      console.log('[CLICK] pet - open history');
      this.ui.showHistoryPanel();
    });

    // Close panels on outside click
    document.addEventListener('click', (e) => {
      const panels = document.querySelectorAll('.panel');
      const isPanel = e.target.closest('.panel');
      const isCharacter = e.target.closest('#characterLayer');
      if (!isPanel && !isCharacter) {
        panels.forEach(p => p.classList.remove('show'));
      }
    });

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const panel = e.target.closest('.panel');
        panel.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.panel-tab-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        const target = panel.querySelector(`.panel-tab-content[data-tab="${e.target.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });

    // Meditation toggle
    const medBtn = document.getElementById('meditationBtn');
    if (medBtn) {
      medBtn.addEventListener('click', () => {
        window.gameEngine.toggleMeditation();
        medBtn.classList.toggle('active');
      });
    }

    console.log('[Interaction] ready');
  }
}
