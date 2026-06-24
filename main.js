const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.setIgnoreMouseEvents(false);

  win.webContents.openDevTools({ mode: 'detach' });

  console.log('[MAIN] window created');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
