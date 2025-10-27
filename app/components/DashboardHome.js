'use client';
import styles from './DashboardHome.module.css'; // Estilos MÍNIMOS

// --- Datos Falsos (Mock Data) ---
// Más adelante, esto vendrá de tu API de GCR
const MOCK_DASHBOARDS = [
    {
        id: 'industrial-2024',
        title: 'Resumen Industrial 2024',
        description: 'Análisis del sector automotriz, aeroespacial y textil.',
        imageUrl: 'https://placehold.co/400x200/003366/FFFFFF?text=Industrial'
    },
    {
        id: 'comercio-2024',
        title: 'Análisis de Comercio',
        description: 'Reporte de importaciones y exportaciones por sector.',
        imageUrl: 'https://placehold.co/400x200/556B2F/FFFFFF?text=Comercio'
    },
    {
        id: 'empleo-q3-2024',
        title: 'Reporte de Empleo Q3',
        description: 'Nuevos empleos generados, salarios promedio y vacantes.',
        imageUrl: 'https://placehold.co/400x200/FF0066/FFFFFF?text=Empleo'
    },
];
// --- Fin de Datos Falsos ---


// Este componente recibe 'onDashboardSelect' como una "prop" (propiedad)
// desde 'page.js'
export default function DashboardHome({ onDashboardSelect }) {
    return (
        <div className={styles.gridContainer}>
            {MOCK_DASHBOARDS.map((dashboard) => (

                // Cuando le den clic, llamamos a la función
                // que nos pasó nuestro "padre" ('page.js')
                <div
                    key={dashboard.id}
                    className={styles.card}
                    onClick={() => onDashboardSelect(dashboard)}
                >
                    <img
                        src={dashboard.imageUrl}
                        alt={dashboard.title}
                        className={styles.cardImage}
                        onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=Error'; }}
                    />
                    <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{dashboard.title}</h3>
                        <p className={styles.cardDescription}>{dashboard.description}</p>
                    </div>
                </div>

            ))}
        </div>
    );
}
