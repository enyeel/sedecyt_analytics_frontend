// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import styles from './DashboardDetail.module.css';
import ChartCard from './ChartCard';
import Sidebar from './Sidebar';
import useSWR from 'swr';

// Fetcher local (o podrías exportar el de page.js a un archivo utils.js)
const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Error fetching details');
  return response.json();
};

export default function DashboardDetail({
  dashboardSummary,
  session, // <-- Recibimos la sesión
  allDashboards,
  onGoHome,
  onDashboardSelect
}) {
  // console.log('%c[DashboardDetail.js] 3. Received prop selectedDashboard:', 'color: purple; font-weight: bold;', selectedDashboard);
  // Defensive check: Ensure charts is always an array.
  // Log an error if it's missing, which helps debugging.
  
  // console.log('%c[DashboardDetail.js] 4. Extracted charts array:', 'color: red; font-weight: bold;', charts);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- AQUÍ ESTÁ LA MAGIA SWR ---
  // Usamos el slug del resumen para pedir los datos completos (con gráficas)
  // dedupingInterval: 300000 = 5 minutos de caché en RAM.
  const { data: fullDashboard, error, isLoading } = useSWR(
    session && dashboardSummary?.slug 
      ? [`${process.env.NEXT_PUBLIC_API_URL}/api/dashboards/${dashboardSummary.slug}`, session.access_token] 
      : null,
    fetcher,
    { 
      dedupingInterval: 300000, // ¡5 minutos de memoria!
      revalidateOnFocus: false  // No recargar si cambio de ventana
    }
  );

  // estado para búsqueda de empresa
  const [companyQuery, setCompanyQuery] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  // Mientras carga lo nuevo, usamos el título que YA tenemos (UI Optimista)
  const displayDashboard = fullDashboard || dashboardSummary;
  const charts = fullDashboard?.charts || [];

  return (
    <div className={styles.detailContainer}>
      
      <button
        className={styles.fab}
        onClick={() => setSidebarOpen(v => !v)}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        allDashboards={allDashboards}
        selectedDashboard={displayDashboard}
        onDashboardSelect={onDashboardSelect}
        onGoHome={onGoHome}
      />

      <section className={styles.chartGrid}>
        {/* TÍTULO: Se muestra INMEDIATAMENTE porque viene de 'dashboardSummary' */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--blue-black)', margin: 0 }}>{displayDashboard.title}</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{displayDashboard.description}</p>
        </div>

        {/* ESTADO DE CARGA (SKELETON PROVISIONAL) */}
        {isLoading && (
            <div className={styles.noChartsMessage}>
                Cargando gráficas... 
                {/* Aquí luego pondremos un Skeleton bonito */}
            </div>
        )}

        {/* ERROR */}
        {error && <div className={styles.noChartsMessage}>Error al cargar gráficas.</div>}

        {/* MENSAJE VACÍO (Solo si YA cargó y de verdad no hay gráficas) */}
        {!isLoading && !error && charts.length === 0 && (
            <div className={styles.noChartsMessage}>
                <p>Este dashboard aún no tiene gráficas configuradas.</p>
            </div>
        )}

        {/* GRÁFICAS (Aparecen cuando fullDashboard llega) */}
        {charts.map(chart => (
            <ChartCard key={chart.chart_id} chart={chart} />
        ))}

      </section>
    </div>
  );
}