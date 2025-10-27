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


// Este es el componente principal de la "Tarjeta"
export default function ChartCard({ chart }) {

    // Opciones base para TODAS las gráficas
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            // El título se pondrá por fuera, en el <h3>
        },
    };

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{chart.title}</h3>
            <div className={styles.chartContainer}>
                <ChartRenderer
                    type={chart.type}
                    data={chart.data}
                    options={options}
                />
            </div>
        </div>
    );
}
