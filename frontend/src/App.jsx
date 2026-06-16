import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AbfallABC from "./pages/AbfallABC";
import Map from "./pages/Map";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/map" element={<Map />} />
        <Route path="/abfall-abc" element={<AbfallABC />} />
      </Routes>
    </>
  );
}

export default App;