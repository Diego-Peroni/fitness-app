const DashboardPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [weightData, setWeightData] = React.useState(null);
  const [waterData, setWaterData] = React.useState(null);
  const [dietData, setDietData] = React.useState(null);
  const [workoutData, setWorkoutData] = React.useState(null);
  const [perfData, setPerfData] = React.useState(null);
  const [recoveryData, setRecoveryData] = React.useState(null);
  const settings = Storage.getSettings();

  React.useEffect(() => {
    setWeightData(Storage.get('weight', today));
    setWaterData(Storage.get('water', today));
    setDietData(Storage.get('diet', today));
    setWorkoutData(Storage.get('workout', today));
    setPerfData(Storage.get('performance', today));
    setRecoveryData(Storage.get('recovery', today));
  }, []);

  const waterPercent = waterData ? Math.round((waterData.amount / settings.waterGoal) * 100) : 0;
  const dietPercent = dietData ? dietData.adherence : 0;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">FitTrack</h1>
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        {settings.userName && <p className="text-gray-300 mt-1">Ola, {settings.userName}</p>}
      </div>

      {/* Peso */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Peso atual</p>
            <p className="text-2xl font-bold">{weightData ? `${weightData.value} kg` : '-- kg'}</p>
          </div>
          <span className="text-3xl">⚖️</span>
        </div>
      </div>

      {/* Agua */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-gray-400 text-sm">Agua</p>
            <p className="text-lg font-semibold">{waterData ? waterData.amount : 0} / {settings.waterGoal} ml</p>
          </div>
          <span className="text-3xl">💧</span>
        </div>
        <ProgressBar value={waterData ? waterData.amount : 0} max={settings.waterGoal} color="blue" showPercent={false} />
      </div>

      {/* Dieta */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-gray-400 text-sm">Dieta</p>
            <p className="text-lg font-semibold">{dietPercent}% aderencia</p>
          </div>
          <span className="text-3xl">🥗</span>
        </div>
        <ProgressBar value={dietPercent} max={100} color={dietPercent >= 80 ? 'green' : dietPercent >= 50 ? 'yellow' : 'red'} showPercent={false} />
      </div>

      {/* Treino */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Treino de hoje</p>
            <p className="text-lg font-semibold">
              {workoutData && workoutData.exercises && workoutData.exercises.length > 0
                ? `${workoutData.exercises.length} exercicio(s)`
                : 'Nenhum registrado'}
            </p>
          </div>
          <span className="text-3xl">🏋️</span>
        </div>
      </div>

      {/* Performance + Recovery row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-gray-400 text-xs">Performance</p>
          <p className="text-xl font-bold mt-1">{perfData ? `${perfData.rating}/5` : '--'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{perfData ? perfData.note || '' : ''}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-gray-400 text-xs">Recuperacao</p>
          {recoveryData ? (
            <>
              <p className={`text-xl font-bold mt-1 ${recoveryData.hasPain ? 'text-accent-red' : 'text-accent-green'}`}>
                {recoveryData.hasPain ? `Dor ${recoveryData.intensity}/10` : 'Sem dor'}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold mt-1">--</p>
          )}
        </div>
      </div>
    </div>
  );
};

window.DashboardPage = DashboardPage;
