const { app, BrowserWindow, screen } = require('electron');
const path = require('node:path');

try {
  require('electron-reloader')(module);
} catch (err) {
  console.log('Error al cargar electron-reloader:', err);
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {

  const { width, height } = screen.getPrimaryDisplay().size;
 
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.resizable = false;
  // mainWindow.setMenu(null);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


