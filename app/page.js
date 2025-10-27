'use client'; // ¡Es un componente de cliente!

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

// --- Componentes que esta página va a mostrar ---
import LoginForm from '@/app/components/LoginForm';
import DashboardHome from '@/app/components/DashboardHome';
// (Próximamente importaremos el DashboardDetail aquí)

// =============================================
// --- Componente del Header ---
// Lo definimos AQUÍ para que pueda recibir el 'headerTitle'
// y la función 'handleLogout' desde nuestro 'page.js'
// =============================================
function AppHeader({ title, onLogout, session }) {
  return (
    <header className="appHeader">
      {/* Lado Izquierdo: Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/logo-sedec.png"
          alt="Logo SEDECYT"
          width={180}
          height={60}
          priority
        />
      </div>

      {/* Centro: Título Dinámico */}
      <div className="headerTitle">
        <h2>{title}</h2>
      </div>

      {/* Lado Derecho: Botones de Utilidad y Logout */}
      <div className="headerActions">
        {/* Mostramos el botón de Logout solo si hay una sesión activa */}
        {session && (
          <button onClick={onLogout} className="headerButton">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

// =============================================
// --- La Página Principal (El "Cerebro") ---
// =============================================
export default function Page() {
  // --- ESTADO DEL "PORTERO" (Autenticación) ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADO DEL "DIRECTOR" (Navegación) ---
  const [view, setView] = useState('home'); // 'home' o 'dashboard'
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('SEDECYT Analytics');

  // --- LÓGICA DEL "PORTERO" ---
  useEffect(() => {
    // 1. Ver si ya hay una sesión
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      // Si hay sesión, seteamos el título de home
      if (session) {
        setHeaderTitle('Resumen de Dashboards');
      } else {
        setHeaderTitle('Bienvenido a SEDECYT');
      }
    };
    getSession();

    // 2. Escuchar cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Si el usuario acaba de hacer login, lo mandamos a 'home'
        if (_event === 'SIGNED_IN') {
          setView('home');
          setHeaderTitle('Resumen de Dashboards');
        }
        // Si acaba de hacer logout, reseteamos el título
        if (_event === 'SIGNED_OUT') {
          setHeaderTitle('Bienvenido a SEDECYT');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []); // El array vacío [] significa: "corre esto solo 1 vez"

  // --- LÓGICA DEL "DIRECTOR" ---

  // Esta función se la pasaremos al componente 'DashboardHome'
  const handleDashboardSelect = (dashboard) => {
    setSelectedDashboard(dashboard); // Guardamos el dashboard elegido
    setHeaderTitle(dashboard.title); // ¡Cambiamos el título!
    setView('dashboard'); // ¡Cambiamos la vista!
    console.log("Mostrando dashboard:", dashboard.id);
  };

  // Esta función se la pasaremos a 'DashboardDetail' (en el futuro)
  const handleGoHome = () => {
    setSelectedDashboard(null);
    setHeaderTitle('Resumen de Dashboards');
    setView('home');
    console.log("Volviendo a Home");
  };

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const handleLogin = (session) => {
    setSession(session);
  };

  // --- RENDERIZADO ---

  // 1. Muestra "Cargando..." mientras el "Portero" revisa la sesión
  if (loading) {
    return <div>Cargando...</div>; // TODO: Poner un spinner bonito aquí
  }

  // 2. El "Portero" y "Director" deciden qué mostrar
  return (
    <>
      {/* El Header siempre se muestra, pero su título y botones cambian */}
      <AppHeader
        title={headerTitle}
        onLogout={handleLogout}
        session={session}
      />

      {/* El 'mainContainer' centra todo (definido en globals.css) */}
      <main className="mainContainer">
        {!session ? (
          // A. Si NO hay sesión, el "Portero" muestra el Login
          <LoginForm onLogin={handleLogin} />
        ) : (
          // B. Si SÍ hay sesión, el "Director" decide qué vista mostrar
          <>
            {view === 'home' && (
              <DashboardHome onDashboardSelect={handleDashboardSelect} />
            )}
            
            {view === 'dashboard' && (
              // ¡Aquí irá nuestro siguiente componente!
              <div>
                <h2>Mostrando el Dashboard: {selectedDashboard.title}</h2>
                <button onClick={handleGoHome}>← Volver a Inicio</button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

