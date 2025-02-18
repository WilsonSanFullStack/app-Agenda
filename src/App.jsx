import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { RegisterQ } from "./components/RegisterQ";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/quincena" element={<registerQ />} />
        <Route path="/" element={<RegisterQ />} />
      </Routes>
    </div>
  );
}

export default App;
