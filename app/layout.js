import './globals.css';

export const metadata = {
  title: 'Sedecyt Analytics',
  description: 'Dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="appHeader">
          <img src="/logo.png" alt="logo" />

          <div className="headerActions">
            <button className="helpButton" title="Ayuda" aria-label="Ayuda">?</button>

            <div className="searchWrap" role="search">
              <input type="search" className="searchInput" placeholder="Buscar por empresa..." aria-label="Buscar por empresa" />
            </div>

            <button className="headerButton logoutButton" title="Cerrar sesión">Cerrar sesión</button>
          </div>
        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}