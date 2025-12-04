'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoginForm from './components/LoginForm';
import DashboardHome from './components/DashboardHome';
import DashboardDetail from './components/DashboardDetail';
import DataDrawer from './components/DataDrawer';
import AppHeader from './components/AppHeader';
import SkeletonLoader from './components/SkeletonLoader';

// 1. Definimos el "fetcher" (el mensajero) fuera del componente
const fetcher = async ([url]) => {
  
  // 1. Verificar sesión en Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // NO usamos setSession aquí. Lanzamos el error para que SWR lo atrape.
    throw new Error("Sesión expirada"); 
  }

  const response = await fetch(url, {
    headers: { 
      'Authorization': `Bearer ${session.access_token}`
    }
  });

  if (!response.ok) {
      // Manejo de 401/403
      if (response.status === 401 || response.status === 403) {
        console.warn("Detectado 401/403 en fetcher. Limpiando Supabase...");
        
        // Podemos limpiar la sesión de Supabase aquí (es global)
        await supabase.auth.signOut(); 
        
        // ¡CRÍTICO! Lanzamos el error con el mensaje EXACTO que tu onError espera
        throw new Error("Sesión expirada");
      }

      // Otros errores
      throw new Error(`Error del servidor: ${response.status}`);
  }
  
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
        if (_event === 'SIGNED_OUT') {}
      }
    );
    return () => subscription?.unsubscribe();
  }, []);

  // --- LÓGICA DE DATOS (SWR reemplaza al segundo useEffect) ---
  
  // SWR se activa automágicamente cuando 'session' existe.
  // Si session es null, pasamos null y SWR se queda en "pausa".
  const { data: dashboards, error, isLoading: dataLoading } = useSWR(
    session ? [`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards`] : null,
    fetcher,
    {
      revalidateOnFocus: false, // No recargar al cambiar de pestaña
      dedupingInterval: 60000,  // Usar caché de RAM por 1 minuto
      keepPreviousData: true,   // Muestra datos anteriores mientras carga los nuevos
      shouldRetryOnError: false,
      onError: (err) => {
        // Si el error es de autenticación, cerramos sesión suavemente
        if (err.message === 'Sesión expirada' || err.message.includes('401')) {
          console.warn("Sesión caducada, redirigiendo al login...");
          handleLogout(); // Esto pone session = null y muestra el Login
        }
      }
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
  if (authLoading) return <div className="fullScreenCenter"><div className="loaderSpinner"></div></div>;

  if (error) {
    // Si el error es de sesión, NO LANZAMOS NADA. 
    // Retornamos null mientras el 'handleLogout' (llamado en onError) hace efecto y nos manda al Login.
    if (error.message === 'Sesión expirada' || error.message.includes('401')) {
      return null; 
    }
    // Si es otro error (ej. se cayó el server 500), ese sí que explote el Boundary si quieres
    throw error; 
  }

  return (
    <>
    <AppHeader session={session} onLogout={handleLogout} />
      <div className="contentContainer">
        {!session ? (
          <div className="fullScreenCenter">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <>
            {error && error.message !== 'Sesión expirada' && (() => { throw error; console.log(error.message) })()}

            {/* Vista Home */}
            {view === 'home' && (
              <>
                {/* Si está cargando, mostramos Skeletons */}
                {dataLoading && <SkeletonLoader type="home" />}
                {/* Si ya hay datos, mostramos el componente */}
                {!dataLoading && dashboards && (
                  <div className="animate-enter"> {/* Wrapper simple para animar */}
                      <DashboardHome
                        dashboards={dashboards}
                        onDashboardSelect={handleDashboardSelect}
                      />
                  </div>
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

            <DataDrawer session={session} />
          </>
        )}
      </div>
    </>
  );
}