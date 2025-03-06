import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RegisterQ } from "./components/registerQ.jsx";
import { Navbar } from "./components/Navbar.jsx";

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
        <Route path="/register/quincena" element={<RegisterQ />} />
        {/* <Route path="/algo" element={<RegisterQ />} /> */}
      </Routes>
    </div>
  );
}

export default App;
