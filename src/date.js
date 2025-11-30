//funcion para generar 5 years atras y 5 years adelante del puntero seleccionado
//recibe un numero con el year central
export function yearsFive(year) {
  const years = Array?.from({ length: 11 }, (_, i) => year - 5 + i);
  return years;
}
//funcion que genera las quincena que no estan registradas de todo un year
//recibe el year y el array de quincenas registradas
export function quincenasYear(yearC, q) {
  const safeQ = Array.isArray(q) ? q : [];
  const quincena = [];
  const meses = Array?.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleString("es-ES", { month: "long" })
  );

  meses?.forEach((mes, index) => {
    const year = yearC;
    const ultimoDiaMes = new Date(year, index + 1, 0).getDate();

    if (!safeQ?.some((x) => x.name === `${mes}-1-${year}`)) {
      quincena.push({
        year,
        name: `${mes}-1-${year}`,
        inicio: new Date(year, index, 1),
        fin: new Date(year, index, 15),
      });
    }
    if (!safeQ?.some((x) => x.name === `${mes}-2-${year}`)) {
      quincena.push({
        year,
        name: `${mes}-2-${year}`,
        inicio: new Date(year, index, 16),
        fin: new Date(year, index, ultimoDiaMes),
      });
    }
  });

  return quincena;
}
//funcion que genera los dias de una quincena
//se recibe objeto con las propiedades de una quincena name inicio fin year
export function generarDias(quincena) {
  if (
    quincena?.inicio !== null &&
    quincena?.year !== null &&
    quincena?.fin !== null &&
    quincena?.name !== ""
  ) {
    // const { inicio, fin } = quincena;
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const yearCorto = quincena?.year?.toString()?.slice(-2);
    const nombreMes = meses[quincena?.inicio?.getMonth()]; // ejemplo: marzo

    let dias = [];
    let fechaActual = new Date(quincena?.inicio);

    while (fechaActual <= quincena?.fin) {
      const dia = fechaActual.getDate();
      dias.push(`${dia}-${nombreMes}-${yearCorto}`);

      // avanzar un día
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return dias;
  }
}
// console.log(generarDias());
export function getQuincenaAnterior(periodo) {
  const [mes, quincena, year] = periodo.split("-");

  if (quincena === "2") {
    return `${mes}-1-${year}`;
  }

  // Si es -1- no hay quincena anterior
  return null;
}


