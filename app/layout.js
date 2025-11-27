import './globals.css';
import { Inter } from 'next/font/google';
import ErrorBoundary from './components/ErrorBoundary';

// 2. Configúrala (subsets 'latin' es lo estándar)
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Esto crea la variable CSS automáticamente
});

export const metadata = {
  title: 'SEDECyT Analytics',
  description: 'Plataforma de análisis de datos estratégicos.',
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  // el input despacha un evento custom "companySearch" con detail = { query }
  const onSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const q = (form.elements?.companySearch?.value || '').trim();
    if (!q) return;
    window.dispatchEvent(new CustomEvent('companySearch', { detail: { query: q } }));
  };

  return (
    <html lang="es">
      <body className={inter.className}> 
        <ErrorBoundary>
            <main className="mainContainer">
              {children}
            </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}