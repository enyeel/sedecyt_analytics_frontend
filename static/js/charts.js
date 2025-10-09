/**
 * charts.js
 * Módulo para crear y renderizar gráficas usando Chart.js
 */

let currentChart = null; // Referencia para destruir la gráfica anterior

/**
 * Crea una gráfica de pastel (Doughnut Chart) en el elemento <canvas> dado.
 * @param {string} canvasId - El ID del elemento <canvas> (e.g., 'dashboard-chart').
 * @param {object} data - El objeto de datos de la API (ej. { labels: [...], values: [...] }).
 */
function renderDoughnutChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    
    // Mostrar el canvas si estaba oculto
    ctx.style.display = 'block';

    // 1. Destruir la gráfica anterior si existe
    if (currentChart) {
        currentChart.destroy();
    }

    // 2. Crear nueva gráfica
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels, 
            datasets: [{
                label: 'Resultados',
                data: data.values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.9)', // Verde/Cian para Completado
                    'rgba(255, 205, 86, 0.9)',   // Amarillo para Pendiente
                    'rgba(255, 99, 132, 0.9)',  // Rojo para Fallido
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resumen de Resultados'
                }
            }
        }
    });
}

export { renderDoughnutChart };