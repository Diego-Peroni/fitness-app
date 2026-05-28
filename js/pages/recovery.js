const RecoveryPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [hasPain, setHasPain] = React.useState(false);
  const [intensity, setIntensity] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const loadData = () => {
    const data = Storage.get('recovery', today);
    if (data) {
      setHasPain(data.hasPain);
      setIntensity(data.intensity);
      setNotes(data.notes || '');
      setSaved(true);
    }
    setHistory(Storage.getLast('recovery', 14));
  };

  React.useEffect(loadData, []);

  const handleSave = () => {
    Storage.save('recovery', { hasPain, intensity: hasPain ? intensity : 0, notes }, today);
    setSaved(true);
    setHistory(Storage.getLast('recovery', 14));
  };

  const chartData = {
    labels: history.map(d => d.date.slice(5)),
    datasets: [{
      data: history.map(d => d.intensity),
      borderColor: '#f85149',
      backgroundColor: 'rgba(248,81,73,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: history.map(d => d.intensity > 5 ? '#f85149' : d.intensity > 0 ? '#d29922' : '#3fb950')
    }]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🩹 Recuperacao / Lesao</h2>

      {/* Pain toggle */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Presenca de dor hoje?</p>
        <div className="flex gap-3">
          <button
            onClick={() => { setHasPain(false); setSaved(false); }}
            className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
              !hasPain ? 'border-accent-green bg-accent-green/10 text-accent-green' : 'border-dark-600 text-gray-400'
            }`}
          >
            Nao
          </button>
          <button
            onClick={() => { setHasPain(true); setSaved(false); }}
            className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
              hasPain ? 'border-accent-red bg-accent-red/10 text-accent-red' : 'border-dark-600 text-gray-400'
            }`}
          >
            Sim
          </button>
        </div>
      </div>

      {/* Intensity */}
      {hasPain && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Intensidade da dor</p>
            <p className={`text-lg font-bold ${intensity > 7 ? 'text-accent-red' : intensity > 4 ? 'text-accent-yellow' : 'text-accent-green'}`}>
              {intensity}/10
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={intensity}
            onChange={(e) => { setIntensity(parseInt(e.target.value)); setSaved(false); }}
            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <label className="text-sm text-gray-400 block mb-2">Observacoes</label>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
          placeholder="Local da dor, tipo de desconforto, etc."
          rows={3}
          className="w-full bg-dark-700 rounded-lg px-4 py-3 text-white text-sm border border-dark-600 focus:border-accent-blue focus:outline-none resize-none"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          saved ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-blue text-white hover:opacity-90'
        }`}
      >
        {saved ? '✓ Salvo' : 'Salvar'}
      </button>

      {/* History */}
      {history.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Intensidade de dor (14 dias)</p>
          <ChartComponent data={chartData} height="130px" options={{
            scales: { y: { min: 0, max: 10, ticks: { stepSize: 2, color: '#8b949e' } } }
          }} />
        </div>
      )}
    </div>
  );
};

window.RecoveryPage = RecoveryPage;
