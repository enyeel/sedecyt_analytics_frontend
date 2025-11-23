'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './AppHeader.module.css';

export default function AppHeader({ session, onLogout }) {
    const [helpOpen, setHelpOpen] = useState(false);
    const [selectedHelp, setSelectedHelp] = useState(null);
    const helpBtnRef = useRef(null);
    const helpMenuRef = useRef(null);

    const onSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const q = (form.elements?.companySearch?.value || '').trim();
        if (!q) return;
        window.dispatchEvent(new CustomEvent('companySearch', { detail: { query: q } }));
    };

    const faqs = [
      { id: 'login', q: 'No puedo iniciar sesión', a: 'Verifica tu usuario/contraseña. Si persiste, restablece contraseña desde la pantalla de login.' },
      { id: 'data', q: 'Los datos no se actualizan', a: 'Los dashboards se actualizan cada hora. Puedes forzar actualización recargando la página.' },
      { id: 'download', q: 'No puedo descargar un informe', a: 'Comprueba permisos de tu cuenta y que tu navegador permita descargas desde este dominio.' }
    ];

    useEffect(() => {
      function onDocClick(e) {
        if (!helpOpen) return;
        if (helpMenuRef.current?.contains(e.target) || helpBtnRef.current?.contains(e.target)) return;
        setHelpOpen(false);
      }
      function onKey(e) {
        if (e.key === 'Escape') setHelpOpen(false);
      }
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [helpOpen]);

    useEffect(() => {
      if (!helpOpen && helpBtnRef.current) helpBtnRef.current.focus();
    }, [helpOpen]);

    return (
        <header className={styles.appHeader}>
            <div className={styles.left}>
                <Image 
                    src="/logo.png" 
                    alt="SEDECyT Logo" 
                    className={styles.logo}
                    width={342} // 3. OBLIGATORIO: Define ancho (el real de tu imagen optimizada)
                    height={100} // 3. OBLIGATORIO: Define alto (para evitar saltos de layout - CLS)
                    priority={true} // 4. LA CLAVE: Esto le da máxima prioridad de carga
                />
            </div>

            <div className={styles.center} />

            {session ? (
              <div className={styles.right}>
                    <form onSubmit={onSearch} className={styles.searchForm}>
                        <div className={styles.searchWrap} role="search">
                            <input
                                name="companySearch"
                                type="search"
                                className={styles.searchInput}
                                placeholder="Buscar por empresa..."
                                aria-label="Buscar por empresa"
                            />
                        </div>
                    </form>

                    {/* soporte ahora dentro del bloque derecho con menú */}
                    <div className={styles.helpWrap}>
                      <button
                        ref={helpBtnRef}
                        className={styles.helpButton}
                        title="Soporte"
                        aria-haspopup="true"
                        aria-expanded={helpOpen}
                        onClick={() => { setHelpOpen(v => !v); setSelectedHelp(null); }}
                        type="button"
                      >
                        ?
                      </button>

                      {helpOpen && (
                        <div
                          ref={helpMenuRef}
                          className={styles.helpMenu}
                          role="dialog"
                          aria-label="Ayuda y soporte"
                        >
                          {!selectedHelp ? (
                            <>
                              <div className={styles.helpList}>
                                {faqs.map(item => (
                                  <button
                                    key={item.id}
                                    className={styles.helpItem}
                                    onClick={() => setSelectedHelp(item)}
                                  >
                                    {item.q}
                                  </button>
                                ))}
                              </div>

                              <div className={styles.contactInline}>
                                <small>¿No encuentras la respuesta?</small>
                                <button
                                  className={styles.contactLink}
                                  onClick={() => setSelectedHelp({ q: 'Contacto de soporte', a: 'Email: soporte@sedecyt.gov.ar • Tel: +54 11 1234-5678' })}
                                >
                                  Contactar soporte
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className={styles.helpSolution}>
                              <button
                                className={styles.backBtn}
                                onClick={() => setSelectedHelp(null)}
                                aria-label="Volver a preguntas"
                              >
                                ←
                              </button>
                              <h4 className={styles.helpQ}>{selectedHelp.q}</h4>
                              <p className={styles.helpA}>{selectedHelp.a}</p>

                              <div className={styles.contactBox}>
                                <strong>Soporte:</strong>
                                <div>Nombre: Equipo de Soporte SEDECYT</div>
                                <div>Email: <a href="mailto:soporte@sedecyt.gov.ar">soporte@sedecyt.gov.ar</a></div>
                                <div>Tel: +54 11 1234-5678</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                        className={`${styles.headerButton} ${styles.logoutButton}`}
                        title="Cerrar sesión"
                        onClick={onLogout}
                    >
                        Cerrar sesión
                    </button>
              </div>
            ) : (
              <div className={styles.right} />
            )}
        </header>
    );
}