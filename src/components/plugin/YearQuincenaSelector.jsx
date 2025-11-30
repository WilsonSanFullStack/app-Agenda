import React from "react";

export const YearQuincenaSelector = ({
  yearS,
  yearFives = [],
  setYearS,
  q = [],
  quincena = {},
  handleQuincena,
  handlePrev,
  handleNext,
  disabled = false
}) => {
  // 🔧 FUNCIONES REUTILIZABLES
  const handleApiResponse = (response) => {
    return Array.isArray(response) ? response : [];
  };

  // 🔧 DATOS PROTEGIDOS
  const safeYearFives = handleApiResponse(yearFives);
  const safeQ = handleApiResponse(q);
  const safeQuincena = quincena && typeof quincena === 'object' ? quincena : {};

  // 🔧 MANEJADORES SEGUROS
  const handleYearChange = (e) => {
    if (disabled) return;
    const year = Number(e.target.value);
    if (!isNaN(year) && year > 0) {
      setYearS(year);
    }
  };

  const handleQuincenaChange = (e) => {
    if (disabled) return;
    
    const selectedName = e.target.value;
    const qSelected = safeQ.find((item) => item?.name === selectedName);
    
    if (qSelected && handleQuincena) {
      handleQuincena(qSelected);
    }
  };

  return (
    <div className="space-y-4">
      {/* Año */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">
          Seleccione El Año
        </label>
        <div className="flex items-center gap-2">
          {/* Botón anterior */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={disabled}
            className={`px-3 py-2 text-white rounded-lg transition ${
              disabled 
                ? "bg-slate-600 cursor-not-allowed opacity-50" 
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            ◀
          </button>

          {/* Select dinámico */}
          <select
            value={yearS}
            onChange={handleYearChange}
            disabled={disabled || safeYearFives.length === 0}
            className={`p-2 border rounded flex-1 ${
              disabled || safeYearFives.length === 0
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-slate-800 text-white border-slate-600"
            }`}
          >
            {safeYearFives.length === 0 ? (
              <option value="">No hay años disponibles</option>
            ) : (
              safeYearFives.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            )}
          </select>

          {/* Botón siguiente */}
          <button
            type="button"
            onClick={handleNext}
            disabled={disabled}
            className={`px-3 py-2 text-white rounded-lg transition ${
              disabled 
                ? "bg-slate-600 cursor-not-allowed opacity-50" 
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Quincenas */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">
          Seleccione La Quincena
        </label>
        <select
          value={safeQuincena.name || ""}
          onChange={handleQuincenaChange}
          disabled={disabled || safeQ.length === 0}
          className={`p-2 border rounded ${
            disabled || safeQ.length === 0
              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
              : "bg-slate-800 text-white border-slate-600"
          }`}
        >
          <option value="" hidden>
            {safeQ.length === 0 ? "No hay quincenas disponibles" : "Seleccione una quincena"}
          </option>
          {safeQ.map((quincenaItem) => (
            <option
              key={quincenaItem?.id}
              value={quincenaItem?.name}
              className={`${
                quincenaItem?.cerrado 
                  ? "bg-red-500 text-white" 
                  : "text-white"
              }`}
            >
              {quincenaItem?.name || "Quincena sin nombre"}
              {quincenaItem?.cerrado ? " 🔒" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Información de la quincena seleccionada */}
      {safeQuincena.name && !disabled && (
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-slate-400">Quincena:</div>
            <div className="text-emerald-300 font-semibold">
              {safeQuincena.name}
            </div>
            
            <div className="text-slate-400">Estado:</div>
            <div className={`font-semibold ${
              safeQuincena.cerrado ? "text-red-400" : "text-green-400"
            }`}>
              {safeQuincena.cerrado ? "🔒 Cerrada" : "🔓 Abierta"}
            </div>
            
            {safeQuincena.dias && Array.isArray(safeQuincena.dias) && (
              <>
                <div className="text-slate-400">Días registrados:</div>
                <div className="text-slate-300">
                  {safeQuincena.dias.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Estado cuando no hay datos */}
      {safeQ.length === 0 && !disabled && (
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            No hay quincenas disponibles para el año {yearS}
          </p>
        </div>
      )}

      {safeYearFives.length === 0 && !disabled && (
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            No hay años disponibles para seleccionar
          </p>
        </div>
      )}
    </div>
  );
};