'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import styles from './ChartCard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// --- UTILS DE COLORES ---
function getCssVar(varName) {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return '0, 0%, 0%';
}

const CHART_COLORS = {
    BRAND_SEDECYT: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.9)`,
    PRIMARY_MAGENTA: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.9)`,
    SECONDARY_BLUE: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.9)`,
    ACCENT_LIME: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.9)`,
    ACCENT_YELLOW: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.9)`,

    BRAND_SEDECYT_OP: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.5)`,
    PRIMARY_MAGENTA_OP: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.5)`,
    SECONDARY_BLUE_OP: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.5)`,
    ACCENT_LIME_OP: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.5)`,
    ACCENT_YELLOW_OP: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.5)`,
    BRAND_SEDECYT: `hsl(${getCssVar('--color-brand-sedecyt-hsl')})`,
    // ... puedes agregar más variaciones aquí si quieres
};

// Función auxiliar para truncar texto largo (ej: "Empresa Manufacturera..." )
const truncateLabel = (label, maxLength = 15) => {
    if (label.length > maxLength) {
        return label.substring(0, maxLength) + '...';
    }
    return label;
};

// --- LOGICA DE INTELIGENCIA VISUAL ---
function getSmartOptions(type, data) {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        
        // 1. INTERACCIÓN AVANZADA ("Modo Comparativo")
        // Esto permite ver todos los datos de un mismo punto (eje X) simultáneamente
        interaction: {
            mode: 'index', 
            intersect: false,
        },

        plugins: {
            legend: { position: 'top' },
            tooltip: {
                // 2. ESTILO "BI PROFESIONAL" (Tipo Tableau/PowerBI)
                backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo casi blanco y limpio
                titleColor: '#003366', // Título en azul institucional
                bodyColor: '#333',     // Texto oscuro para contraste
                borderColor: 'rgba(0,0,0,0.1)', // Borde sutil
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
                usePointStyle: true,   // Usa puntos redondos en el tooltip (más elegante)

                // Tu lógica original para nombres completos
                callbacks: {
                    title: (context) => context[0].label 
                }
            }
        },
    };

    // Lógica específica para BARRAS (Tu código original intacto)
    if (type === 'bar') {
        const labels = data.labels || [];
        const labelCount = labels.length;
        
        // Calculamos longitud promedio de los textos
        const avgLabelLength = labels.reduce((acc, label) => acc + label.length, 0) / (labelCount || 1);

        // DECISIÓN AUTOMÁTICA:
        const isHorizontal = labelCount > 8 || avgLabelLength > 12;

        return {
            ...baseOptions,
            indexAxis: isHorizontal ? 'y' : 'x', // 'y' hace la barra horizontal
            scales: {
                x: {
                    // Si es horizontal, el eje X son números.
                    ticks: { 
                        font: { size: 11 } 
                    } 
                },
                y: {
                    ticks: {
                        font: { size: 11 },
                        // Si es horizontal, truncamos las etiquetas del eje Y
                        callback: function(value, index) {
                            // Chart.js a veces pasa el valor del índice, recuperamos el label real
                            const label = this.getLabelForValue(value); 
                            // Asegúrate de tener la función 'truncateLabel' definida fuera o impórtala
                            return isHorizontal && typeof truncateLabel === 'function' 
                                ? truncateLabel(label, 20) 
                                : label;
                        }
                    }
                }
            }
        };
    }

    return baseOptions;
}

// El Renderizador
function ChartRenderer({ type, data, options }) {
    if (type === 'bar') return <Bar options={options} data={data} />;
    if (type === 'pie') return <Pie options={options} data={data} />;
    if (type === 'line') return <Line options={options} data={data} />;
    return <p>Gráfica no soportada</p>;
}

export default function ChartCard({ chart }) {
    // 1. Generamos las opciones inteligentes basadas en los datos
    const smartOptions = getSmartOptions(chart.type, chart.data);

    // 2. Asignación de colores (igual que antes, pero un poco más limpia)
    const chartData = {
        ...chart.data,
        datasets: chart.data.datasets.map(dataset => {
            
            // CASO 1: GRÁFICA DE BARRAS
            if (chart.type === 'bar') {
                return {
                    ...dataset,
                    // Estado Normal: Color con opacidad (0.6)
                    backgroundColor: CHART_COLORS.SECONDARY_BLUE_OP, 
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 6,

                    // Estado HOVER (¡Aquí está la magia!)
                    hoverBackgroundColor: CHART_COLORS.SECONDARY_BLUE, // Se vuelve sólido (brilla más)
                    hoverBorderColor: CHART_COLORS.BRAND_SEDECYT, // Le sale un borde azul oscuro
                    hoverBorderWidth: 2, // Grosor del borde al pasar el mouse
                };
            }

            // CASO 2: GRÁFICA DE PASTEL
            if (chart.type === 'pie') {
                return {
                    ...dataset,
                    backgroundColor: [
                        CHART_COLORS.PRIMARY_MAGENTA_OP,
                        CHART_COLORS.ACCENT_LIME_OP,
                        CHART_COLORS.SECONDARY_BLUE_OP,
                        CHART_COLORS.ACCENT_YELLOW_OP,
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,

                    // Estado HOVER
                    // Hacemos que los colores se vuelvan sólidos al pasar el mouse
                    hoverBackgroundColor: [
                        CHART_COLORS.PRIMARY_MAGENTA,
                        CHART_COLORS.ACCENT_LIME,
                        CHART_COLORS.SECONDARY_BLUE,
                        CHART_COLORS.ACCENT_YELLOW,
                    ],
                    hoverBorderColor: '#ffffff',
                    hoverBorderWidth: 4, // El borde blanco crece
                    hoverOffset: 20 // <--- ESTO ES CLAVE: La rebanada "salta" hacia afuera 20px
                };
            }

            // CASO 3: LÍNEAS (Ya lo tenías bien, pero le damos un toque extra en los puntos)
            if (chart.type === 'line') {
                return {
                    ...dataset,
                    borderColor: CHART_COLORS.BRAND_SEDECYT,
                    backgroundColor: CHART_COLORS.BRAND_SEDECYT_OP,
                    fill: true,
                    // Hacemos que el punto se agrande al pasar el mouse
                    pointHoverRadius: 8, 
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: CHART_COLORS.BRAND_SEDECYT,
                    pointHoverBorderWidth: 3,
                };
            }
            
            return {
                ...dataset,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: chart.type === 'pie' ? 2 : 0,
                fill: chart.type === 'line',
                // Pequeño radio en las barras para verse moderno
                borderRadius: chart.type === 'bar' ? 4 : 0, 
            };
        })
    };

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{chart.title}</h3>
            <div className={styles.chartContainer}>
                <ChartRenderer
                    type={chart.type}
                    data={chartData}
                    options={smartOptions} 
                />
            </div>
        </div>
    );
}