// Check if running in Electron
export const isElectron = () => {
  return !!window.electronAPI;
};

// Use Electron API if available, fallback to web API
export const apiClient = {
  // Reminders
  async getReminders() {
    if (isElectron() && window.electronAPI.getReminders) {
      return await window.electronAPI.getReminders();
    } else {
      // Fallback to REST API
      const response = await fetch('/api/reminders');
      return await response.json();
    }
  },

  async addReminder(reminder) {
    if (isElectron() && window.electronAPI.addReminder) {
      return await window.electronAPI.addReminder(reminder);
    } else {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)
      });
      return await response.json();
    }
  },

  // Notes
  async getNotes() {
    if (isElectron() && window.electronAPI.getNotes) {
      return await window.electronAPI.getNotes();
    } else {
      const response = await fetch('/api/notes');
      return await response.json();
    }
  }
};