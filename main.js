const { app, BrowserWindow, Tray, Menu, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  // 获取屏幕尺寸，默认放在右下角
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 280,
    height: 300,
    x: width - 300,
    y: height - 320,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: true,
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('pet.html');
  
  // 打开开发者工具（调试用）
  mainWindow.webContents.openDevTools({ mode: 'detach' });
  console.log('[main] DevTools opened');
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // 创建系统托盘
  createTray();
}

function createTray() {
  // macOS 使用 16x16 或 18x18 的图标
  tray = new Tray(path.join(__dirname, 'icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示宠物', click: () => {
      if (mainWindow) mainWindow.show();
    }},
    { label: '隐藏宠物', click: () => {
      if (mainWindow) mainWindow.hide();
    }},
    { type: 'separator' },
    { label: '在浏览器打开完整版', click: () => {
      require('electron').shell.openExternal('https://terryissb.github.io/jianghu-idle/');
    }},
    { type: 'separator' },
    { label: '退出', click: () => {
      app.quit();
    }}
  ]);
  
  tray.setToolTip('江湖挂机录 - 桌面宠物');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
}

app.whenReady().then(() => {
  console.log('[main] app ready');
  createWindow();
  
  // 注册全局快捷键 Ctrl+Shift+J 显示/隐藏宠物
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
