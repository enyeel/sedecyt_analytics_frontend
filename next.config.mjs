/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Tus opciones de config van aquí */

  // Le dice a Next.js que genere una carpeta 'out' (static export)
  // cuando corras 'npm run build'.
  output: 'export',

  // Es MUY probable que también necesites esto.
  // El componente <Image> de Next.js no funciona bien en un
  // hosting estático (como Firebase Hosting) sin esto.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;


