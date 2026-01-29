const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Keep global references
let mainWindow;
let backendProcess;
let tray = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,          // Security: keep false
      contextIsolation: true,          // Security: keep true
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    show: false,  // Don't show until ready for "big popup"
    frame: true,  // Keep window controls
    backgroundColor: '#ffffff'
  });

  // For development: load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // For production: load built files
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  // BIG POPUP EFFECT - Show maximized
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();  // Maximize window
    mainWindow.show();      // Then show it
    mainWindow.focus();     // Bring to front
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Start Express backend server
function startBackendServer() {
  const backendPath = path.join(__dirname, '../backend');
  
  backendProcess = spawn('node', ['index.js'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

// Auto-start on system boot
function setupAutoStart() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: false,  // Show window on login
    path: app.getPath('exe')
  });
}

// System tray
function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Minimize to Tray',
      click: () => {
        if (mainWindow) mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        if (backendProcess) backendProcess.kill();
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Your App Name');
  tray.setContextMenu(contextMenu);

  // Tray click behavior
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Start backend first
  startBackendServer();
  
  // Then create window (give backend time to start)
  setTimeout(() => {
    createWindow();
    createTray();
    setupAutoStart();
  }, 2000); // 2 second delay for backend to start

  // Create menu (optional)
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// IPC handlers for reminders and notes
ipcMain.handle('get-reminders', async () => {
  // You'll implement this later
  return [];
});

ipcMain.handle('add-reminder', async (event, reminder) => {
  // You'll implement this later
  return { success: true, id: Date.now() };
});