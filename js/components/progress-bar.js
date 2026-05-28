const ProgressBar = ({ value, max, label, color = 'blue', showPercent = true }) => {
  const percent = Math.min((value / max) * 100, 100);
  const colorMap = {
    blue: 'bg-accent-blue',
    green: 'bg-accent-green',
    red: 'bg-accent-red',
    yellow: 'bg-accent-yellow'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          {showPercent && (
            <span className="text-sm text-gray-400">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color] || colorMap.blue}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

window.ProgressBar = ProgressBar;
