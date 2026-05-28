const App = () => {
  const [page, setPage] = React.useState('dashboard');
  const [showMenu, setShowMenu] = React.useState(false);
  const settings = Storage.getSettings();
  const [userName, setUserName] = React.useState(settings.userName || '');
  const [showLogin, setShowLogin] = React.useState(!settings.userName);

  const handleLogin = () => {
    if (!userName.trim()) return;
    const s = Storage.getSettings();
    s.userName = userName.trim();
    Storage.saveSettings(s);
    setShowLogin(false);
  };

  // Handle "more" menu pages
  const morePages = ['diet', 'performance', 'recovery', 'history', 'settings'];
  const isMorePage = morePages.includes(page);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'weight': return <WeightPage />;
      case 'water': return <WaterPage />;
      case 'workout': return <WorkoutPage />;
      case 'diet': return <DietPage />;
      case 'performance': return <PerformancePage />;
      case 'recovery': return <RecoveryPage />;
      case 'history': return <HistoryPage />;
      default: return <DashboardPage />;
    }
  };

  // Login screen
  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">FitTrack</h1>
            <p className="text-gray-400">Seu acompanhamento fitness pessoal</p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-dark-800 rounded-xl px-4 py-3 text-white border border-dark-600 focus:border-accent-blue focus:outline-none text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-accent-blue text-white py-3 rounded-xl font-medium hover:opacity-90"
            >
              Comecar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-20 pt-4 px-4">
      {renderPage()}

      {/* More menu overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center" onClick={() => setShowMenu(false)}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl p-4 pb-24 border-t border-dark-600" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-dark-600 rounded-full mx-auto mb-4"></div>
            <div className="space-y-1">
              {[
                { id: 'diet', icon: '🥗', label: 'Controle de Dieta' },
                { id: 'performance', icon: '💪', label: 'Performance' },
                { id: 'recovery', icon: '🩹', label: 'Recuperacao / Lesao' },
                { id: 'history', icon: '📅', label: 'Historico' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setPage(item.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors text-left"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Navbar
        activePage={isMorePage ? 'more' : page}
        setPage={(p) => {
          if (p === 'more') {
            setShowMenu(!showMenu);
          } else {
            setPage(p);
            setShowMenu(false);
          }
        }}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
