const Storage = {
  _getKey(type, date) {
    return `fitness_${type}_${date}`;
  },

  _today() {
    return new Date().toISOString().split('T')[0];
  },

  save(type, data, date = null) {
    const key = this._getKey(type, date || this._today());
    localStorage.setItem(key, JSON.stringify(data));
  },

  get(type, date = null) {
    const key = this._getKey(type, date || this._today());
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  getRange(type, startDate, endDate) {
    const results = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const data = this.get(type, dateStr);
      if (data) {
        results.push({ date: dateStr, ...data });
      }
    }
    return results;
  },

  getLast(type, days = 30) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return this.getRange(type, start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  },

  delete(type, date = null) {
    const key = this._getKey(type, date || this._today());
    localStorage.removeItem(key);
  },

  // Exercises catalog
  getExercises() {
    const data = localStorage.getItem('fitness_exercises');
    return data ? JSON.parse(data) : [];
  },

  saveExercises(exercises) {
    localStorage.setItem('fitness_exercises', JSON.stringify(exercises));
  },

  // User settings
  getSettings() {
    const data = localStorage.getItem('fitness_settings');
    return data ? JSON.parse(data) : { waterGoal: 3000, userName: '', meals: ['Cafe da manha', 'Lanche AM', 'Almoco', 'Lanche PM', 'Jantar', 'Ceia'] };
  },

  saveSettings(settings) {
    localStorage.setItem('fitness_settings', JSON.stringify(settings));
  },

  // Export all data
  exportAll() {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('fitness_')) {
        allData[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    return allData;
  },

  // Import data
  importAll(data) {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
};

window.Storage = Storage;
