import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"; // 👈 Importamos useEffect, useNavigate e Navigate
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

// 🧠 1. Criamos um componente interno apenas para gerenciar as rotas e o atalho
function AppRoutes() {
  const navigate = useNavigate();

  // 🕵️‍♂️ Escuta o teclado em busca do atalho secreto
  useEffect(() => {
    const handleSecretShortcut = (e) => {
      // Verifica se as teclas Ctrl + Shift + A foram pressionadas juntas
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault(); // Evita que o navegador abra algum menu padrão
        
        // 🚀 Teletransporta para a URL secreta do Admin
        navigate('/admin-secreto-garbo'); 
      }
    };

    window.addEventListener('keydown', handleSecretShortcut);

    return () => {
      window.removeEventListener('keydown', handleSecretShortcut);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* ROTA PÚBLICA: Landing Page */}
      <Route path="/" element={<Home />} />

      {/* 🛑 ARMADILHA: Se alguém tentar acessar /login, é redirecionado para a área do cliente */}
      <Route path="/login" element={<Navigate to="/area-cliente" replace />} />

      {/* ROTAS PÚBLICAS: Logins e Cadastros */}
      <Route path="/area-cliente" element={<ClientLogin />} />
      <Route path="/cadastro" element={<ClientRegister />} />

      {/* 🕵️‍♂️ ROTA SECRETA DO ADMIN: Só acessível pelo atalho Ctrl+Shift+A ou digitando a URL exata */}
      <Route path="/admin-secreto-garbo" element={<Login />} />

      {/* ROTA ADMIN PROTEGIDA: Painel de Administração */}
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
  );
}

// 🧠 2. O Componente App agora serve apenas como a "Casca" do sistema
function App() {
  return (
    <BrowserRouter basename="/garbo-ambientes-planejados">
      
      {/* O componente com o useNavigate agora está DENTRO do BrowserRouter! */}
      <AppRoutes /> 

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
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;