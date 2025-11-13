import './globals.css';
import AppHeader from './components/AppHeader';

export const metadata = {
  title: 'Sedecyt Analytics',
  description: 'Dashboard'
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
      <body>
        <AppHeader />

        <main className="mainContainer">
          {children}
        </main>
      </body>
    </html>
  );
}