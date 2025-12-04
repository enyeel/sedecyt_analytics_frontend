import { useState, useMemo } from 'react';
import styles from './DataTable.module.css';

function TextModal({ content, title, onClose }) {
    if (!content) return null;

    return (
        <div className={styles.textModalOverlay} onClick={onClose}>
            <div className={styles.textModalContent} onClick={(e) => e.stopPropagation()}>

                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>{title}</span>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.textModalBody}>
                    {content}
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}

export default function DataTable({ dataPackage }) {
    // Desempaquetamos o manejamos formato viejo por si acaso
    console.log('DataTable received dataPackage:', dataPackage);
    const data = dataPackage?.data || (Array.isArray(dataPackage) ? dataPackage : []);
    const explicitColumns = dataPackage?.columns;

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // 1. Hook para ordenar los datos sin mutar el original
    const sortedData = useMemo(() => {
        if (!data) return [];

        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // Manejo seguro de nulos
                const valA = a[sortConfig.key] ?? '';
                const valB = b[sortConfig.key] ?? '';

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // 2. Función para pedir ordenamiento
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Estado para saber qué celda se abrió
    const [selectedCell, setSelectedCell] = useState(null); // { content: "...", title: "Columna" }

    // Función auxiliar para renderizar la celda
    const renderCellContent = (content, colName) => {
        const text = content ? String(content) : '-';

        // Si el texto es corto, lo mostramos normal
        if (text.length < 50) return text;

        // Si es largo, usamos el truncado con click
        return (
            <div
                className={styles.cellContent}
                onClick={() => setSelectedCell({ content: text, title: colName })}
                title="Clic para ver completo" // Tooltip nativo
            >
                {text}
            </div>
        );
    };

    // 1. Manejo de estados vacíos o nulos
    if (!data || data.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '12px'
            }}>
                No hay datos para mostrar en esta tabla.
            </div>
        );
    }

    const columns = explicitColumns || Object.keys(data[0]);

    return (
        <>
            {/* Renderizamos el Modal si hay celda seleccionada */}
            {selectedCell && (
                <TextModal
                    content={selectedCell.content}
                    title={selectedCell.title}
                    onClose={() => setSelectedCell(null)}
                />
            )}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => requestSort(col)} // Click para ordenar
                                    style={{ cursor: 'pointer', userSelect: 'none' }} // UI Hint
                                    title="Clic para ordenar"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {/* Nombre Capitalizado */}
                                        {col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, ' ')}

                                        {/* Flechita condicional */}
                                        {sortConfig.key === col && (
                                            <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                                        )}
                                        {sortConfig.key !== col && <span style={{ opacity: 0.3 }}>⇅</span>}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col) => {
                                    let cellStyle = {};

                                    // Si la columna es RFC, la forzamos a un tamaño fijo
                                    if (col === 'RFC') {
                                        cellStyle = {
                                            minWidth: '200px',
                                            maxWidth: '200px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        };
                                    }

                                    return (
                                        <td key={`${rowIndex}-${col}`} style={cellStyle} title={col === 'RFC' ? row[col] : ''}>
                                            {/* Si es RFC, mostramos el texto directo (con ellipsis por CSS) */}
                                            {/* Si NO es RFC, usamos el renderCellContent con modal */}

                                            {col === 'RFC'
                                                ? row[col]
                                                : renderCellContent(row[col], col)
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}