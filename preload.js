const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  log: (msg) => console.log('[RENDERER]', msg)
});
