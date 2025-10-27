'use client'; // ¡Importante! Este es un componente de cliente

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './LoginForm.module.css'; // ¡Importamos nuestros estilos "modernos"!

// El componente recibe 'onLogin' como prop.
// 'onLogin' es una función que 'page.js' (el portero) le pasa.
export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevenimos que el form recargue la página
        setLoading(true);
        setErrorMessage(null); // Limpiamos errores previos

        try {
            // Usamos el email y password del "estado"
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Si Supabase da error, lo mostramos
                console.error("Error de Supabase:", error.message);
                setErrorMessage(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
            } else if (data.session) {
                // ¡Éxito! Llamamos a la función que nos pasó el "portero"
                onLogin(data.session);
            } else {
                // Caso raro
                setErrorMessage("No se pudo obtener la sesión. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error en el bloque catch:", error);
            setErrorMessage("Ocurrió un error inesperado. Revisa la consola.");
        } finally {
            // Pase lo que pase, dejamos de "cargar"
            setLoading(false);
        }
    };

    // Esto es tu login.html "traducido" a JSX
    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>Iniciar Sesión</h2>

            {/* Si hay un mensaje de error, lo mostramos aquí */}
            {errorMessage && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                    {/* 'htmlFor' en lugar de 'for' */}
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email} // Conectado al "estado"
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el "estado"
                        required
                        disabled={loading} // Deshabilitado mientras carga
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password} // Conectado al "estado"
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el "estado"
                        required
                        disabled={loading} // Deshabilitado mientras carga
                    />
                </div>

                {/* Deshabilitamos el botón y cambiamos el texto
          si está en modo 'loading'.
        */}
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>
            <div className={styles.extraLinks}>
                {/* Estos links por ahora no hacen nada, pero ahí están */}
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
        </div>
    );
}

