'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AppHeader from './components/AppHeader';
import LoginForm from './components/LoginForm';
import DashboardHome from './components/DashboardHome';
import DashboardDetail from './components/DashboardDetail';
// ...existing code...

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
    let mounted = true;
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);

      if (session) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setDashboards(data);
        } catch (e) {
          console.error("Failed to fetch dashboards:", e);
          setError("No se pudieron cargar los dashboards. Intenta de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (mounted) setSession(s);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // --- LÓGICA DEL "DIRECTOR" ---
  const handleDashboardSelect = (dashboard) => { /* ...existing code... */ };
  const handleGoHome = () => { /* ...existing code... */ };
  const handleLogin = (session) => setSession(session);

  // --- RENDERIZADO ---
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <AppHeader session={session} onLogout={handleLogout} />

      <main className="mainContainer">
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
                    allDashboards={dashboards} // La lista ligera para la sidebar
                    onGoHome={handleGoHome}
                    onDashboardSelect={handleDashboardSelect}
                  />
                )}
              </>
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
