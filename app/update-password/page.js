'use client'; // Necesario para usar hooks en Next.js App Router

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Asegúrate de importar tu cliente
import { useRouter } from 'next/navigation'; // Para redirigir
import styles from './UpdatePassword.module.css';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Al cargar la página, verifica si hay una sesión de reset válida
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                setError('Enlace inválido o expirado. Intenta de nuevo.');
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            // Redirige a la home después de 2 segundos (para mostrar mensaje de éxito)
            setTimeout(() => router.push('/'), 2000);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>¡Éxito!</h2>
                <p>Contraseña cambiada exitosamente. Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Cambiar Contraseña</h2>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleUpdatePassword} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Nueva Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Ingresa tu nueva contraseña"
                    />
                </div>
                <button type="submit" disabled={loading} className={styles.btn}>
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
            </form>
        </div>
    );
}