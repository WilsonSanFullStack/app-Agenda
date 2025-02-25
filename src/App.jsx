import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { RegisterQ } from "./components/RegisterQ.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/quincena" element={<RegisterQ />} />
        {/* <Route path="/algo" element={<RegisterQ />} /> */}
      </Routes>
    </div>
  );
}

export default App;
