const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendNotification: (message) => ipcRenderer.send('show-notification', message),
    saveHistory: (result) => ipcRenderer.send('save-history', result),
    getHistory: () => ipcRenderer.invoke('get-history')
});