import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserProgress from "./components/UserProgress";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user/:username" element={<UserProgress />} />
      </Routes>
    </BrowserRouter>
  );
}
