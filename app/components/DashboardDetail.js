'use client';

import { useEffect, useState } from 'react';
import styles from './DashboardDetail.module.css';
import ChartCard from './ChartCard';
import Sidebar from './Sidebar';
import testData from '../test-data.json'; // usa tu fuente real si procede

export default function DashboardDetail({
  selectedDashboard,
  allDashboards,
  onGoHome,
  onDashboardSelect
}) {
  const charts = selectedDashboard?.charts || [];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // estado para búsqueda de empresa
  const [companyQuery, setCompanyQuery] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const handler = (ev) => {
      const q = ev?.detail?.query?.trim();
      if (!q) return;
      setCompanyQuery(q);
      // Buscar datos en testData (adaptar a tu estructura real)
      const companies = testData?.companies || [];
      const found = companies.find(c => c.name?.toLowerCase() === q.toLowerCase()) || null;

      if (found) {
        const related = companies
          .filter(c => c.sector && c.sector === found.sector && c.name !== found.name)
          .slice(0, 5)
          .map(c => ({ name: c.name, metric: c.metric || null }));

        setCompanyInfo({
          name: found.name,
          sector: found.sector || 'N/A',
          keyStats: {
            revenue: found.revenue || '—',
            employees: found.employees || '—',
            score: found.score || '—'
          },
          top10: (found.rank !== undefined) ? (found.rank <= 10) : (found.score && found.score > 80),
          related
        });
      } else {
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
  }, []);

  return (
    <div className={styles.detailContainer}>
      {/* Botón flotante para abrir sidebar (arriba-izq, debajo del header) */}
      <button
        className={styles.fab}
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        ☰
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