// import React, { useEffect, useState } from "react";

// const postMoneda = async (data) => {
//   try {
//     const moneda = await window.Electron.addMoneda(data);
//     if (moneda.error) {
//       console.log(error);
//     } else {
//       console.log(moneda);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
// const getAllQuincena = async () => {
//   try {
//     const res = await window.Electron.getQuincena();
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const Moneda = () => {
//   const [monedas, setModenas] = useState({
//     dolar: null,
//     euro: null,
//     lb: null,
//     pago: false,
//     quincena: null,
//   });
//   console.log(monedas);
//   const [q, setQ] = useState([]);
//   const [quincena, setQuincena] = useState({});
//   useEffect(() => {
//     const quincenas = async () => {
//       const quincenas = await getAllQuincena();
//       setQ(quincenas);
//     };
//     quincenas();
//   }, []);
//   const handleQuincena = (e) => {
//     const quincena = q.find((x) => x.name === e.target.value);
//     if (quincena) {
//       setModenas({ ...monedas, quincena: quincena.id });
//     }
//   };
//   const handleDolar = (e) => {
//     setModenas({ ...monedas, dolar: e.target.value });
//   };
//   const handleEuro = (e) => {
//     setModenas({ ...monedas, euro: e.target.value });
//   };
//   const handleLb = (e) => {
//     setModenas({ ...monedas, lb: e.target.value });
//   };
//   const handleChecked = (e) => {
//     setModenas({ ...monedas, pago: e.target.checked });
//   };
//   const handleMoneda = async () => {
//     await postMoneda(monedas);
//     setModenas({
//       dolar: null,
//       euro: null,
//       lb: null,
//       pago: false,
//       quincena: null,
//     });
//   };
//   return (
//     <div className="text-center pt-12" key={"1234"}>
//       <h1 className="text-4xl uppercase m-2 mb-6">registro de monedas</h1>
//       <section>
//         <select
//           value={quincena.name}
//           onChange={handleQuincena}
//           className="bg-slate-950 m-1 rounded-md p-1"
//         >
//           <option value="" hidden>
//             Seleccione una quincena
//           </option>
//           {q?.map((q) => {
//             return (
//               <option key={q.id} value={q.name}>
//                 {q.name}
//               </option>
//             );
//           })}
//         </select>
//       </section>
//       <form
//         onSubmit={handleMoneda}
//         className="flex-col justify-center items-center"
//       >
//         <section className="m-2 p-2 border-4 border-slate-800 rounded-xl w-fit mx-auto">
//           <div className=" grid grid-cols-2">
//             <label className="m-2 text-2xl" htmlFor="dolar">
//               Dolar
//             </label>
//             <input
//               id="dolar"
//               onWheel={(e) => e.target.blur()}
//               value={monedas.dolar ?? ""}
//               onChange={handleDolar}
//               type="number"
//               className="bg-slate-950 no-spin h-8 text-2xl w-32 text-center"
//               onKeyDown={(e) => {
//                 if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//                   e.preventDefault(); // Bloquea flechas del teclado
//                 }
//               }}
//             />
//           </div>
//           <div className="m-1 p-1 grid grid-cols-2">
//             <label className="m-2 text-2xl" htmlFor="euro">
//               Euro
//             </label>
//             <input
//               id="euro"
//               onWheel={(e) => e.target.blur()}
//               value={monedas.euro ?? ""}
//               onChange={handleEuro}
//               type="number"
//               className="bg-slate-950 no-spin h-8 text-2xl w-32 text-center"
//               onKeyDown={(e) => {
//                 if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//                   e.preventDefault(); // Bloquea flechas del teclado
//                 }
//               }}
//             />
//           </div>
//           <div className="m-1 p-1 grid grid-cols-2">
//             <label className="m-2 text-2xl" htmlFor="lb">
//               Libra Esterlina
//             </label>
//             <input
//               id="lb"
//               onWheel={(e) => e.target.blur()}
//               value={monedas.lb ?? ""}
//               onChange={handleLb}
//               type="number"
//               className="bg-slate-950 no-spin h-8 text-2xl w-32 text-center"
//               onKeyDown={(e) => {
//                 if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//                   e.preventDefault(); // Bloquea flechas del teclado
//                 }
//               }}
//             />
//           </div>
//           <div className="m-1 p-1 grid grid-cols-2">
//             <label className="m-2 text-2xl" htmlFor="pago">
//               Marque si es para pago
//             </label>
//             <input
//               id="pago"
//               checked={monedas.pago}
//               onChange={handleChecked}
//               type="checkbox"
//               className="h-8 w-32"
//             />
//           </div>
//         </section>
//         <section>
//           {monedas.dolar !== "" &&
//           monedas.dolar !== null &&
//           monedas.euro !== "" &&
//           monedas.euro !== null &&
//           monedas.lb !== "" &&
//           monedas.lb !== null &&
//           monedas.quincena !== "" &&
//           monedas.quincena !== null ? (
//             <button
//               type="submit"
//               className=" text-2xl  border-2 border-slate-700 m-2 p-2 rounded-lg bg-slate-950 hover:bg-emerald-500 active:bg-sky-500 "
//             >
//               Cargar
//             </button>
//           ) : null}
//         </section>
//       </form>
//     </div>
//   );
// };
