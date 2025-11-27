import React, { useEffect, useCallback } from "react";

export const ErrorAlert = ({ message, onClose, duration = 5000 }) => {
  // 🔧 PROTECCIÓN: Validar props
  const safeMessage = message && typeof message === 'string' ? message : '';
  const safeOnClose = typeof onClose === 'function' ? onClose : () => {};
  const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 5000;

  // 🔧 Cerrar automáticamente después del tiempo especificado
  useEffect(() => {
    if (safeMessage) {
      const timer = setTimeout(() => {
        safeOnClose();
      }, safeDuration);
      
      return () => clearTimeout(timer);
    }
  }, [safeMessage, safeDuration, safeOnClose]);

  // 🔧 Cerrar con Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && safeMessage) {
        safeOnClose();
      }
    };

    if (safeMessage) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [safeMessage, safeOnClose]);

  // 🔧 Cerrar al hacer click fuera
  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      safeOnClose();
    }
  }, [safeOnClose]);

  // 🔧 No renderizar si no hay mensaje
  if (!safeMessage) return null;

  // 🔧 Determinar tipo de alerta basado en el mensaje
  const getAlertType = (msg) => {
    if (msg.includes('✅') || msg.includes('correctamente') || msg.includes('éxito')) {
      return 'success';
    } else if (msg.includes('⚠️') || msg.includes('advertencia') || msg.includes('atención')) {
      return 'warning';
    } else if (msg.includes('🔍') || msg.includes('info') || msg.includes('información')) {
      return 'info';
    } else {
      return 'error';
    }
  };

  const alertType = getAlertType(safeMessage);

  // 🔧 Configuración de estilos por tipo
  const alertStyles = {
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700',
      icon: '❌'
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700',
      icon: '✅'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'ℹ️'
    }
  };

  const currentStyle = alertStyles[alertType];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Fondo semi-transparente con animación */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>

      {/* Contenedor de alerta con animación */}
      <div 
        className={`
          relative 
          ${currentStyle.bg} 
          ${currentStyle.text}
          border-2
          px-6 py-5 
          rounded-2xl 
          shadow-2xl
          max-w-md 
          w-full
          transform 
          transition-all 
          duration-300
          scale-95
          hover:scale-100
        `}
        role="alert"
        aria-live="assertive"
      >
        {/* Icono y mensaje */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">{currentStyle.icon}</span>
          <p className="font-semibold text-lg leading-relaxed break-words">
            {safeMessage}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
          <div 
            className={`h-1 rounded-full transition-all duration-100 ${currentStyle.button.replace('bg-', 'bg-').replace('hover:bg-', '')}`}
            style={{ 
              width: '100%',
              animation: `shrink ${safeDuration}ms linear forwards`
            }}
          ></div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <button
            onClick={safeOnClose}
            className={`
              px-5 py-2 
              text-white 
              rounded-lg 
              font-medium
              transition-all 
              duration-200
              transform
              hover:scale-105
              active:scale-95
              ${currentStyle.button}
            `}
          >
            Aceptar
          </button>
        </div>

        {/* Botón de cerrar (X) */}
        <button
          onClick={safeOnClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Cerrar alerta"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Estilos para la animación de la barra de progreso */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// 🔧 Componente de uso recomendado
export const useErrorAlert = () => {
  const [error, setError] = React.useState('');

  const showError = React.useCallback((message) => {
    setError(message);
  }, []);

  const hideError = React.useCallback(() => {
    setError('');
  }, []);

  const ErrorAlertComponent = React.useMemo(() => (
    <ErrorAlert message={error} onClose={hideError} />
  ), [error, hideError]);

  return {
    error: error,
    showError,
    hideError,
    ErrorAlertComponent
  };
};