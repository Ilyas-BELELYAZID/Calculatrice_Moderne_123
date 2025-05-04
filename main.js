const { app, BrowserWindow, ipcMain, Menu, dialog, Notification, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let history = [];
let tray;

function createTray() {
    tray = new Tray(path.join(__dirname, 'assets/icon.png'));
    tray.setToolTip("Calculatrice moderne");
    let contextTray = Menu.buildFromTemplate([
        {
            label: 'À propos',
            click: () => {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'À propos',
                    message: 'Calculatrice Moderne\nVersion 1.0.0'
                });
            }
        }
    ])
    tray.setContextMenu(contextTray);
}

function createWindow() {
    createTray();
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        icon: path.join(__dirname, 'assets/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Plein écran',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
        },
        {
            label: 'À propos',
            click: () => {
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'À propos',
                    message: 'Calculatrice Moderne\nVersion 1.0.0'
                });
            }
        },
        { type: 'separator' },
        {
            label: 'Quitter',
            role: 'quit'
        }
    ]);
    mainWindow.webContents.on('context-menu', () => {
        contextMenu.popup();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC Notifications
ipcMain.on('show-notification', (event, message) => {
    new Notification({ title: 'Calculatrice', body: message }).show();
});

// IPC Historique
ipcMain.on('save-history', (event, result) => {
    history.push(result);
    fs.writeFileSync(path.join(__dirname, 'assets/history/history.json'), JSON.stringify(history));
});

// IPC Demande historique
ipcMain.handle('get-history', async () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'assets/history/history.json'));
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
});

function createSplashScreen() {
  splash = new BrowserWindow({ width: 300, height: 300, transparent: false, frame: false, alwaysOnTop: true });
  splash.loadFile('splash.html');
  setTimeout(() => {
    splash.close();
    createWindow();
  }, 2500);
}

app.whenReady().then(createSplashScreen);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});