const WorkoutPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [exercises, setExercises] = React.useState([]);
  const [catalog, setCatalog] = React.useState(Storage.getExercises());
  const [showAdd, setShowAdd] = React.useState(false);
  const [newExName, setNewExName] = React.useState('');
  const [selectedEx, setSelectedEx] = React.useState('');
  const [sets, setSets] = React.useState('3');
  const [reps, setReps] = React.useState('12');
  const [load, setLoad] = React.useState('');
  const [showHistory, setShowHistory] = React.useState(null);
  const [historyData, setHistoryData] = React.useState([]);

  const loadData = () => {
    const data = Storage.get('workout', today);
    setExercises(data ? data.exercises : []);
  };

  React.useEffect(loadData, []);

  const addExerciseToCatalog = () => {
    if (!newExName.trim()) return;
    const updated = [...catalog, newExName.trim()];
    setCatalog(updated);
    Storage.saveExercises(updated);
    setNewExName('');
    setSelectedEx(newExName.trim());
  };

  const removeFromCatalog = (name) => {
    const updated = catalog.filter(e => e !== name);
    setCatalog(updated);
    Storage.saveExercises(updated);
  };

  const addExerciseToDay = () => {
    if (!selectedEx) return;
    const entry = {
      name: selectedEx,
      load: parseFloat(load) || 0,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0
    };
    const updated = [...exercises, entry];
    setExercises(updated);
    Storage.save('workout', { exercises: updated }, today);
    setSelectedEx('');
    setLoad('');
    setSets('3');
    setReps('12');
    setShowAdd(false);
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
    Storage.save('workout', { exercises: updated }, today);
  };

  const viewHistory = (exName) => {
    setShowHistory(exName);
    const last60 = Storage.getLast('workout', 60);
    const entries = [];
    last60.forEach(day => {
      if (day.exercises) {
        day.exercises.forEach(ex => {
          if (ex.name === exName) {
            entries.push({ date: day.date, ...ex });
          }
        });
      }
    });
    setHistoryData(entries);
  };

  const chartData = historyData.length > 0 ? {
    labels: historyData.map(d => d.date.slice(5)),
    datasets: [{
      label: 'Carga (kg)',
      data: historyData.map(d => d.load),
      borderColor: '#3fb950',
      backgroundColor: 'rgba(63,185,80,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#3fb950'
    }]
  } : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🏋️ Treino</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-accent-blue text-white px-3 py-1.5 rounded-lg text-sm">
          + Exercicio
        </button>
      </div>

      {/* Add exercise form */}
      {showAdd && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600 space-y-3">
          {/* Select or create exercise */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Exercicio</label>
            <select
              value={selectedEx}
              onChange={(e) => setSelectedEx(e.target.value)}
              className="w-full bg-dark-700 rounded-lg px-3 py-2 text-white border border-dark-600 focus:border-accent-blue focus:outline-none"
            >
              <option value="">Selecione...</option>
              {catalog.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              placeholder="Novo exercicio"
              className="flex-1 bg-dark-700 rounded-lg px-3 py-2 text-white text-sm border border-dark-600 focus:border-accent-blue focus:outline-none"
            />
            <button onClick={addExerciseToCatalog} className="bg-dark-600 text-white px-3 py-2 rounded-lg text-sm">+</button>
          </div>

          {/* Load, sets, reps */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Carga (kg)</label>
              <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="0"
                className="w-full bg-dark-700 rounded-lg px-3 py-2 text-white text-sm border border-dark-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Series</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-dark-700 rounded-lg px-3 py-2 text-white text-sm border border-dark-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-dark-700 rounded-lg px-3 py-2 text-white text-sm border border-dark-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={addExerciseToDay}
            className="w-full bg-accent-green text-white py-2.5 rounded-lg font-medium"
          >
            Registrar Exercicio
          </button>
        </div>
      )}

      {/* Today's exercises */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Treino de hoje</p>
        {exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum exercicio registrado</p>
        ) : (
          <div className="space-y-2">
            {exercises.map((ex, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{ex.name}</p>
                  <p className="text-xs text-gray-400">{ex.load}kg x {ex.sets}s x {ex.reps}r</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => viewHistory(ex.name)} className="text-xs text-accent-blue">📈</button>
                  <button onClick={() => removeExercise(i)} className="text-xs text-accent-red">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise history */}
      {showHistory && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Historico: {showHistory}</p>
            <button onClick={() => setShowHistory(null)} className="text-xs text-gray-400">Fechar</button>
          </div>
          {chartData ? (
            <ChartComponent data={chartData} height="160px" />
          ) : (
            <p className="text-gray-500 text-center py-4">Sem dados anteriores</p>
          )}
          {historyData.length > 0 && (
            <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
              {[...historyData].reverse().map((entry, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-dark-700 last:border-0">
                  <span className="text-gray-400">{entry.date}</span>
                  <span>{entry.load}kg x {entry.sets}s x {entry.reps}r</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Catalog management */}
      {catalog.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Exercicios cadastrados</p>
          <div className="flex flex-wrap gap-2">
            {catalog.map(ex => (
              <span key={ex} className="inline-flex items-center gap-1 bg-dark-700 rounded-full px-3 py-1 text-xs">
                {ex}
                <button onClick={() => removeFromCatalog(ex)} className="text-gray-400 hover:text-accent-red ml-1">✕</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.WorkoutPage = WorkoutPage;
