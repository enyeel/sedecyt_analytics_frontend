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
    BRAND_SEDECYT_OP: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.6)`,
    PRIMARY_MAGENTA_OP: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.6)`,
    SECONDARY_BLUE_OP: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.6)`,
    ACCENT_LIME_OP: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.6)`,
    ACCENT_YELLOW_OP: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.6)`,
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
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                // ¡Truco Pro! En el tooltip mostramos el nombre COMPLETO, aunque abajo esté cortado
                callbacks: {
                    title: (context) => context[0].label 
                }
            }
        },
    };

    // Lógica específica para BARRAS
    if (type === 'bar') {
        const labels = data.labels || [];
        const labelCount = labels.length;
        
        // Calculamos longitud promedio de los textos
        const avgLabelLength = labels.reduce((acc, label) => acc + label.length, 0) / (labelCount || 1);

        // DECISIÓN AUTOMÁTICA:
        // Si hay muchas barras (>8) O los textos son largos (>12 caracteres promedio)
        // -> Cambiamos a Horizontal.
        const isHorizontal = labelCount > 8 || avgLabelLength > 12;

        return {
            ...baseOptions,
            indexAxis: isHorizontal ? 'y' : 'x', // 'y' hace la barra horizontal
            scales: {
                x: {
                    // Si es horizontal, el eje X son números, no etiquetas.
                    ticks: { 
                        font: { size: 11 } 
                    } 
                },
                y: {
                    ticks: {
                        font: { size: 11 },
                        // Si es horizontal, truncamos las etiquetas del eje Y para que no ocupen media pantalla
                        callback: function(value, index) {
                            // Chart.js a veces pasa el valor del índice, recuperamos el label real
                            const label = this.getLabelForValue(value); 
                            return isHorizontal ? truncateLabel(label, 20) : label;
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
        datasets: chart.data.datasets.map((dataset, index) => {
            // Lógica de colores
            let bgColor = CHART_COLORS.SECONDARY_BLUE_OP;
            let borderColor = 'transparent';

            if (chart.type === 'pie') {
                // Ciclar colores si hay muchos gajos
                const palette = [
                    CHART_COLORS.PRIMARY_MAGENTA_OP,
                    CHART_COLORS.ACCENT_LIME_OP,
                    CHART_COLORS.SECONDARY_BLUE_OP,
                    CHART_COLORS.ACCENT_YELLOW_OP,
                    CHART_COLORS.BRAND_SEDECYT_OP
                ];
                bgColor = chart.data.labels.map((_, i) => palette[i % palette.length]);
                borderColor = '#ffffff';
            } else if (chart.type === 'line') {
                bgColor = CHART_COLORS.BRAND_SEDECYT_OP;
                borderColor = CHART_COLORS.BRAND_SEDECYT;
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