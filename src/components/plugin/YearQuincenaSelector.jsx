import React from "react";

export const YearQuincenaSelector = ({
  yearS,
  yearFives,
  setYearS,
  q,
  quincena,
  handleQuincena,
  handlePrev,
  handleNext,
}) => {
  return (
    <div>
      {/* year */}
      <div className="flex items-center gap-2 my-2">
        <label htmlFor="">Seleccione El Año</label>
        {/* Botón anterior */}
        <button
          type="button"
          onClick={handlePrev}
          className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
        >
          ◀
        </button>

        {/* Select dinámico */}
        <select
          value={yearS}
          className="p-2 border rounded bg-gray-800"
          onChange={(e) => setYearS(Number(e.target.value))}
        >
          {yearFives.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Botón siguiente */}
        <button
          type="button"
          onClick={handleNext}
          className="px-3 py-1 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
        >
          ▶
        </button>
      </div>

      {/* quincenas */}
      <div className="flex items-center gap-2">
        <label htmlFor="">Seleccione La Quincena</label>
        <select
          className="p-2 border rounded bg-gray-800"
          value={quincena.name}
          onChange={(e) => {
            const qSelected = q.find((item) => item.name === e.target.value);
            if (qSelected) handleQuincena(qSelected);
          }}
        >
          <option value="" hidden>
            Seleccione
          </option>
          {q.map((quincena) => (
            <option
              key={quincena.id}
              value={quincena.name}
              className={`${quincena.cerrado ? "bg-red-500" : null}`}
            >
              {quincena.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
