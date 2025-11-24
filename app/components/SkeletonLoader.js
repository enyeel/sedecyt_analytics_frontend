'use client';
import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader({ type = 'home', count = 6 }) {

    // --- CASO 1: HOME (Tarjetas verticales) ---
    if (type === 'home') {
        // Generamos 3 tarjetas falsas
        return (
            <div className={styles.homeContainer}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.homeCard} ${styles.shimmerBlock}`}>
                        {/* Simulamos la imagen */}
                        <div className={styles.homeImagePlaceholder} />
                        {/* Simulamos el texto */}
                        <div className={styles.homeTextPlaceholder}>
                            <div style={{ height: '20px', width: '70%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />
                            <div style={{ height: '14px', width: '90%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // --- CASO 2: DETAIL (Solo Grid de Tarjetas) ---
    if (type === 'detail') {
        return (
            <div className={styles.detailGrid}>
                {/* Renderizamos 'count' tarjetas falsas */}
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className={`${styles.chartSkeleton} ${styles.shimmerBlock}`} />
                ))}
            </div>
        );
    }

        return null;
    }