import Image from 'next/image'; // Importamos el componente de Imagen de Next.js
import "./globals.css"; // Importa los estilos globales

export const metadata = {
  title: "SEDECYT Analytics",
  description: "Plataforma de analítica de SEDECYT",
};

// Este es el "Header" como un componente de React
function AppHeader({ onLogout, session }) {
  return (
    <header className="appHeader">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Usamos el componente <Image> de Next.js. 
          Debes tener tu logo en 'public/logo-sedec.png' 
        */}
        <Image 
          src="/logo-sedec.png" 
          alt="Logo SEDECYT" 
          width={180} // Ajusta el ancho
          height={60} // Ajusta el alto
          priority // Carga esta imagen primero
        />
      </div>
      
      {/* Mostramos el botón de Logout solo si hay una sesión activa */}
      {session && (
        <button onClick={onLogout} className="headerButton">
          Cerrar Sesión
        </button>
      )}
    </header>
  );
}

// El RootLayout ahora recibe 'children' (que será page.js)
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Aquí iría la lógica del Header. 
          Como el Header necesita saber del "logout", 
          lo manejaremos dentro de 'page.js' por ahora 
          para no complicarnos con estado global.
        */}
        <main className="mainContainer">
          {children}
        </main>
      </body>
    </html>
  );
}
