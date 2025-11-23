'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoginForm from './components/LoginForm';
import DashboardHome from './components/DashboardHome';
import DashboardDetail from './components/DashboardDetail';
import AppHeader from './components/AppHeader';

// 1. Definimos el "fetcher" (el mensajero) fuera del componente
const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Error de datos');
  return response.json();
};

export default function Page() {
  // --- ESTADO DEL "PORTERO" (Autenticación) ---
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Loader solo para checar sesión inicial

  // --- ESTADO DEL "DIRECTOR" (Navegación) ---
  const [view, setView] = useState('home'); // 'home' o 'dashboard'
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);

  // --- LÓGICA DE AUTENTICACIÓN (useEffect) ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthLoading(false); // Terminamos de checar si hay usuario
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_OUT') setHeaderTitle('Bienvenido a SEDECYT');
      }
    );
    return () => subscription?.unsubscribe();
  }, []);

  // --- LÓGICA DE DATOS (SWR reemplaza al segundo useEffect) ---
  
  // SWR se activa automágicamente cuando 'session' existe.
  // Si session es null, pasamos null y SWR se queda en "pausa".
  const { data: dashboards, error, isLoading: dataLoading } = useSWR(
    session ? [`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards`, session.access_token] : null,
    fetcher,
    {
      revalidateOnFocus: false, // No recargar al cambiar de pestaña
      dedupingInterval: 60000,  // Usar caché de RAM por 1 minuto
      keepPreviousData: true,   // Muestra datos anteriores mientras carga los nuevos
    }
  );

  // --- LÓGICA DEL "DIRECTOR" ---
  const handleDashboardSelect = (dashboardSummary) => {
    // Recibimos el objeto ligero del home (id, title, slug, img)
    setSelectedSummary(dashboardSummary);
    setView('dashboard');
    // ¡LISTO! DashboardDetail se encargará del resto
  };

  const handleGoHome = () => {
    setSelectedSummary(null);
    setView('home');
    console.log("Volviendo a Home");
  };

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogin = (session) => {setSession(session);};
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  

  // --- RENDERIZADO ---
  if (authLoading) return <div className="fullPageLoader">Verificando sesión...</div>;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <AppHeader session={session} onLogout={handleLogout} />
      <div className="contentContainer">
        {!session ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            {/* Vista Home */}
            {view === 'home' && (
              <>
                {/* Aquí manejamos el loading DE LOS DATOS */}
                {dataLoading && <div className="fullPageLoader">Cargando tableros...</div>}
                
                {error && <div>Error al cargar: {error.message}</div>}
                
                {/* Si ya hay datos, mostramos el componente */}
                {dashboards && (
                  <DashboardHome
                    dashboards={dashboards}
                    onDashboardSelect={handleDashboardSelect}
                  />
                )}
              </>
            )}
            {/* Vista Detalle */}
            {view === 'dashboard' && selectedSummary && (
              // CAMBIO 3: Pasamos el resumen y dejamos que él haga su fetch
              <DashboardDetail
                dashboardSummary={selectedSummary} // OJO al cambio de nombre prop
                session={session}
                allDashboards={dashboards}
                onGoHome={handleGoHome}
                onDashboardSelect={handleDashboardSelect}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}