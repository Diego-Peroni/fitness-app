const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div
        className="relative bg-dark-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-dark-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-dark-800 flex justify-between items-center p-4 border-b border-dark-600">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-1">✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

window.Modal = Modal;
