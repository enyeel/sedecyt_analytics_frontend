'use client';

import styles from './DashboardDetail.module.css';
import ChartCard from './ChartCard'; // Importamos el desempacador

// Este componente recibe toda la información del "cerebro"
export default function DashboardDetail({
    selectedDashboard,
    allDashboards,
    onGoHome,
    onDashboardSelect
}) {

    // Extraemos las gráficas del dashboard seleccionado
    const charts = selectedDashboard.charts || [];

    return (
        <div className={styles.detailContainer}>

            {/* --- COLUMNA 1: SIDEBAR --- */}
            <aside className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Dashboards</h3>
                <ul className={styles.sidebarList}>

                    {/* Botón para volver al Home (Grid) */}
                    <li className={styles.sidebarItem} onClick={onGoHome}>
                        ← Ver Resumen (Home)
                    </li>

                    <hr className={styles.divider} />

                    {/* Mapeamos TODOS los dashboards para la navegación AGREGAR BPTON DE DESCARGAR A CADA UNO*/}
                    {allDashboards.map(dash => (
                        <li
                            key={dash.id}
                            // Resaltamos el que está activo
                            className={`${styles.sidebarItem} ${dash.id === selectedDashboard.id ? styles.active : ''}`}
                            onClick={() => onDashboardSelect(dash)} // Permite cambiar de dashboard
                        >
                            {dash.title}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* --- COLUMNA 2: GRID DE GRÁFICAS --- */}
            <section className={styles.chartGrid}>

                {/* Si no hay gráficas, mostramos un mensaje */}
                {charts.length === 0 && (
                    <div className={styles.noChartsMessage}>
                        <p>Este dashboard (<strong>{selectedDashboard.title}</strong>) aún no tiene gráficas configuradas.</p>
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
