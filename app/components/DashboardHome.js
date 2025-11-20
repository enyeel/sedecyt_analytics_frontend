'use client';
import styles from './DashboardHome.module.css';

// Este componente ahora es "tonto".
// Recibe la lista de 'dashboards' y la función 'onDashboardSelect'.
// Se añade un valor por defecto a dashboards para evitar errores si llega como undefined.
export default function DashboardHome({ dashboards = [], onDashboardSelect }) {
    return (
        <div className={styles.gridContainer}>

            {/* Hacemos map sobre los dashboards que recibimos como prop */}
            {/* Ahora, si dashboards es undefined, usará [] y .map no fallará. */}
            {dashboards && dashboards.map((dashboard) => (

                <div
                    key={dashboard.id}
                    className={styles.card}
                    onClick={() => {
                        console.log('Card clicked!', dashboard); // <-- Add this log
                        onDashboardSelect(dashboard);
                    }}
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
