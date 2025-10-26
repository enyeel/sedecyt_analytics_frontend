//  /app/page.js

// This line tells Next.js this is a Client-Side (CSR) component.
// This is necessary because charts are interactive and run in the browser.
'use client'; 

// Import chart components
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Import your test data
import dashboardData from './test-data.json';

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// This is your "unpacking" function
function ChartRenderer({ chart }) {
  if (chart.type === 'bar') {
    return <Bar data={chart.data} options={{ title: { display: true, text: chart.title } }} />;
  }
  if (chart.type === 'pie') {
    return <Pie data={chart.data} options={{ title: { display: true, text: chart.title } }} />;
  }
  return null;
}

// This is your main page
export default function DashboardPage() {
  return (
    <div>
      <h1>{dashboardData.dashboard_name}</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Loop through (unpack) the charts and render them */}
        {dashboardData.charts.map(chart => (
          <div key={chart.chart_id} style={{ width: '400px', height: '400px' }}>
            <h2>{chart.title}</h2>
            <ChartRenderer chart={chart} />
          </div>
        ))}

      </div>
    </div>
  );
}