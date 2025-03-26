import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Navbar } from "./components/plugin/Navbar.jsx";
import { Home } from "./components/view/Home.jsx";
import { Dia } from "./components/utils/Dia.jsx";
import { Quincena } from "./components/utils/Quincena.jsx";
import { Creditos } from "./components/utils/Creditos.jsx";
import { Page } from "./components/utils/Page.jsx";
import { Moneda } from "./components/utils/Moneda.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    window.Electron?.onAbrirRegistroQuincena(() => {
      console.log("Cambiando vista a Registro Quincena");
      navigate("/register/quincena"); // 🔹 Cambia la vista
    });
  }, []);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/quincena" element={<Quincena />} />
        <Route path="/register/dia" element={<Dia />} />
        <Route path="/register/creditos" element={<Creditos />} />
        <Route path="/register/pagina" element={<Page />} />
        <Route path="/register/moneda" element={<Moneda />} />
      </Routes>
    </div>
  );
}

export default App;
