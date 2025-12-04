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
      setSelectedHelp(null);
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setHelpOpen(false);
        setSelectedHelp(null);
      }
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
          width={342}
          height={100}
          priority={true}
        />
      </div>

      <div className={styles.center} />

      {session ? (
        <div className={styles.right}>
          {/* búsqueda comentada temporalmente */}
          <div className={styles.helpWrap}>
            <button
              ref={helpBtnRef}
              className={styles.helpButton}
              title="Soporte"
              aria-haspopup="true"
              aria-expanded={helpOpen}
              onClick={() => { setHelpOpen(v => !v); if (helpOpen) setSelectedHelp(null); }}
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
                <div className={styles.helpList}>
                  {faqs.map(item => (
                    <div key={item.id} className={styles.helpItemWrap}>
                      <button
                        className={`${styles.helpItem} ${selectedHelp?.id === item.id ? styles.activeHelpItem : ''}`}
                        onClick={() => setSelectedHelp(prev => (prev?.id === item.id ? null : item))}
                        type="button"
                      >
                        {item.q}
                      </button>

                      {selectedHelp?.id === item.id && (
                        <div className={styles.helpPanel} role="region" aria-live="polite">
                          <p className={styles.helpA}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.contactInline}>
                  <small>¿No encuentras la respuesta?</small>
                  <button
                    className={styles.contactLink}
                    onClick={() => setSelectedHelp(prev => (prev?.id === 'contact' ? null : { id: 'contact' }))}
                    type="button"
                  >
                    Contactar soporte
                  </button>
                </div>

                {selectedHelp?.id === 'contact' && (
                  <div className={styles.helpPanel} role="region" aria-live="polite">
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