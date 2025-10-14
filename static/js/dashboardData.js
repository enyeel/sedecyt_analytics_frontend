/**
 * static/js/dashboardData.js
 * * Lista de configuración centralizada de los Dashboards.
 * * Se exporta como módulo JS para ser importado en index.html
 */

const DASHBOARDS_DATA = [
    {
        id: 1,
        titulo: "Holiii",
        descripcion: "Resumen de Ventas, indicadores clave de rendimiento (KPIs) y Rendimiento por región.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+Ventas", // Imagen ilustrativa para la tarjeta
        subreports: [
            {"nombre": "Gráfica Principal (Ingresos)", "url": "reporte/ventas/principal"},
            {"nombre": "Detalle de Clientes", "url": "reporte/ventas/clientes"},
            {"nombre": "Proyecciones 2025", "url": "reporte/ventas/proyecciones"},
            {"nombre": "Rendimiento por Vendedor", "url": "reporte/ventas/vendedores"}
        ]
    },
    {
        id: 2,
        titulo: "Operaciones",
        descripcion: "Métricas de Eficiencia Operacional, tiempos de entrega y tasas de fallo.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+Operaciones",
        subreports: [
            {"nombre": "Logística y Envíos", "url": "reporte/operaciones/logistica"},
            {"nombre": "Inventario en Almacén", "url": "reporte/operaciones/inventario"},
            {"nombre": "Tiempos de Producción", "url": "reporte/operaciones/produccion"}
        ]
    },
    {
        id: 3,
        titulo: "Recursos Humanos",
        descripcion: "Indicadores de Rotación, Desempeño de Personal y satisfacción laboral.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+RRHH",
        subreports: [
            {"nombre": "Tasa de Rotación", "url": "reporte/rh/rotacion"},
            {"nombre": "Ausentismo", "url": "reporte/rh/ausentismo"},
            {"nombre": "Evaluación de Desempeño", "url": "reporte/rh/desempeno"}
        ]
    },
    {
        id: 4,
        titulo: "Finanzas",
        descripcion: "Reporte detallado de Ingresos, Egresos, Balance General y Rentabilidad.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+Finanzas",
        subreports: [
            {"nombre": "Estado de P&G", "url": "reporte/finanzas/pg"},
            {"nombre": "Flujo de Caja", "url": "reporte/finanzas/caja"},
            {"nombre": "Análisis de Rentabilidad", "url": "reporte/finanzas/rentabilidad"}
        ]
    },
    {
        id: 5,
        titulo: "Marketing",
        descripcion: "Análisis de Campañas, ROI, Conversiones y Rendimiento en Redes Sociales.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+Marketing",
        subreports: [
            {"nombre": "Rendimiento de Campañas", "url": "reporte/mkt/campanas"},
            {"nombre": "Social Media (Interacciones)", "url": "reporte/mkt/social"},
            {"nombre": "Costo de Adquisición (CAC)", "url": "reporte/mkt/cac"}
        ]
    },
    {
        id: 6,
        titulo: "Inventario",
        descripcion: "Control de Almacén, Niveles de Stock, Ubicaciones y productos de alta rotación.",
        imagen: "https://via.placeholder.com/400x200?text=Dashboard+Inventario",
        subreports: [
            {"nombre": "Niveles de Stock Críticos", "url": "reporte/inv/stock"},
            {"nombre": "Ubicaciones y Bodegas", "url": "reporte/inv/ubicaciones"},
            {"nombre": "Rotación de Productos", "url": "reporte/inv/rotacion"}
        ]
    }
];

export { DASHBOARDS_DATA };