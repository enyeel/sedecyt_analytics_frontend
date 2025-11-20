'use client';
import React from 'react';
import styles from './AppHeader.module.css';

// ...existing code...
export default function AppHeader({ session, onLogout }) {
    const onSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const q = (form.elements?.companySearch?.value || '').trim();
        if (!q) return;
        window.dispatchEvent(new CustomEvent('companySearch', { detail: { query: q } }));
    };

    return (
        <header className={styles.appHeader}>
            <div className={styles.left}>
                <img src="/logo.png" alt="logo" className={styles.logo} />
            </div>

            {session ? (
              <>
                <div className={styles.center}>
                    <button className={styles.helpButton} title="Ayuda" aria-label="Ayuda">?</button>
                </div>

                <div className={styles.right}>
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

                    <button
                        className={`${styles.headerButton} ${styles.logoutButton}`}
                        title="Cerrar sesión"
                        onClick={onLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.center} />
                <div className={styles.right} />
             </>
            )}
        </header>
    );
}