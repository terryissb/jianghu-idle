export class InteractionManager {
  constructor(ui, engine) {
    this.ui = ui;
    this.engine = engine;
  }

  bind() {
    const character = document.getElementById('characterLayer');
    const stats = document.getElementById('hiddenStats');

    if (!character) {
      console.error('[INTERACTION] characterLayer not found');
      return;
    }

    // Hover stats
    character.addEventListener('mouseenter', () => {
      console.log('[HOVER] pet');
      if (stats) {
        stats.style.opacity = '1';
        stats.style.transform = 'translateX(-50%) translateY(0)';
      }
    });

    character.addEventListener('mouseleave', () => {
      if (stats) {
        stats.style.opacity = '0';
        stats.style.transform = 'translateX(-50%) translateY(10px)';
      }
    });

    // Click to open history
    character.addEventListener('click', (e) => {
      if (e.target.classList.contains('drag-zone')) return;
      console.log('[PET] clicked');
      if (this.ui) {
        this.ui.showHistoryPanel();
      }
    });

    // Close panels on outside click
    document.addEventListener('click', (e) => {
      const panels = document.querySelectorAll('.panel');
      const isPanel = e.target.closest('.panel');
      const isCharacter = e.target.closest('#characterLayer');
      const isMeditationBtn = e.target.closest('#meditationBtn');
      if (!isPanel && !isCharacter && !isMeditationBtn) {
        panels.forEach(p => p.classList.remove('show'));
      }
    });

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const panel = e.target.closest('.panel');
        if (!panel) return;
        panel.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.panel-tab-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        const target = panel.querySelector(`.panel-tab-content[data-tab="${e.target.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });

    // Meditation toggle
    const medBtn = document.getElementById('meditationBtn');
    if (medBtn && this.engine) {
      medBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.engine.toggleMeditation();
        medBtn.classList.toggle('active');
      });
    }

    console.log('[INTERACTION] bound');
  }
}
