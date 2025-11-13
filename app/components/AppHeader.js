'use client';
import React from 'react';
import styles from './AppHeader.module.css';

export default function AppHeader() {
    const onSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const q = (form.elements?.companySearch?.value || '').trim();
        if (!q) return;
        window.dispatchEvent(new CustomEvent('companySearch', { detail: { query: q } }));
    };

    const onLogout = () => {
        window.dispatchEvent(new CustomEvent('logoutRequested'));
    };

    return (
        <header className={styles.appHeader}>
            <img src="/logo.png" alt="logo" className={styles.logo} />

            <div className={styles.headerActions}>
                <button
                    className={`${styles.headerButton} ${styles.logoutButton}`}
                    title="Cerrar sesión"
                    onClick={onLogout}
                >
                    Cerrar sesión
                </button>

                <button className={styles.helpButton} title="Ayuda" aria-label="Ayuda">?</button>

                <form onSubmit={onSearch} className={styles.searchForm}>
                    <div className={styles.searchWrap} role="search">
                        <input
                            name="companySearch"
                            type="search"
                            className={styles.searchInput}
                            placeholder="Buscar por empresa..."
                            aria-label="Buscar por empresa"
                        />
                    </div>
                </form>
            </div>
        </header>
    );
}