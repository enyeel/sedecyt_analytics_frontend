'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

// --- Componentes que esta página va a mostrar ---
import LoginForm from '@/app/components/LoginForm';
import DashboardHome from '@/app/components/DashboardHome';
import DashboardDetail from '@/app/components/DashboardDetail'; // <-- ¡NUEVO!

// --- DATOS FALSOS (Ahora viven aquí) ---
const MOCK_DASHBOARDS = [
  {
    id: 'industrial-2024',
    title: 'Resumen Industrial 2024',
    description: 'Análisis del sector automotriz, aeroespacial y textil.',
    imageUrl: 'https://placehold.co/400x200/003366/FFFFFF?text=Industrial',
    // Datos de gráficas (basado en tu test_data.json)
    charts: [
      {
        chart_id: "chart-001",
        title: "Empresas por Rubro",
        type: "bar",
        data: {
          labels: ["Automotriz", "Aeroespacial", "Alimentos", "Textil"],
          datasets: [
            {
              label: "Número de Empresas",
              data: [120, 65, 80, 40],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
      },
      {
        chart_id: "chart-002",
        title: "Planes de Expansión",
        type: "pie",
        data: {
          labels: ["Con Planes", "Sin Planes"],
          datasets: [
            {
              label: "Planes de Expansión",
              data: [85, 175],
              backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
            },
          ],
        },
      },
      {
        chart_id: "chart-003",
        title: "Nuevos Empleos (Últimos 6 Meses)",
        type: "line", // <-- Un tipo nuevo
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          datasets: [
            {
              label: "Nuevos Empleos",
              data: [30, 45, 60, 50, 70, 85],
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        },
      },
    ]
  },
  {
    id: 'comercio-2024',
    title: 'Análisis de Comercio',
    description: 'Reporte de importaciones y exportaciones por sector.',
    imageUrl: 'https://placehold.co/400x200/556B2F/FFFFFF?text=Comercio',
    charts: [] // Este no tiene gráficas por ahora
  },
  {
    id: 'empleo-q3-2024',
    title: 'Reporte de Empleo Q3',
    description: 'Nuevos empleos generados, salarios promedio y vacantes.',
    imageUrl: 'https://placehold.co/400x200/FF0066/FFFFFF?text=Empleo',
    charts: [] // Este no tiene gráficas por ahora
  },
];
// --- Fin de Datos Falsos ---


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

  // --- ESTADO DEL "DIRECTOR" (Navegación) ---
  const [view, setView] = useState('home'); // 'home' o 'dashboard'
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('SEDECYT Analytics');

  // --- LÓGICA DEL "PORTERO" ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      if (session) {
        setHeaderTitle('Resumen de Dashboards');
      } else {
        setHeaderTitle('Bienvenido a SEDECYT');
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
    const fullDashboardData = MOCK_DASHBOARDS.find(d => d.id === dashboard.id);
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
                dashboards={MOCK_DASHBOARDS} 
                onDashboardSelect={handleDashboardSelect} 
              />
            )}
            
            {view === 'dashboard' && (
              // ¡Renderizamos el nuevo componente de Detalle!
              <DashboardDetail
                selectedDashboard={selectedDashboard}
                allDashboards={MOCK_DASHBOARDS}
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