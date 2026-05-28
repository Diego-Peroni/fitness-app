const WaterPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const settings = Storage.getSettings();
  const [amount, setAmount] = React.useState(0);
  const [goal, setGoal] = React.useState(settings.waterGoal);
  const [showSettings, setShowSettings] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const loadData = () => {
    const data = Storage.get('water', today);
    setAmount(data ? data.amount : 0);
    setHistory(Storage.getLast('water', 14));
  };

  React.useEffect(loadData, []);

  const addWater = (ml) => {
    const newAmount = amount + ml;
    setAmount(newAmount);
    Storage.save('water', { amount: newAmount, goal }, today);
  };

  const removeWater = (ml) => {
    const newAmount = Math.max(0, amount - ml);
    setAmount(newAmount);
    Storage.save('water', { amount: newAmount, goal }, today);
  };

  const saveGoal = () => {
    const s = Storage.getSettings();
    s.waterGoal = goal;
    Storage.saveSettings(s);
    setShowSettings(false);
  };

  const percent = Math.min(Math.round((amount / goal) * 100), 100);

  const chartData = {
    labels: history.map(d => d.date.slice(5)),
    datasets: [{
      data: history.map(d => d.amount),
      backgroundColor: history.map(d => d.amount >= goal ? '#3fb950' : '#58a6ff'),
      borderRadius: 4
    }]
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">💧 Controle de Agua</h2>
        <button onClick={() => setShowSettings(!showSettings)} className="text-sm text-accent-blue">
          Meta: {goal}ml
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <label className="text-sm text-gray-400 block mb-2">Meta diaria (ml)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
              className="flex-1 bg-dark-700 rounded-lg px-4 py-2 text-white border border-dark-600 focus:border-accent-blue focus:outline-none"
            />
            <button onClick={saveGoal} className="bg-accent-green text-white px-4 py-2 rounded-lg">Salvar</button>
          </div>
        </div>
      )}

      {/* Progress circle */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-600 text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#21262d" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={percent >= 100 ? '#3fb950' : '#58a6ff'}
              strokeWidth="10"
              strokeDasharray={`${percent * 3.39} 339.292`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{amount}</span>
            <span className="text-xs text-gray-400">/ {goal} ml</span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${percent >= 100 ? 'text-accent-green' : 'text-accent-blue'}`}>
          {percent >= 100 ? 'Meta atingida!' : `${percent}% da meta`}
        </p>
      </div>

      {/* Quick add buttons */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Adicionar</p>
        <div className="grid grid-cols-4 gap-2">
          {[150, 250, 350, 500].map(ml => (
            <button
              key={ml}
              onClick={() => addWater(ml)}
              className="bg-dark-700 hover:bg-accent-blue/20 border border-dark-600 rounded-lg py-3 text-center transition-colors"
            >
              <span className="block text-sm font-medium">+{ml}</span>
              <span className="block text-xs text-gray-400">ml</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => removeWater(250)}
            className="flex-1 bg-dark-700 hover:bg-accent-red/20 border border-dark-600 rounded-lg py-2 text-sm text-accent-red transition-colors"
          >
            -250 ml
          </button>
          <button
            onClick={() => { setAmount(0); Storage.save('water', { amount: 0, goal }, today); }}
            className="bg-dark-700 hover:bg-accent-red/20 border border-dark-600 rounded-lg py-2 px-4 text-sm text-accent-red transition-colors"
          >
            Zerar
          </button>
        </div>
      </div>

      {/* History chart */}
      {history.length > 1 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Ultimos 14 dias</p>
          <ChartComponent type="bar" data={chartData} height="150px" />
        </div>
      )}
    </div>
  );
};

window.WaterPage = WaterPage;
