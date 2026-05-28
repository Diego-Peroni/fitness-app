const WeightPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [weight, setWeight] = React.useState('');
  const [todayData, setTodayData] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [editDate, setEditDate] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');

  const loadData = () => {
    setTodayData(Storage.get('weight', today));
    setHistory(Storage.getLast('weight', 30));
  };

  React.useEffect(loadData, []);

  const handleSave = () => {
    const val = parseFloat(weight);
    if (isNaN(val) || val <= 0) return;
    Storage.save('weight', { value: val }, editDate || today);
    setWeight('');
    setEditDate(null);
    setEditValue('');
    loadData();
  };

  const handleEdit = (date, value) => {
    setEditDate(date);
    setEditValue(value.toString());
    setWeight(value.toString());
  };

  const weeklyAvg = () => {
    const last7 = history.slice(-7);
    if (last7.length === 0) return '--';
    return (last7.reduce((sum, d) => sum + d.value, 0) / last7.length).toFixed(1);
  };

  const chartData = {
    labels: history.map(d => d.date.slice(5)),
    datasets: [{
      data: history.map(d => d.value),
      borderColor: '#58a6ff',
      backgroundColor: 'rgba(88,166,255,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: '#58a6ff'
    }]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">⚖️ Registro de Peso</h2>

      {/* Input */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <label className="text-sm text-gray-400 block mb-2">
          {editDate ? `Editando: ${editDate}` : 'Peso hoje (kg)'}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 75.5"
            className="flex-1 bg-dark-700 rounded-lg px-4 py-3 text-white border border-dark-600 focus:border-accent-blue focus:outline-none"
          />
          <button
            onClick={handleSave}
            className="bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
          >
            {editDate ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
        {editDate && (
          <button
            onClick={() => { setEditDate(null); setWeight(''); }}
            className="text-sm text-gray-400 mt-2 underline"
          >Cancelar edicao</button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600 text-center">
          <p className="text-gray-400 text-xs">Atual</p>
          <p className="text-xl font-bold">{todayData ? `${todayData.value} kg` : '-- kg'}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600 text-center">
          <p className="text-gray-400 text-xs">Media 7 dias</p>
          <p className="text-xl font-bold">{weeklyAvg()} kg</p>
        </div>
      </div>

      {/* Chart */}
      {history.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Evolucao (30 dias)</p>
          <ChartComponent data={chartData} height="180px" />
        </div>
      )}

      {/* History list */}
      {history.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Historico</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...history].reverse().map(entry => (
              <div key={entry.date} className="flex justify-between items-center py-2 border-b border-dark-700 last:border-0">
                <span className="text-sm text-gray-300">{entry.date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{entry.value} kg</span>
                  <button
                    onClick={() => handleEdit(entry.date, entry.value)}
                    className="text-xs text-accent-blue"
                  >editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.WeightPage = WeightPage;
