// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import styles from './DashboardDetail.module.css';
import ChartCard from './ChartCard';
import Sidebar from './Sidebar';

export default function DashboardDetail({
  selectedDashboard,
  session, // <-- Recibimos la sesión
  allDashboards,
  onGoHome,
  onDashboardSelect
}) {
  // Defensive check: Ensure charts is always an array.
  // Log an error if it's missing, which helps debugging.
  const charts = selectedDashboard?.charts || [];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // estado para búsqueda de empresa
  const [companyQuery, setCompanyQuery] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const handler = async (ev) => {
      const q = ev?.detail?.query?.trim();
      if (!q) return;

      setCompanyQuery(q);
      setCompanyInfo(null); // Limpiar resultados anteriores

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/search?q=${encodeURIComponent(q)}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (!response.ok) {
          throw new Error('Company not found');
        }

        const foundCompany = await response.json();

        // Adaptar la data de Supabase al formato que espera el panel
        setCompanyInfo({
          name: foundCompany.trade_name || 'N/A',
          sector: foundCompany.sector || 'N/A',
          keyStats: {
            // Estos campos no existen en tu tabla 'companies', usamos placeholders
            revenue: 'N/D', 
            employees: foundCompany.employee_count || 'N/D',
            score: 'N/D'
          },
          top10: false, // Lógica a definir
          related: [] // Lógica a definir
        });

      } catch (error) {
        console.warn("Search failed:", error.message);
        setCompanyInfo({
          name: q,
          sector: 'Desconocido',
          keyStats: { revenue: 'N/D', employees: 'N/D', score: 'N/D' },
          top10: false,
          related: []
        });
      }
    };

    window.addEventListener('companySearch', handler);
    return () => window.removeEventListener('companySearch', handler);
  }, [session]); // <-- El efecto ahora depende de la sesión

  return (
    <div className={styles.detailContainer}>
      {/* Botón flotante tipo toggle (ahora alterna abrir/cerrar) */}
      <button
        className={styles.fab}
        onClick={() => setSidebarOpen(v => !v)}
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>

      {/* Sidebar separado */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        allDashboards={allDashboards}
        selectedDashboard={selectedDashboard}
        onDashboardSelect={onDashboardSelect}
        onGoHome={onGoHome}
      />
      {/* Si hay una empresa buscada, mostrar panel con estadísticas / relaciones */}
      {companyInfo && (
        <section className={styles.companyPanel} aria-live="polite">
          <div className={styles.companyHeader}>
            <h3>{companyInfo.name}</h3>
            {companyInfo.top10 && <span className={styles.topBadge}>Top 10</span>}
            <p className={styles.companySector}>{companyInfo.sector}</p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Ingresos</div>
              <div className={styles.statValue}>{companyInfo.keyStats.revenue}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Empleados</div>
              <div className={styles.statValue}>{companyInfo.keyStats.employees}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{companyInfo.keyStats.score}</div>
            </div>
          </div>

          <div className={styles.related}>
            <h4>Relación con otras empresas</h4>
            {companyInfo.related.length === 0
              ? <p className={styles.small}>No se encontraron relaciones (usa datos reales en test-data.json)</p>
              : (
                <ul>
                  {companyInfo.related.map((r, i) => (
                    <li key={i}>{r.name} {r.metric ? `— ${r.metric}` : ''}</li>
                  ))}
                </ul>
              )}
          </div>
        </section>
      )}

      {/* --- GRID DE GRÁFICAS --- */}
      <section className={styles.chartGrid}>
        {/* Si no hay gráficas, mostramos un mensaje */}
        {charts.length === 0 && (
          <div className={styles.noChartsMessage}>
            <p>Este dashboard (<strong>{selectedDashboard?.title}</strong>) aún no tiene gráficas configuradas.</p>
          </div>
        )}

        {/* Mapeamos las gráficas y renderizamos una tarjeta por cada una */}
        {charts.map(chart => (
          <ChartCard key={chart.chart_id} chart={chart} />
        ))}
      </section>
    </div>
  );
}