import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/AdminLogin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import ClientPrivateRoute from "./components/ClientPrivateRoute";
import Home from "./pages/Home/Home";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import ClientLogin from "./pages/ClientLogin/ClientLogin";
import ClientRegister from "./pages/ClientRegister/ClientRegister";

// Você precisará criar este arquivo AdminDashboard.jsx depois, 
// movendo aquele código do painel de Admin pra dentro dele.
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTA PÚBLICA: Landing Page */}
        <Route path="/" element={<Home />} />

        {/* ROTAS PÚBLICAS: Logins e Cadastros */}
        <Route path="/login" element={<Login />} />
        <Route path="/area-cliente" element={<ClientLogin />} />
        <Route path="/cadastro" element={<ClientRegister />} />

        {/* ROTA ADMIN: Painel de Administração Limpo */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard /> 
            </PrivateRoute>
          }
        />

        {/* ROTA PROTEGIDA DO CLIENTE: O Dashboard VIP */}
        <Route
          path="/meu-projeto"
          element={
            <ClientPrivateRoute>
              <ClientDashboard />
            </ClientPrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;