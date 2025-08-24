import React, { useEffect } from "react";

export const ErrorAlert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // se cierra después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo semi-transparente */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Caja del error */}
      <div className="relative bg-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-lg text-center max-w-md w-full">
        <p className="font-semibold text-lg">{message}</p>
        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};


