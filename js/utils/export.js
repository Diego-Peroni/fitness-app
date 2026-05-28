const ExportUtil = {
  toJSON() {
    const data = Storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this._download(blob, `fitness-data-${new Date().toISOString().split('T')[0]}.json`);
  },

  toCSV(type, days = 90) {
    const data = Storage.getLast(type, days);
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        if (typeof val === 'object') return JSON.stringify(val);
        return val;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    this._download(blob, `fitness-${type}-${new Date().toISOString().split('T')[0]}.csv`);
  },

  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          Storage.importAll(data);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  },

  _download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

window.ExportUtil = ExportUtil;
