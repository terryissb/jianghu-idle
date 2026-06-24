const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 右键菜单
  showContextMenu: () => ipcRenderer.invoke('show-context-menu'),
  
  // 退出应用
  quitApp: () => ipcRenderer.send('quit-app'),
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.send('open-external', url),
  
  // 平台信息
  platform: process.platform
});
