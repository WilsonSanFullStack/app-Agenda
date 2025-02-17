const festivosColombia = [
  "2025-01-01", // Año Nuevo
  "2025-01-06", // Reyes Magos (se traslada según la Ley Emiliani)
  "2025-03-24", // San José (se traslada según la Ley Emiliani)
  "2025-04-13", // Domingo de Ramos
  "2025-04-17", // Jueves Santo
  "2025-04-18", // Viernes Santo
  "2025-05-01", // Día del Trabajo
  "2025-06-02", // Ascensión de Jesús (se traslada según la Ley Emiliani)
  "2025-06-23", // Corpus Christi (se traslada según la Ley Emiliani)
  "2025-06-30", // Sagrado Corazón (se traslada según la Ley Emiliani)
  "2025-07-20", // Día de la Independencia
  "2025-08-07", // Batalla de Boyacá
  "2025-08-18", // Asunción de la Virgen (se traslada según la Ley Emiliani)
  "2025-10-13", // Día de la Raza (se traslada según la Ley Emiliani)
  "2025-11-03", // Todos los Santos (se traslada según la Ley Emiliani)
  "2025-11-17", // Independencia de Cartagena (se traslada según la Ley Emiliani)
  "2025-12-08", // Inmaculada Concepción
  "2025-12-25", // Navidad
];

// Convertir a objetos `Date` para comparar
const festivosSet = new Set(festivosColombia.map(date => new Date(date).toDateString()));
export default festivosSet
