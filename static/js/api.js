/**
 * api.js
 * Módulo para manejar las peticiones a la API de Flask en Cloud Run.
 * Debes cambiar la API_BASE_URL.
 */

const API_BASE_URL = "https://tu-servicio-flask-xyz.a.run.app/api/v1"; 

// Función genérica para obtener datos de la API
async function fetchData(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    // Añadir parámetros de búsqueda (ej. ?start=2024-01-01)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            // Manejo de errores HTTP
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        return await response.json(); // Devuelve los datos JSON
    } catch (error) {
        console.error("Fallo al obtener datos de la API:", error);
        return null;
    }
}

// Función específica que usaremos en index.html
async function getDashboardSummary(dashboardId, fechaInicio, fechaFin) {
    console.log(`Pidiendo resumen del dashboard ${dashboardId} para el rango: ${fechaInicio} - ${fechaFin}`);
    
    // Simulando la respuesta si la API no está lista, para poder ver la gráfica de Chart.js
    if (API_BASE_URL.includes("tu-servicio-flask")) {
        console.warn("Usando datos simulados: La URL de la API no ha sido cambiada.");
        return {
            labels: ['Completado', 'Pendiente', 'Fallido'],
            values: [
                Math.floor(Math.random() * 500) + 100, // Datos aleatorios para simular
                Math.floor(Math.random() * 50),
                Math.floor(Math.random() * 20)
            ],
            total: 1000
        };
    }
    
    // Si la API es real, hace la llamada:
    const data = await fetchData(`dashboard/${dashboardId}/summary`, {
        start: fechaInicio,
        end: fechaFin
    });
    return data;
}

// Exportamos las funciones
export { getDashboardSummary };