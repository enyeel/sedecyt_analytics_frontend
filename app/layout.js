import './globals.css';

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
        <header className="appHeader">
          <img src="/logo.png" alt="logo" />

          <div className="headerActions">
            {/* Cerrar sesión */}
            <button className="headerButton logoutButton" title="Cerrar sesión">Cerrar sesión</button>

            {/* Ayuda (entre cerrar sesión y búsqueda) */}
            <button className="helpButton" title="Ayuda" aria-label="Ayuda">?</button>

            {/* Búsqueda por empresa (al lado derecho) */}
            <form onSubmit={onSearch} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="searchWrap" role="search">
                <input
                  name="companySearch"
                  type="search"
                  className="searchInput"
                  placeholder="Buscar por empresa..."
                  aria-label="Buscar por empresa"
                />
              </div>
            </form>
          </div>
        </header>

        <main className="mainContainer">
          {children}
        </main>
      </body>
    </html>
  );
}