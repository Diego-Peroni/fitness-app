const HistoryPage = () => {
  const [period, setPeriod] = React.useState('week');
  const [weightData, setWeightData] = React.useState([]);
  const [waterData, setWaterData] = React.useState([]);
  const [dietData, setDietData] = React.useState([]);
  const [perfData, setPerfData] = React.useState([]);

  const loadData = () => {
    const days = period === 'week' ? 7 : 30;
    setWeightData(Storage.getLast('weight', days));
    setWaterData(Storage.getLast('water', days));
    setDietData(Storage.getLast('diet', days));
    setPerfData(Storage.getLast('performance', days));
  };

  React.useEffect(loadData, [period]);

  const avgWeight = weightData.length > 0
    ? (weightData.reduce((s, d) => s + d.value, 0) / weightData.length).toFixed(1)
    : '--';

  const settings = Storage.getSettings();
  const daysMetWater = waterData.filter(d => d.amount >= settings.waterGoal).length;
  const avgDiet = dietData.length > 0
    ? Math.round(dietData.reduce((s, d) => s + (d.adherence || 0), 0) / dietData.length)
    : 0;
  const avgPerf = perfData.length > 0
    ? (perfData.reduce((s, d) => s + d.rating, 0) / perfData.length).toFixed(1)
    : '--';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">📅 Historico</h2>

      {/* Period selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
            period === 'week' ? 'border-accent-blue bg-accent-blue/20 text-accent-blue' : 'border-dark-600 text-gray-400'
          }`}
        >7 dias</button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
            period === 'month' ? 'border-accent-blue bg-accent-blue/20 text-accent-blue' : 'border-dark-600 text-gray-400'
          }`}
        >30 dias</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-xs text-gray-400">Peso medio</p>
          <p className="text-xl font-bold mt-1">{avgWeight} kg</p>
          <p className="text-xs text-gray-500">{weightData.length} registros</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-xs text-gray-400">Meta agua</p>
          <p className="text-xl font-bold mt-1 text-accent-blue">{daysMetWater}/{period === 'week' ? 7 : 30}</p>
          <p className="text-xs text-gray-500">dias atingidos</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-xs text-gray-400">Dieta media</p>
          <p className={`text-xl font-bold mt-1 ${avgDiet >= 80 ? 'text-accent-green' : 'text-accent-yellow'}`}>{avgDiet}%</p>
          <p className="text-xs text-gray-500">aderencia</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-xs text-gray-400">Performance</p>
          <p className="text-xl font-bold mt-1">{avgPerf}/5</p>
          <p className="text-xs text-gray-500">{perfData.length} registros</p>
        </div>
      </div>

      {/* Weight chart */}
      {weightData.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Peso</p>
          <ChartComponent data={{
            labels: weightData.map(d => d.date.slice(5)),
            datasets: [{
              data: weightData.map(d => d.value),
              borderColor: '#58a6ff',
              backgroundColor: 'rgba(88,166,255,0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 3
            }]
          }} height="130px" />
        </div>
      )}

      {/* Diet chart */}
      {dietData.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Aderencia dieta</p>
          <ChartComponent type="bar" data={{
            labels: dietData.map(d => d.date.slice(5)),
            datasets: [{
              data: dietData.map(d => d.adherence || 0),
              backgroundColor: dietData.map(d => (d.adherence || 0) >= 80 ? '#3fb950' : (d.adherence || 0) >= 50 ? '#d29922' : '#f85149'),
              borderRadius: 4
            }]
          }} height="130px" options={{
            scales: { y: { min: 0, max: 100, ticks: { stepSize: 25 } } }
          }} />
        </div>
      )}

      {/* Export */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Exportar dados</p>
        <div className="flex gap-2">
          <button
            onClick={() => ExportUtil.toJSON()}
            className="flex-1 bg-dark-700 border border-dark-600 text-white py-2 rounded-lg text-sm hover:bg-dark-600 transition-colors"
          >
            JSON
          </button>
          <button
            onClick={() => ExportUtil.toCSV('weight', period === 'week' ? 7 : 30)}
            className="flex-1 bg-dark-700 border border-dark-600 text-white py-2 rounded-lg text-sm hover:bg-dark-600 transition-colors"
          >
            CSV (Peso)
          </button>
          <button
            onClick={() => ExportUtil.toCSV('water', period === 'week' ? 7 : 30)}
            className="flex-1 bg-dark-700 border border-dark-600 text-white py-2 rounded-lg text-sm hover:bg-dark-600 transition-colors"
          >
            CSV (Agua)
          </button>
        </div>
      </div>
    </div>
  );
};

window.HistoryPage = HistoryPage;
