const ChartComponent = ({ type = 'line', data, options = {}, height = '200px' }) => {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          ...options.plugins
        },
        scales: {
          x: {
            ticks: { color: '#8b949e', font: { size: 10 } },
            grid: { color: '#21262d' }
          },
          y: {
            ticks: { color: '#8b949e', font: { size: 10 } },
            grid: { color: '#21262d' }
          },
          ...options.scales
        },
        ...options
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type]);

  return (
    <div style={{ height }} className="w-full">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

window.ChartComponent = ChartComponent;
