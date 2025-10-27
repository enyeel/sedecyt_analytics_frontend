// Importa los estilos globales
import "./globals.css";

export const metadata = {
  title: "SEDECYT Analytics",
  description: "Plataforma de analítica de SEDECYT",
};

// El RootLayout ahora es SÚPER simple.
// Solo define el <html> y <body>
// 'children' será nuestro 'page.js'
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* 'page.js' se encargará de todo lo demás,
            incluyendo el header y el main container
        */}
        {children}
      </body>
    </html>
  );
}

