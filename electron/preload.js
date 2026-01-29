    const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Reminder methods
  getReminders: () => ipcRenderer.invoke('get-reminders'),
  addReminder: (reminder) => ipcRenderer.invoke('add-reminder', reminder),
  deleteReminder: (id) => ipcRenderer.invoke('delete-reminder', id),
  
  // Notes methods
  getNotes: () => ipcRenderer.invoke('get-notes'),
  saveNote: (note) => ipcRenderer.invoke('save-note', note),
  
  // App methods
  minimize: () => ipcRenderer.send('minimize-app'),
  maximize: () => ipcRenderer.send('maximize-app'),
  close: () => ipcRenderer.send('close-app'),
  
  // Events
  onReminderNotification: (callback) => 
    ipcRenderer.on('reminder-notification', (event, reminder) => callback(reminder))
});