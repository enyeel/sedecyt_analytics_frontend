'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoginForm from './components/LoginForm';
import DashboardHome from './components/DashboardHome';
import DashboardDetail from './components/DashboardDetail';
import AppHeader from './components/AppHeader';


export default function Page() {
  // --- ESTADO DEL "PORTERO" (Autenticación) ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false); // <-- NUEVO: Loader para la vista de detalle
  
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
  const handleDashboardSelect = async (dashboard) => {
    // 1. Cambiar a la vista de detalle y mostrar un loader
    setView('dashboard');
    setIsDetailLoading(true);
    setSelectedDashboard(null); // Limpiar dashboard anterior
    setHeaderTitle(dashboard.title); // Poner título provisionalmente
    console.log("Fetching details for dashboard:", dashboard.slug);

    try {
      // 2. Hacer el fetch para obtener los datos completos de ESE dashboard
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards/${dashboard.slug}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (!response.ok) throw new Error(`Failed to fetch dashboard details: ${response.status}`);

      const fullDashboardData = await response.json();
      // 3. Actualizar el estado con los datos completos
      setSelectedDashboard(fullDashboardData);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el detalle del dashboard.");
    } finally {
      setIsDetailLoading(false); // 4. Ocultar el loader
    }
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
    setSession(null);
  };

  
  const handleLogin = (session) => {
    setSession(session);
  };

  // --- RENDERIZADO ---
  if (loading) {
    // Un loader más centrado y visible
    return <div className="fullPageLoader">Cargando...</div>;
  }

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
            {view === 'home' && (
              <DashboardHome
                dashboards={dashboards}
                onDashboardSelect={handleDashboardSelect}
              />
            )}
            
            {view === 'dashboard' && (
              <>
                {isDetailLoading && <div className="fullPageLoader">Cargando dashboard...</div>}
                {!isDetailLoading && selectedDashboard && (
                  <DashboardDetail
                    selectedDashboard={selectedDashboard}
                    session={session} // <-- Pasamos la sesión para el token de auth
                    allDashboards={dashboards} // La lista ligera para la sidebar
                    onGoHome={handleGoHome}
                    onDashboardSelect={handleDashboardSelect}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}