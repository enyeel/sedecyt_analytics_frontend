'use client';
import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader({ type = 'home', count = 6 }) {

    // --- CASO 1: HOME (Tarjetas verticales) ---
    if (type === 'home') {
        return (
            <div className={styles.homeWrapper}>

                {/* HEADER FALSO (La clave para que no salte) */}
                <div className={styles.homeHeaderSkeleton}>
                    <div className={`${styles.titleSkeleton} ${styles.shimmerBlock}`} />
                    <div className={`${styles.subtitleSkeleton} ${styles.shimmerBlock}`} />
                </div>

                {/* GRID DE TARJETAS */}
                <div className={styles.homeGrid}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`${styles.homeCard} ${styles.shimmerBlock}`}>
                            {/* Icono */}
                            <div className={styles.iconSkeleton} />

                            {/* Textos */}
                            <div style={{ height: '24px', width: '80%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '10px' }} />
                            <div style={{ height: '14px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '6px' }} />
                            <div style={{ height: '14px', width: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />

                            {/* Footer */}
                            <div style={{ marginTop: 'auto', height: '1px', width: '100%', background: 'rgba(0,0,0,0.05)' }} />
                            <div style={{ marginTop: '1rem', height: '16px', width: '30%', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- CASO 2: DETAIL (Solo Grid de Tarjetas) ---
    if (type === 'detail') {
        return (
            <div className={styles.detailGrid}>
                {/* Renderizamos 'count' tarjetas falsas con estructura interna */}
                {Array(count).fill(0).map((_, i) => (
                    <div key={i} className={`${styles.chartSkeleton} ${styles.shimmerBlock}`}>

                        {/* 1. Título Falso */}
                        <div className={styles.chartTitlePlaceholder} />

                        {/* 2. Gráfica Falsa (Caja grande) */}
                        <div className={styles.chartCanvasPlaceholder} />

                    </div>
                ))}
            </div>
        );
    }

    return null;
}