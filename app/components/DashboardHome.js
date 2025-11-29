'use client';
import styles from './DashboardHome.module.css';

// --- ICONOS FLUENT (SVG Inline para carga instantánea) ---
const ICONS = {
  default: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  ),
  people: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
  )
};

// Función para elegir icono basado en el título (Lógica simple)
const getIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('humano') || t.includes('talento')) return ICONS.people;
  if (t.includes('industrial') || t.includes('empresas')) return ICONS.chart;
  if (t.includes('comercio') || t.includes('global')) return ICONS.globe;
  return ICONS.default;
};

export default function DashboardHome({ dashboards = [], onDashboardSelect }) {
    return (
        <div className={styles.homeWrapper}>
            
            {/* Título Ejecutivo */}
            <div className={styles.headerSection}>
                <h1 className={styles.pageTitle}>Tableros de Control Estratégico</h1>
                <p className={styles.pageSubtitle}>Seleccione un reporte para visualizar los indicadores clave.</p>
            </div>

            <div className={styles.gridContainer}>
                {dashboards && dashboards.map((dashboard) => (
                    <div
                        key={dashboard.id}
                        className={styles.card}
                        onClick={() => onDashboardSelect(dashboard)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={styles.iconContainer}>
                            {getIcon(dashboard.title)}
                        </div>
                        
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{dashboard.title}</h3>
                            <p className={styles.cardDescription}>{dashboard.description}</p>
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={styles.ctaText}>Explorar Datos</span>
                            <span className={styles.ctaArrow}>→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}