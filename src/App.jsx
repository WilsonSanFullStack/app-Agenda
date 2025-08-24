import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Navbar } from "./components/plugin/Navbar.jsx";
import { Home } from "./components/view/Home.jsx";
// import { Dia } from "./components/utils/Dia.jsx";
import { Quincena } from "./components/utils/Quincena.jsx";
import {ErrorAlert} from "./components/plugin/ErrorAlert.jsx";
import { Page } from "./components/utils/Page.jsx";
// import { Moneda } from "./components/utils/Moneda.jsx";

function App() {
  const navigate = useNavigate();
 const [error, setError] = useState(""); // estado global de errores
  useEffect(() => {
    window.Electron?.onAbrirRegistroQuincena(() => {
      console.log("Cambiando vista a Registro Quincena");
      navigate("/register/quincena"); // 🔹 Cambia la vista
    });
  }, []);
  return (
    <div className="p-2">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <ErrorAlert message={error} onClose={() => setError("")} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/quincena" element={<Quincena setError={setError}/>} />
        {/* <Route path="/register/dia" element={<Dia />} /> */}
        <Route path="/register/pagina" element={<Page setError={setError}/>} />
        {/* <Route path="/register/moneda" element={<Moneda />} /> */}
      </Routes>
    </div>
  );
}

export default App;
