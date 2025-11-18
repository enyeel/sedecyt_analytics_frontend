
'use client';

import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  isOpen,
  onClose,
  allDashboards = [],
  selectedDashboard,
  onDashboardSelect,
  onGoHome
}) {
  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
      >
        {/* BOTÓN "×" ELIMINADO (ahora el toggle controla abrir/cerrar) */}

        <h3 className={styles.sidebarTitle}>Dashboards</h3>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarItem} onClick={() => { onGoHome?.(); onClose(); }}>
            ← Ver Resumen (Home)
          </li>
          <hr className={styles.divider} />

          {allDashboards.map(dash => (
            <li
              key={dash.id}
              className={`${styles.sidebarItem} ${dash.id === selectedDashboard?.id ? styles.active : ''}`}
              onClick={() => { onDashboardSelect?.(dash); onClose(); }}
            >
              {dash.title}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
