import { RuntimeKernel } from './engine/RuntimeKernel.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('========================');
  console.log('[KERNEL] bootstrap start');
  console.log('========================');

  try {
    const kernel = new RuntimeKernel();
    kernel.init();
    kernel.start();

    console.log('[KERNEL] bootstrap complete');
    console.log('========================');
  } catch (err) {
    console.error('[KERNEL] FAILED:', err);
    console.error(err.stack);
  }
});
