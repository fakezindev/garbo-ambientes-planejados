import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/AdminLogin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import ClientPrivateRoute from "./components/ClientPrivateRoute";
import Home from "./pages/Home/Home";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import ClientLogin from "./pages/ClientLogin/ClientLogin";
import ClientRegister from "./pages/ClientRegister/ClientRegister";
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

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Pode mudar para "light" ou "colored" se preferir
      />
    </BrowserRouter>
  );
}

export default App;