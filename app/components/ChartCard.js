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
import { useRef, useState, useEffect } from 'react';
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

  const [exportOpen, setExportOpen] = useState(false);
  const exportBtnRef = useRef(null);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!exportOpen) return;
      if (exportMenuRef.current?.contains(e.target) || exportBtnRef.current?.contains(e.target)) return;
      setExportOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setExportOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [exportOpen]);

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
    if (chartRef.current?.canvas) return chartRef.current.canvas;
    return containerRef.current?.querySelector('canvas') || null;
  };

  // Construye canvas off-screen que incluye título centrado arriba y luego el gráfico
  const buildCanvasWithTitle = (title, scale = 2) => {
    const canvas = getCanvasEl();
    if (!canvas) return null;

    const w = canvas.width;   // device pixels width of original canvas
    const h = canvas.height;
    const titlePadding = 14;
    const titleFontSize = 16;
    const titleHeight = title ? titleFontSize + titlePadding * 1.2 : 0;

    const off = document.createElement('canvas');
    off.width = (w) * scale;
    off.height = (h + titleHeight) * scale;
    const ctx = off.getContext('2d');

    ctx.scale(scale, scale);

    // fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h + titleHeight);

    // dibujar título centrado
    if (title) {
      ctx.fillStyle = '#111';
      ctx.font = `700 ${titleFontSize}px Inter, Arial, sans-serif`;
      ctx.textBaseline = 'middle';
      // medir ancho del texto para centrar
      const textWidth = ctx.measureText(title).width;
      const x = (w - textWidth) / 2;
      const y = titleHeight / 2;
      ctx.fillText(title, x, y);
    }

    ctx.drawImage(canvas, 0, titleHeight);
    return off;
  };

  // Descarga imagen (png/jpg)
  const downloadImage = async (format = 'png') => {
    try {
      const off = buildCanvasWithTitle(chart.title || '', 2);
      if (!off) { alert('No se encontró el canvas del gráfico.'); return; }
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = off.toDataURL(mime, 0.92);
      const link = document.createElement('a');
      const safeTitle = (chart.title || 'chart').replace(/\s+/g, '-').toLowerCase();
      link.href = dataUrl;
      link.download = `${safeTitle}.${format === 'jpg' ? 'jpg' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error al generar la imagen.');
    }
  };

  // Generar PDF con jsPDF
  const downloadPDF = async () => {
    try {
      const off = buildCanvasWithTitle(chart.title || '', 2);
      if (!off) { alert('No se encontró el canvas del gráfico.'); return; }
      const dataUrl = off.toDataURL('image/png', 0.92);
      const w = off.width / 2;
      const h = off.height / 2;
      const pdf = new jsPDF({
        orientation: w >= h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
      const safeTitle = (chart.title || 'chart').replace(/\s+/g, '-').toLowerCase();
      pdf.save(`${safeTitle}.pdf`);
      setExportOpen(false);
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
          <div className={styles.exportWrap}>
            <button
              ref={exportBtnRef}
              className={styles.exportBtn}
              onClick={() => setExportOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={exportOpen}
              type="button"
              title="Descargar"
              aria-label="Opciones de descarga"
            >
              {/* SVG icono de descarga */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 3v10.59l3.3-3.29 1.42 1.42L12 17.42l-4.72-4.7 1.42-1.42L11 13.59V3h1z"></path>
                <path fill="currentColor" d="M5 19h14v2H5z"></path>
              </svg>
            </button>

            {exportOpen && (
              <div ref={exportMenuRef} className={styles.exportMenu} role="menu" aria-label="Opciones de exportación">
                <button className={styles.exportMenuItem} type="button" onClick={() => downloadImage('jpg')}>Descargar JPG</button>
                <button className={styles.exportMenuItem} type="button" onClick={() => downloadImage('png')}>Descargar PNG</button>
                <button className={styles.exportMenuItem} type="button" onClick={downloadPDF}>Exportar PDF</button>
              </div>
            )}
          </div>
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