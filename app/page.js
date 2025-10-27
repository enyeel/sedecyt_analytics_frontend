"use client"; // ¡El portero DEBE ser un Client Component!

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Nuestro cliente
import LoginForm from '@/app/components/LoginForm'; // El formulario
import Dashboard from '@/app/components/Dashboard'; // El dashboard
import '@/app/globals.css'; // Tus estilos globales

// Esta es la ÚNICA página que el usuario visita al inicio.
export default function HomePage() {
  
  // 'session' es la clave. Si es 'null', no hay sesión.
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta UNA VEZ cuando el componente carga
  useEffect(() => {
    // 1. Obtenemos la sesión activa si existe (ej. si recarga la página)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuchamos CAMBIOS en la sesión (Login o Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Función de limpieza: deja de escuchar cuando el componente se "desmonta"
    return () => subscription.unsubscribe();
  }, []); // El array vacío [] asegura que esto solo corra una vez

  // Función para pasarle al botón de logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange se encargará de poner 'session' en null
  };
  
  // --- El Renderizado Condicional ---
  // Si está cargando, no mostramos nada (o un spinner)
  if (loading) {
    return <div>Cargando...</div>; // O un componente de Spinner
  }

  // Esta es la lógica principal:
  // Si NO hay sesión... muestra el Login.
  // Si SÍ hay sesión... muestra el Dashboard.
  return (
    <div>
      {!session ? (
        <LoginForm />
      ) : (
        <Dashboard session={session} onLogout={handleLogout} />
      )}
    </div>
  );
}
