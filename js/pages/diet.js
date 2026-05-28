const DietPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const settings = Storage.getSettings();
  const [meals, setMeals] = React.useState([]);
  const [showEdit, setShowEdit] = React.useState(false);
  const [mealNames, setMealNames] = React.useState(settings.meals || []);
  const [newMeal, setNewMeal] = React.useState('');

  const loadData = () => {
    const data = Storage.get('diet', today);
    if (data) {
      setMeals(data.meals);
    } else {
      const initial = mealNames.map(name => ({ name, done: false }));
      setMeals(initial);
    }
  };

  React.useEffect(loadData, []);

  const toggleMeal = (index) => {
    const updated = [...meals];
    updated[index].done = !updated[index].done;
    setMeals(updated);
    saveData(updated);
  };

  const saveData = (updatedMeals) => {
    const doneCount = updatedMeals.filter(m => m.done).length;
    const adherence = updatedMeals.length > 0 ? Math.round((doneCount / updatedMeals.length) * 100) : 0;
    Storage.save('diet', { meals: updatedMeals, adherence }, today);
  };

  const addMealName = () => {
    if (!newMeal.trim()) return;
    const updated = [...mealNames, newMeal.trim()];
    setMealNames(updated);
    const s = Storage.getSettings();
    s.meals = updated;
    Storage.saveSettings(s);
    setNewMeal('');
    // Also add to today's meals
    const updatedMeals = [...meals, { name: newMeal.trim(), done: false }];
    setMeals(updatedMeals);
    saveData(updatedMeals);
  };

  const removeMealName = (index) => {
    const updated = mealNames.filter((_, i) => i !== index);
    setMealNames(updated);
    const s = Storage.getSettings();
    s.meals = updated;
    Storage.saveSettings(s);
  };

  const doneCount = meals.filter(m => m.done).length;
  const adherence = meals.length > 0 ? Math.round((doneCount / meals.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🥗 Controle de Dieta</h2>
        <button onClick={() => setShowEdit(!showEdit)} className="text-sm text-accent-blue">
          {showEdit ? 'Fechar' : 'Editar refeicoes'}
        </button>
      </div>

      {/* Edit meals list */}
      {showEdit && (
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
          <p className="text-sm text-gray-400 mb-2">Refeicoes configuradas</p>
          <div className="space-y-2 mb-3">
            {mealNames.map((name, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-sm">{name}</span>
                <button onClick={() => removeMealName(i)} className="text-accent-red text-xs">remover</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
              placeholder="Nova refeicao"
              className="flex-1 bg-dark-700 rounded-lg px-3 py-2 text-white text-sm border border-dark-600 focus:border-accent-blue focus:outline-none"
            />
            <button onClick={addMealName} className="bg-accent-green text-white px-3 py-2 rounded-lg text-sm">Adicionar</button>
          </div>
        </div>
      )}

      {/* Adherence summary */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-300">Aderencia hoje</p>
          <p className={`text-2xl font-bold ${adherence >= 80 ? 'text-accent-green' : adherence >= 50 ? 'text-accent-yellow' : 'text-accent-red'}`}>
            {adherence}%
          </p>
        </div>
        <ProgressBar value={adherence} max={100} color={adherence >= 80 ? 'green' : adherence >= 50 ? 'yellow' : 'red'} showPercent={false} />
        <p className="text-xs text-gray-400 mt-2">{doneCount} de {meals.length} refeicoes realizadas</p>
      </div>

      {/* Meals checklist */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-600">
        <p className="text-sm text-gray-400 mb-3">Refeicoes de hoje</p>
        <div className="space-y-2">
          {meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => toggleMeal(index)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                meal.done
                  ? 'bg-accent-green/10 border-accent-green/30'
                  : 'bg-dark-700 border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                meal.done ? 'border-accent-green bg-accent-green' : 'border-gray-500'
              }`}>
                {meal.done && <span className="text-xs text-white">✓</span>}
              </div>
              <span className={`text-sm ${meal.done ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                {meal.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.DietPage = DietPage;
