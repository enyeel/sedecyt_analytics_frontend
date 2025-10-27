'use client';

// 1. Importamos Chart.js y los elementos que necesitamos
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Para Pie/Doughnut
    PointElement, // Para Line
    LineElement // Para Line
} from 'chart.js';

// 2. Importamos los componentes de React
import { Bar, Pie, Line } from 'react-chartjs-2';

// 3. Importamos nuestros estilos
import styles from './ChartCard.module.css';

// 4. ¡¡REGISTRAMOS LOS ELEMENTOS!! (Paso crítico)
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

// =============================================
// --- ¡NUEVO! Paleta de Colores DINÁMICA ---
// =============================================

/**
 * Función para LEER una variable CSS desde el :root
 * (Solo funciona en el cliente, por eso usamos 'use client')
 */
function getCssVar(varName) {
    // Asegurarnos de que estamos en el navegador
    if (typeof window !== 'undefined') {
        // Leemos el valor de la variable desde el :root y quitamos espacios
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return '0, 0%, 0%'; // Fallback (negro)
}

const CHART_COLORS = {
    // Colores (con opacidad de 0.6 para 'fill')
    BRAND_SEDECYT_OP: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.6)`,
    PRIMARY_MAGENTA_OP: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.6)`,
    SECONDARY_BLUE_OP: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.6)`,
    ACCENT_LIME_OP: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.6)`,
    ACCENT_YELLOW_OP: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.6)`,

    // Colores Sólidos (para 'border' o 'line')
    BRAND_SEDECYT: `hsl(${getCssVar('--color-brand-sedecyt-hsl')})`,
    PRIMARY_MAGENTA: `hsl(${getCssVar('--color-primary-magenta-hsl')})`,
    SECONDARY_BLUE: `hsl(${getCssVar('--color-secondary-blue-hsl')})`,
    ACCENT_LIME: `hsl(${getCssVar('--color-accent-lime-hsl')})`,
    ACCENT_YELLOW: `hsl(${getCssVar('--color-accent-yellow-hsl')})`,
};
// =============================================

// Este es el "unpacker"
function ChartRenderer({ type, data, options }) {
    if (type === 'bar') {
        return <Bar options={options} data={data} />;
    }
    if (type === 'pie') {
        return <Pie options={options} data={data} />;
    }
    if (type === 'line') {
        return <Line options={options} data={data} />;
    }
    return <p>Tipo de gráfica no soportado: {type}</p>;
}


// Componente principal de la "Tarjeta"
export default function ChartCard({ chart }) {

    // --- ¡AQUÍ ESTÁ LA MAGIA PARA Y***! ---
    // Asignamos los colores directamente usando la paleta
    const chartData = {
        ...chart.data,
        datasets: chart.data.datasets.map(dataset => {
            // Usamos los colores de la paleta
            if (chart.type === 'bar') {
                return {
                    ...dataset,
                    backgroundColor: CHART_COLORS.SECONDARY_BLUE_OP,
                };
            }
            if (chart.type === 'pie') {
                return {
                    ...dataset,
                    backgroundColor: [
                        CHART_COLORS.PRIMARY_MAGENTA_OP,
                        CHART_COLORS.ACCENT_LIME_OP,
                        CHART_COLORS.SECONDARY_BLUE_OP,
                        CHART_COLORS.ACCENT_YELLOW_OP,
                    ],
                    borderColor: 'hsl(0, 0%, 100%)', // Borde blanco
                    borderWidth: 2,
                };
            }
            if (chart.type === 'line') {
                return {
                    ...dataset,
                    borderColor: CHART_COLORS.BRAND_SEDECYT,
                    backgroundColor: CHART_COLORS.BRAND_SEDECYT_OP, // Relleno
                    fill: true, // ¡Que rellene el área bajo la línea!
                };
            }
            return dataset;
        })
    };


    // --- ¡AQUÍ ESTÁ EL ARREGLO DEL BUG DE ESTIRAMIENTO! ---
    const options = {
        responsive: true,
        maintainAspectRatio: false, // <-- ¡¡ESTA ES LA LÍNEA!!
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{chart.title}</h3>
            <div className={styles.chartContainer}>
                <ChartRenderer
                    type={chart.type}
                    data={chartData} // Usamos los nuevos datos con colores
                    options={options} // Usamos las nuevas opciones
                />
            </div>
        </div>
    );
}
