const PerformancePage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const loadData = () => {
    const data = Storage.get('performance', today);
    if (data) {
      setRating(data.rating);
      setNote(data.note || '');
      setSaved(true);
    }
    setHistory(Storage.getLast('performance', 14));
  };

  React.useEffect(loadData, []);

  const handleSave = () => {
    Storage.save('performance', { rating, note }, today);
    setSaved(true);
    setHistory(Storage.getLast('performance', 14));
  };

  const labels = ['', 'Pessimo', 'Ruim', 'Normal', 'Bom', 'Excelente'];
  const colors = ['', 'text-accent-red', 'text-accent-red', 'text-accent-yellow', 'text-accent-green', 'text-accent-green'];

  const chartData = {
    labels: history.map(d => d.date.slice(5)),
    datasets: [{
      data: history.map(d => d.rating),
      backgroundColor: history.map(d => d.rating >= 4 ? '#3fb950' : d.rating >= 3 ? '#d29922' : '#f85149'),
      borderRadius: 4
    }]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">💪 Performance</h2>

      {/* Rating */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Como foi o treino hoje?</p>
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => { setRating(n); setSaved(false); }}
              className={`w-12 h-12 rounded-xl border-2 text-lg font-bold transition-all ${
                rating === n
                  ? 'border-accent-blue bg-accent-blue/20 text-accent-blue scale-110'
                  : 'border-dark-600 bg-dark-700 text-gray-400 hover:border-dark-500'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className={`text-center text-sm font-medium ${colors[rating]}`}>{labels[rating]}</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <label className="text-sm text-gray-400 block mb-2">Notas do treino (energia, pump, etc.)</label>
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setSaved(false); }}
          placeholder="Como voce se sentiu..."
          rows={3}
          className="w-full bg-dark-700 rounded-lg px-4 py-3 text-white text-sm border border-dark-600 focus:border-accent-blue focus:outline-none resize-none"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={rating === 0}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          saved ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-blue text-white hover:opacity-90'
        } ${rating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {saved ? '✓ Salvo' : 'Salvar'}
      </button>

      {/* History */}
      {history.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Ultimos 14 dias</p>
          <ChartComponent type="bar" data={chartData} height="130px" options={{
            scales: { y: { min: 0, max: 5, ticks: { stepSize: 1, color: '#8b949e' } } }
          }} />
        </div>
      )}
    </div>
  );
};

window.PerformancePage = PerformancePage;
