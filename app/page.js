'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
  
// --- Componentes que esta página va a mostrar ---
import LoginForm from '@/app/components/LoginForm';
import DashboardHome from '@/app/components/DashboardHome';
import DashboardDetail from '@/app/components/DashboardDetail'; // <-- ¡NUEVO!

// --- Fin de Datos Falsos --- We will fetch this from the backend now ---

// =============================================
// --- Componente del Header ---
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
  
  // --- ESTADO DE DATOS ---
  const [dashboards, setDashboards] = useState([]);
  const [error, setError] = useState(null);

  // --- ESTADO DEL "DIRECTOR" (Navegación) ---
  const [view, setView] = useState('home'); // 'home' o 'dashboard'
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('SEDECYT Analytics');

  // --- LÓGICA DEL "PORTERO" ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        try {
          // Fetch dashboards only if the user is logged in
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setDashboards(data);
        } catch (e) {
          console.error("Failed to fetch dashboards:", e);
          setError("No se pudieron cargar los dashboards. Intenta de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      } else {
        // If there's no session, we're not loading dashboard data, so stop loading.
        setLoading(false);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_OUT') {
          setHeaderTitle('Bienvenido a SEDECYT');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // --- LÓGICA DEL "DIRECTOR" ---
  const handleDashboardSelect = (dashboard) => {
    // Buscamos el dashboard completo en nuestros datos
    const fullDashboardData = dashboards.find(d => d.id === dashboard.id);
    setSelectedDashboard(fullDashboardData);
    setHeaderTitle(fullDashboardData.title);
    setView('dashboard');
    console.log("Mostrando dashboard:", fullDashboardData.id);
  };

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
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <AppHeader
        title={headerTitle}
        onLogout={handleLogout}
        session={session}
      />

      <main className="mainContainer">
        {!session ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            {view === 'home' && (
              // Le pasamos la lista de dashboards
              <DashboardHome
                dashboards={dashboards}
                onDashboardSelect={handleDashboardSelect} 
              />
            )}
            
            {view === 'dashboard' && (
              // ¡Renderizamos el nuevo componente de Detalle!
              <DashboardDetail
                selectedDashboard={selectedDashboard}
                allDashboards={dashboards}
                onGoHome={handleGoHome}
                onDashboardSelect={handleDashboardSelect} // Para la sidebar
              />
            )}
          </>
        )}
      </main>
    </>
  );
}



// DISEÑO
// boton DE DESCARGAR CADA DASHBOARD
// FUNCOIN PARA HACER GRANDE CADA GRAFICA
// BOTON DESCARGAR CADA GRAFICA
// TUS PROPIAS IDEAS. LIBERTAD CREATIVA ( TRATA DE NO METER ERRORES :) )