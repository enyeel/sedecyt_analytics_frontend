'use client';
import React from 'react';
import styles from './ErrorBoundary.module.css'; // Crearemos este CSS abajo

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Aquí podrías mandar el error a un servicio de logs (Sentry, etc)
        console.error("🔥 Error capturado por ErrorBoundary:", error, errorInfo);
    }

    handleReset = () => {
        // Intentar recuperar la app (ej. recargar la página o resetear estado)
        this.setState({ hasError: false });
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            // ¡AQUÍ ESTÁ TU DISEÑO DE EMERGENCIA!
            return (
                <div className={styles.crashContainer}>
                    <div className={styles.crashBox}>
                        <h2 className={styles.crashTitle}>¡Ups! Algo salió mal 😵</h2>
                        <p className={styles.crashMessage}>
                            La aplicación ha encontrado un error inesperado. No te preocupes, no rompiste nada.
                        </p>

                        {/* Opcional: Mostrar detalle técnico sutilmente */}
                        <details className={styles.details}>
                            <summary>Ver detalle del error (para soporte)</summary>
                            <pre>{this.state.error?.message || "Error desconocido"}</pre>
                        </details>

                        <div className={styles.actions}>
                            <button className={styles.retryBtn} onClick={this.handleReset}>
                                🔄 Intentar Recargar
                            </button>

                            <a href="mailto:soporte@sedecyt.gob.mx" className={styles.supportBtn}>
                                ✉️ Contactar Soporte
                            </a>
                        </div>
                    </div>

                    {/* EL BOTÓN FLOTANTE FORZADO (Tu salvavidas) */}
                    <div className={styles.emergencyHelp}>
                        ❓ Ayuda Urgente
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;