import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Chats from "./Pages/Chats.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import "./Css/App.css";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
