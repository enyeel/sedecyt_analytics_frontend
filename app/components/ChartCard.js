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
import { useRef } from 'react';
import { jsPDF } from 'jspdf';
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
    // Colores sólidos y con opacidad para diferentes estados
    BRAND_SEDECYT: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.9)`,
    PRIMARY_MAGENTA: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.9)`,
    SECONDARY_BLUE: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.9)`,
    ACCENT_LIME: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.9)`,
    ACCENT_YELLOW: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.9)`,

    // Colores sólidos versión light
    BRAND_SEDECYT_LIGHT: `hsla(${getCssVar('--color-brand-sedecyt-hsl-light')}, 0.9)`,
    PRIMARY_MAGENTA_LIGHT: `hsla(${getCssVar('--color-primary-magenta-hsl-light')}, 0.9)`,
    SECONDARY_BLUE_LIGHT: `hsla(${getCssVar('--color-secondary-blue-hsl-light')}, 0.9)`,
    ACCENT_LIME_LIGHT: `hsla(${getCssVar('--color-accent-lime-hsl-light')}, 0.9)`,
    ACCENT_YELLOW_LIGHT: `hsla(${getCssVar('--color-accent-yellow-hsl-light')}, 0.9)`,

    // Colores con opacidad (40%) para estado normal
    BRAND_SEDECYT_OP: `hsla(${getCssVar('--color-brand-sedecyt-hsl')}, 0.4)`,
    PRIMARY_MAGENTA_OP: `hsla(${getCssVar('--color-primary-magenta-hsl')}, 0.4)`,
    SECONDARY_BLUE_OP: `hsla(${getCssVar('--color-secondary-blue-hsl')}, 0.4)`,
    ACCENT_LIME_OP: `hsla(${getCssVar('--color-accent-lime-hsl')}, 0.4)`,
    ACCENT_YELLOW_OP: `hsla(${getCssVar('--color-accent-yellow-hsl')}, 0.4)`,
    BRAND_SEDECYT: `hsl(${getCssVar('--color-brand-sedecyt-hsl')})`,
    // ... puedes agregar más variaciones aquí si quieres
};

// Función auxiliar para truncar texto largo (ej: "Empresa Manufacturera..." )
const truncateLabel = (label, maxLength = 15) => {
    if (!label) return label;
    if (label.length > maxLength) return label.substring(0, maxLength) + '...';
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
                    title: (context) => context[0]?.label 
                }
            }
        },
    };

    // Lógica específica para BARRAS (Tu código original intacto)
    if (type === 'bar') {
        const labels = data.labels || [];
        const labelCount = labels.length;
        
        // Calculamos longitud promedio de los textos
        const avgLabelLength = labels.reduce((acc, label) => acc + (label?.length || 0), 0) / (labelCount || 1);

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
                        callback: function(value) {
                            const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
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
function ChartRenderer({ type, data, options, chartRef }) {
    if (type === 'bar') return <Bar ref={chartRef} options={options} data={data} />;
    if (type === 'pie') return <Pie ref={chartRef} options={options} data={data} />;
    if (type === 'line') return <Line ref={chartRef} options={options} data={data} />;
    return <p>Gráfica no soportada</p>;
}

export default function ChartCard({ chart }) {
    // 1. Generamos las opciones inteligentes basadas en los datos
    const smartOptions = getSmartOptions(chart.type, chart.data);
    const chartRef = useRef(null);
    const containerRef = useRef(null);

    // 2. Asignación de colores (igual que antes, pero un poco más limpia)
    const chartData = {
        ...chart.data,
        datasets: chart.data.datasets.map(dataset => {
            
            // CASO 1: GRÁFICA DE BARRAS
            if (chart.type === 'bar') {
                return {
                    ...dataset,
                    // Estado Normal: Color version ligth con opacidad
                    backgroundColor: CHART_COLORS.SECONDARY_BLUE_LIGHT, 
                    borderColor: CHART_COLORS.SECONDARY_BLUE,
                    borderRadius: 6,
                    borderWidth: 2,

                    // Estado HOVER (¡Aquí está la magia!)
                    hoverBackgroundColor: CHART_COLORS.SECONDARY_BLUE, // Se vuelve sólido (brilla más)
                    hoverBorderColor: CHART_COLORS.BRAND_SEDECYT, // Le sale un borde azul oscuro
                };
            }

            // CASO 2: GRÁFICA DE PASTEL
            if (chart.type === 'pie') {
                return {
                    ...dataset,
                    backgroundColor: [
                        CHART_COLORS.PRIMARY_MAGENTA_LIGHT,
                        CHART_COLORS.ACCENT_LIME_LIGHT,
                        CHART_COLORS.SECONDARY_BLUE_LIGHT,
                        CHART_COLORS.ACCENT_YELLOW_LIGHT,
                    ],
                    borderColor: [
                        CHART_COLORS.PRIMARY_MAGENTA,
                        CHART_COLORS.ACCENT_LIME,
                        CHART_COLORS.SECONDARY_BLUE,
                        CHART_COLORS.ACCENT_YELLOW,
                    ],
                    borderWidth: 2,

                    // Estado HOVER
                    // Hacemos que los colores se vuelvan sólidos al pasar el mouse
                    hoverBackgroundColor: [
                        CHART_COLORS.PRIMARY_MAGENTA,
                        CHART_COLORS.ACCENT_LIME,
                        CHART_COLORS.SECONDARY_BLUE,
                        CHART_COLORS.ACCENT_YELLOW,
                    ],
                    hoverBorderWidth: 4, // El borde crece
                    hoverOffset: 20 // <--- ESTO ES CLAVE: La rebanada "salta" hacia afuera 20px
                };
            }

            // CASO 3: LÍNEAS (Ya lo tenías bien, pero le damos un toque extra en los puntos)
            if (chart.type === 'line') {
                return {
                    ...dataset,
                    borderColor: CHART_COLORS.BRAND_SEDECYT,
                    backgroundColor: CHART_COLORS.BRAND_SEDECYT + '66',
                    fill: true,
                    // Hacemos que el punto se agrande al pasar el mouse
                    pointHoverRadius: 8, 
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: CHART_COLORS.BRAND_SEDECYT,
                    pointHoverBorderWidth: 3,
                };
            }
            
            return dataset;
        })
    };

    // Helper para obtener el <canvas> real del chart
    const getCanvasEl = () => {
        if (!chartRef.current && !containerRef.current) return null;
        // react-chartjs-2 ref apunta al chart instance que tiene .canvas en v4
        if (chartRef.current?.canvas) return chartRef.current.canvas;
        // fallback: buscar canvas dentro del contenedor
        return containerRef.current?.querySelector('canvas') || null;
    };

    // Descarga imagen (png/jpg)
    const downloadImage = async (format = 'png') => {
        try {
            const canvas = getCanvasEl();
            if (!canvas) {
                alert('No se encontró el canvas del gráfico.');
                return;
            }
            // para mejor resolución puedes escalar (por ejemplo scale=2 para Retina)
            const scale = 2;
            const w = canvas.width;
            const h = canvas.height;
            const off = document.createElement('canvas');
            off.width = w * scale;
            off.height = h * scale;
            const ctx = off.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(canvas, 0, 0);

            const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
            const dataUrl = off.toDataURL(mime, 0.92);

            // Forzar descarga
            const link = document.createElement('a');
            const safeTitle = (chart.title || 'chart').replace(/\s+/g, '-').toLowerCase();
            link.href = dataUrl;
            link.download = `${safeTitle}.${format === 'jpg' ? 'jpg' : 'png'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
            alert('Error al generar la imagen.');
        }
    };

    // Generar PDF con jsPDF
    const downloadPDF = async () => {
        try {
            const canvas = getCanvasEl();
            if (!canvas) {
                alert('No se encontró el canvas del gráfico.');
                return;
            }
            const scale = 2;
            const w = canvas.width;
            const h = canvas.height;
            const off = document.createElement('canvas');
            off.width = w * scale;
            off.height = h * scale;
            const ctx = off.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(canvas, 0, 0);
            const dataUrl = off.toDataURL('image/png', 0.92);

            // Crear PDF con las mismas dimensiones en px
            const pdf = new jsPDF({
                orientation: w >= h ? 'landscape' : 'portrait',
                unit: 'px',
                format: [w, h]
            });

            // addImage formato: ('dataUrl', fmt, x, y, w, h)
            pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);

            const safeTitle = (chart.title || 'chart').replace(/\s+/g, '-').toLowerCase();
            pdf.save(`${safeTitle}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Error al generar el PDF.');
        }
    };

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeaderRow}>
                <h3 className={styles.chartTitle}>{chart.title}</h3>

                <div className={styles.chartActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => downloadImage('jpg')}
                        title="Descargar JPG"
                        type="button"
                    >
                        JPG
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={() => downloadImage('png')}
                        title="Descargar PNG"
                        type="button"
                    >
                        PNG
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={downloadPDF}
                        title="Exportar a PDF"
                        type="button"
                    >
                        PDF
                    </button>
                </div>
            </div>

            <div ref={containerRef} className={styles.chartContainer}>
                <ChartRenderer
                    type={chart.type}
                    data={chartData}
                    options={smartOptions}
                    chartRef={chartRef}
                />
            </div>
        </div>
    );
}