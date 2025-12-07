'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DataTable from './DataTable';
import SkeletonLoader from './SkeletonLoader';
import styles from './DataDrawer.module.css';

// Reutilizamos tu fetcher global (o impórtalo si lo sacaste a un archivo utils)
const fetcher = async ([url, token]) => {
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error fetching details');
    return response.json();
};

const TABS = [
    { id: 'companies', label: '🏢 Empresas', endpoint: '/api/data/companies-view' },
    { id: 'contacts', label: '👤 Contactos', endpoint: '/api/data/contacts-view' },
    { id: 'responses', label: '📝 Respuestas', endpoint: '/api/data/responses-view' }
];

export default function DataDrawer({ session }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('companies');
    const [shouldFetch, setShouldFetch] = useState(false);

    // Estado para controlar si estamos en modo "Intro"
    const [isIntro, setIsIntro] = useState(true);


    // --- LÓGICA DE FETCH INTELIGENTE ---
    // Solo hacemos fetch si hay sesión, si tenemos endpoint Y SI EL DRAWER ESTÁ ABIERTO
    const currentEndpoint = TABS.find(t => t.id === activeTab)?.endpoint;

    // Reutilizamos tu fetcher global (o impórtalo si lo sacaste a un archivo utils)
    const { data, error, isLoading } = useSWR(
        session && shouldFetch && currentEndpoint
            ? [`${process.env.NEXT_PUBLIC_API_URL}${currentEndpoint}`, session.access_token]
            : null,
        fetcher,
        {
            revalidateOnFocus: false, // No recargar al cambiar ventana
            revalidateOnReconnect: false, // No recargar si falla internet y vuelve
            keepPreviousData: true, // 🔥 CLAVE: Si cambias de tab y carga, muestra lo anterior

            // 🔥 NUEVO: Evita que un error borre los datos que ya tenías
            shouldRetryOnError: true,

            // 🔥 NUEVO: Deduping (Si pide lo mismo en menos de 2 seg, usa el caché)
            dedupingInterval: 5000,

            // 🔥 NUEVO: Si hay error, NO borres la data cacheada
            fallbackData: null
        }
    );

    // Lógica de clases
    let drawerClass = styles.closed; // Estado base (reposo)

    if (isOpen) {
        drawerClass = styles.open;     // Usuario abrió el cajón (Prioridad 1)
    } else if (isIntro) {
        drawerClass = styles.introAnimation; // Animación inicial (Prioridad 2)
    }

    const handleToggle = () => {
        if (!isOpen) {
            // ABRIR: Activamos datos y animación
            setShouldFetch(true);
            setIsOpen(true);
        } else {
            // CERRAR: Solo desactivamos animación (los datos siguen vivos)
            setIsOpen(false);
            // NO ponemos setShouldFetch(false) aquí todavía... esperamos a que baje.
        }

        if (isIntro) setIsIntro(false);
    };

    return (
        <div
            className={`${styles.drawerContainer} ${drawerClass}`}
            onAnimationEnd={() => {
                if (isIntro) {
                    setIsIntro(false);
                }
                if (!isOpen) {
                    console.log("🔒 Cajón cerrado. Limpiando datos...");
                    setShouldFetch(false); // AHORA SÍ cortamos el fetch y limpiamos memoria
                }
            }}
        >

            {/* 1. LA BARRA GATILLO (Click para abrir/cerrar) */}
            <div className={styles.handleBar} onClick={handleToggle}>
                <span>{isOpen ? 'Ir a vista de Dashboards' : 'Abrir vista de Tablas'}</span>
                <span className={styles.chevron}>▲</span>
            </div>

            {/* 2. EL CONTENIDO (Solo visible al subir) */}
            <div className={styles.content}>
                <div style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s', display: 'contents' }}>

                    {/* Cabecera interna */}
                    <div className={styles.header}>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--blue-black)' }}>Explorador de Datos</h2>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                Visualización de datos crudos validados por el ETL.
                                {console.log('DataDrawer received dataPackage:', data)}
                            </p>
                        </div>

                        {/* Selector de Tablas */}
                        <div className={styles.tabs}>
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Área de Datos */}
                    <div className={styles.tableWrapper}>
                        {isLoading ? (
                            <div style={{padding: '0 2rem 2rem 2rem', height: '100%'}}>
                                <SkeletonLoader type="table" count={10} />
                            </div>
                        ) : error ? (
                            <div style={{ padding: '2rem', color: 'red' }}>Error...</div>
                        ) : (
                            // Tabla directa (el wrapper maneja el scroll)
                            <div className="animate-enter"
                                style={{
                                    opacity: isOpen ? 1 : 0,
                                    transition: 'opacity 1.2s',
                                }}>
                                <DataTable dataPackage={data} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}