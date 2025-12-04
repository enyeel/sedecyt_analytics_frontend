'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './AppHeader.module.css';

export default function AppHeader({ session, onLogout }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showContact, setShowContact] = useState(false);
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
      if (e.key === 'Escape') {
        setHelpOpen(false);
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

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          {/* soporte ahora dentro del bloque derecho con menú */}
          <div className={styles.helpWrap}>
            <button
              ref={helpBtnRef}
              className={styles.helpButton}
              title="Soporte y preguntas frecuentes"
              aria-haspopup="true"
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen(!helpOpen)}
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
                    <div key={item.id}>
                      <button
                        className={`${styles.helpItem} ${expandedId === item.id ? styles.activeHelpItem : ''}`}
                        onClick={() => toggleFaq(item.id)}
                        type="button"
                        aria-expanded={expandedId === item.id}
                      >
                        <span className={styles.helpItemIcon}>
                          {expandedId === item.id ? '▼' : '▶'}
                        </span>
                        {item.q}
                      </button>

                      {expandedId === item.id && (
                        <div className={styles.helpPanel}>
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
                    onClick={() => setShowContact(!showContact)}
                    type="button"
                  >
                    Contactar soporte
                  </button>
                </div>

                {showContact && (
                  <div className={styles.helpPanel}>
                    <div className={styles.contactBox}>
                      <strong>📞 Equipo de Soporte SEDECYT</strong>
                      <div>📧 Email: <a href="mailto:soporte@sedecyt.gov.ar">soporte@sedecyt.gov.ar</a></div>
                      <div>📱 Tel: +54 11 1234-5678</div>
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