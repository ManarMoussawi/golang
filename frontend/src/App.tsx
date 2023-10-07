import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/table" element={<Table />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
