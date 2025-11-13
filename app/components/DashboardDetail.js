'use client';

import { useState } from 'react';
import styles from './DashboardDetail.module.css';
import ChartCard from './ChartCard';
import Sidebar from './Sidebar';

export default function DashboardDetail({
    selectedDashboard,
    allDashboards,
    onGoHome,
    onDashboardSelect
}) {
    const charts = selectedDashboard?.charts || [];
    const [sidebarOpen, setSidebarOpen] = useState(false);

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