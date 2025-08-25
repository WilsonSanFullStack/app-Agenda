

export function quincenas (yearC, q){
    const quincena = [];
    const meses = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("es-ES", { month: "long" })
    );

    meses.forEach((mes, index) => {
      const year = yearC;
      const ultimoDiaMes = new Date(year, index + 1, 0).getDate();

      if (!q?.some((x) => x.name === `${mes}-1-${year}`)) {
        quincena.push({
          year,
          name: `${mes}-1-${year}`,
          inicio: new Date(year, index, 1),
          fin: new Date(year, index, 15),
        });
      }
      if (!q?.some((x) => x.name === `${mes}-2-${year}`)) {
        quincena.push({
          year,
          name: `${mes}-2-${year}`,
          inicio: new Date(year, index, 16),
          fin: new Date(year, index, ultimoDiaMes),
        });
      }
    });

    return quincena;
  };

export function generarDias(quincena) {
  const { inicio, fin } = quincena;

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const yearCorto = quincena.year.toString().slice(-2);
  const nombreMes = meses[inicio.getMonth()]; // ejemplo: marzo

  let dias = [];
  let fechaActual = new Date(inicio);

  while (fechaActual <= fin) {
    const dia = fechaActual.getDate();
    dias.push(`${nombreMes}-${dia}-${yearCorto}`);

    // avanzar un día
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return dias;
}

export function getQuincenaAnterior(periodo) {
  const [mes, quincena, year] = periodo.split("-");

  if (quincena === "2") {
    return `${mes}-1-${year}`;
  }

  // Si es -1- no hay quincena anterior
  return null;
}

