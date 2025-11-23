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
    // ⬇️ [NUEVO] Estado para controlar el modal de FAQ ⬇️
    const [isFaqOpen, setIsFaqOpen] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevenimos que el form recargue la página
        setLoading(true);
        setErrorMessage(null); // Limpiamos errores previos

        try {
            // Usamos el email y password del \"estado\"
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Si Supabase da error, lo mostramos
                console.error("Error de Supabase:", error.message);
                setErrorMessage(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
            } else if (data.session) {
                // ¡Éxito! Llamamos a la función que nos pasó el \"portero\"
                onLogin(data.session);
            }
        } catch (error) {
            setErrorMessage("Error de conexión inesperado.");
        } finally {
            setLoading(false);
        }
    };

    // ⬇️ [NUEVO] Lista de preguntas y respuestas para el FAQ ⬇️
    const faqs = [
        {
            q: '¿Cómo restablezco mi contraseña?',
            a: 'Usa el enlace "¿Olvidaste tu contraseña?" debajo del formulario de inicio de sesión. Recibirás un correo electrónico con instrucciones para generar una nueva. si eres Romel buena suerte',
        },
        {
            q: '¿Quién puede acceder a este sistema?',
            a: 'El acceso está restringido a personal autorizado de SEDECYT. Si crees que deberías tener acceso, te equivocas.',
        },
        {
            q: '¿Puedo exportar los datos de las gráficas?',
            a: 'Que te importa, pero sí, la plataforma permite descargar los datos y las imágenes de las gráficas '
        },
        {
            q: '¿Tienes una queja?',
            a: 'Lol, que mal.',
        },
        {
            q: '¿El fondo esta verde?',
            a: 'RACISTA, MI PROBLEMA NO ES.',
        },
    ];

    return (
        // El contenedor principal del formulario
        <>
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <p className={styles.subtitle}>Portal de Analítica SEDECYT</p>
                
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <form onSubmit={handleLogin} className={styles.loginForm}>
                {/* ... inputs y botón de login ... */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>
            <div className={styles.extraLinks}>
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
        </div>

        {/* ========================================= */ }
        {/* BOTÓN Y MODAL FAQ ⬇️ */ }
        {/* ========================================= */ }
        <button
            className={styles.faqButton}
            onClick={() => setIsFaqOpen(true)}
            aria-label="Abrir Preguntas Frecuentes"
            title="Ayuda y Preguntas Frecuentes"
        >
            ❓
        </button>

        {isFaqOpen && (
                <div className={styles.faqModalOverlay} onClick={() => setIsFaqOpen(false)}>
                    <div
                        className={styles.faqModalContent}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button
                            className={styles.faqCloseButton}
                            onClick={() => setIsFaqOpen(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <h2>Preguntas Frecuentes</h2>
                        <div className={styles.faqList}>
                            {faqs.map((item, index) => (
                                <div key={index} className={styles.faqItem}>
                                    <h4 className={styles.faqQuestion}>{item.q}</h4>
                                    <p className={styles.faqAnswer}>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}