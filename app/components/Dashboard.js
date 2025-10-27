"use client"; // También es un componente de cliente

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Importa tus datos (esto después vendrá de tu API)
import dashboardData from '../test-data.json'; // Ajusta la ruta

// Registra los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Esta función "desempaca" y decide qué gráfico renderizar
function ChartRenderer({ chart }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chart.title,
      },
    },
  };

  if (chart.type === 'bar') {
    return <Bar options={options} data={chart.data} />;
  }
  if (chart.type === 'pie') {
    return <Pie options={options} data={chart.data} />;
  }
  return null;
}

// Este es tu componente de Dashboard
// Le pasamos 'session' por si lo necesitas, y un botón de Logout
export default function Dashboard({ session, onLogout }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{dashboardData.dashboard_name}</h1>
        <button onClick={onLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
      <p>Bienvenido, {session.user.email}</p>
      
      <div className="charts-grid">
        {dashboardData.charts.map((chart) => (
          <div key={chart.chart_id} className="chart-card">
            <ChartRenderer chart={chart} />
          </div>
        ))}
      </div>

      {/* Estilos para el dashboard */}
      <style jsx global>{`
        .dashboard-container {
          width: 90%;
          max-width: 1200px;
          margin: 2rem auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-logout {
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          background: #ff0066; /* Magenta */
          color: white;
          transition: opacity 0.3s;
        }
        .btn-logout:hover {
          opacity: 0.8;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .chart-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
