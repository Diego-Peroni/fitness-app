const Navbar = ({ activePage, setPage }) => {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Home' },
    { id: 'weight', icon: '⚖️', label: 'Peso' },
    { id: 'water', icon: '💧', label: 'Agua' },
    { id: 'workout', icon: '🏋️', label: 'Treino' },
    { id: 'more', icon: '⋯', label: 'Mais' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
              activePage === tab.id ? 'text-accent-blue' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

window.Navbar = Navbar;
