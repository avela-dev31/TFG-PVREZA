import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoById, getProductos } from '../api/productosApi';

const BACKEND_URL = 'http://localhost:3000';

const Producto = () => {
    const { id } = useParams();

    const [producto, setProducto] = useState(null);
    const [stock, setStock] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
    const [fotoActiva, setFotoActiva] = useState(0);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [altura, setAltura] = useState(175);
    const [peso, setPeso] = useState(75);
    const [relacionados, setRelacionados] = useState([]);

    useEffect(() => {
        setFotoActiva(0);
        setTallaSeleccionada(null);
        window.scrollTo(0, 0);

        getProductoById(id)
            .then(res => {
                const data = res.data;
                if (data.ok) {
                    setProducto(data.producto);
                    setStock(data.stock);
                    setImagenes(data.imagenes.map(img => img.url));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error obteniendo el producto:', err);
                setLoading(false);
            });

        getProductos().then(res => {
            const otros = res.data.filter(p => p.id_producto !== parseInt(id));
            setRelacionados(otros);
        });

    }, [id]);

    const siguiente = () => setFotoActiva(prev => (prev === imagenes.length - 1 ? 0 : prev + 1));
    const anterior = () => setFotoActiva(prev => (prev === 0 ? imagenes.length - 1 : prev - 1));

    if (loading) return <div style={styles.loading}>Cargando PVREZA CLUB...</div>;
    if (!producto) return <div style={styles.loading}>Producto no encontrado</div>;

    return (
        <main>
            {/* Banner */}
            <section style={styles.banner}>
                <h2 style={styles.bannerTitle}>PVREZA CLUB®</h2>
                <p style={styles.bannerSub}>CREATED TO CREATE</p>
            </section>

            <section style={styles.product}>

                {/* CARRUSEL */}
                <div style={styles.carouselWrapper}>
                    <div style={styles.carouselViewport}>
                        <div style={{ ...styles.carouselTrack, transform: `translateX(-${fotoActiva * 100}%)` }}>
                            {imagenes.length > 0 ? (
                                imagenes.map((url, index) => (
                                    <img
                                        key={index}
                                        src={`${BACKEND_URL}${url}`}
                                        alt={`${producto.nombre} - vista ${index + 1}`}
                                        style={styles.carouselImg}
                                    />
                                ))
                            ) : (
                                <img
                                    src={`${BACKEND_URL}${producto.imagen_url}`}
                                    alt={producto.nombre}
                                    style={styles.carouselImg}
                                />
                            )}
                        </div>
                    </div>

                    {imagenes.length > 1 && (
                        <>
                            <button onClick={anterior} style={{ ...styles.arrow, left: '12px' }}>&#10094;</button>
                            <button onClick={siguiente} style={{ ...styles.arrow, right: '12px' }}>&#10095;</button>
                        </>
                    )}

                    {imagenes.length > 1 && (
                        <div style={styles.dots}>
                            {imagenes.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setFotoActiva(index)}
                                    style={{ ...styles.dot, backgroundColor: fotoActiva === index ? '#000' : '#ccc' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* DETALLES */}
                <div style={styles.details}>
                    <h1 style={styles.nombre}>{producto.nombre}</h1>
                    <p style={styles.precio}>{producto.precio} €</p>

                    <div style={styles.tallasWrapper}>
                        <div style={styles.tallas}>
                            {stock.map(item => (
                                <button
                                    key={item.id_stock}
                                    disabled={item.cantidad <= 0}
                                    onClick={() => setTallaSeleccionada(item)}
                                    style={{
                                        ...styles.tallaBtn,
                                        ...(tallaSeleccionada?.id_stock === item.id_stock ? styles.tallaBtnSelected : {}),
                                        ...(item.cantidad <= 0 ? styles.tallaBtnDisabled : {}),
                                    }}
                                >
                                    {item.talla}
                                </button>
                            ))}
                        </div>
                        {tallaSeleccionada && (
                            <p style={styles.stockInfo}>{tallaSeleccionada.cantidad} unidades disponibles</p>
                        )}
                    </div>

                    <button style={styles.tryonBtn} onClick={() => setIsTryOnOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M12 3v19" /><path d="M5 10h14" /><path d="M5 15h14" />
                        </svg>
                        Probar en mi Avatar 3D
                    </button>

                    <button
                        style={{ ...styles.cartBtn, opacity: tallaSeleccionada ? 1 : 0.5 }}
                        disabled={!tallaSeleccionada}
                    >
                        {tallaSeleccionada ? 'Añadir al carrito' : 'Selecciona una talla'}
                    </button>

                    <details style={styles.details_section}>
                        <summary style={styles.summary}><strong>Detalles del Producto</strong></summary>
                        <p style={styles.detailsText}>{producto.descripcion}</p>
                    </details>

                    <details style={styles.details_section}>
                        <summary style={styles.summary}><strong>Guía de Tallas</strong></summary>
                        <ul style={styles.detailsText}>
                            <li>S: Pecho 88-92 cm</li>
                            <li>M: Pecho 92-96 cm</li>
                            <li>L: Pecho 96-100 cm</li>
                            <li>XL: Pecho 100-104 cm</li>
                        </ul>
                    </details>
                </div>
            </section>

            {/* TAMBIÉN TE PUEDE GUSTAR */}
            {relacionados.length > 0 && (
                <section style={stylesRel.section}>
                    <h2 style={stylesRel.titulo}>TAMBIÉN TE PUEDE GUSTAR</h2>
                    <div style={stylesRel.grid}>
                        {relacionados.map(p => (
                            <Link
                                to={`/producto/${p.id_producto}`}
                                key={p.id_producto}
                                style={stylesRel.card}
                            >
                                <img
                                    src={`${BACKEND_URL}${p.imagen_url}`}
                                    alt={p.nombre}
                                    style={stylesRel.img}
                                />
                                <p style={stylesRel.nombre}>{p.nombre}</p>
                                <p style={stylesRel.precio}>{p.precio} €</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* MODAL PROBADOR 3D */}
            {isTryOnOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button onClick={() => setIsTryOnOpen(false)} style={styles.modalClose}>&times;</button>
                        <div style={styles.modalLayout}>
                            <div style={styles.modalCanvas}>
                                <p style={{ color: '#666' }}>Cargando probador...</p>
                            </div>
                            <div style={styles.modalControls}>
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>CONFIGURA TU AVATAR</h2>
                                <label>Altura</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                    <input type="range" min="150" max="210" value={altura} onChange={e => setAltura(e.target.value)} style={{ flex: 1 }} />
                                    <span style={{ fontWeight: 'bold', minWidth: '60px' }}>{altura} cm</span>
                                </div>
                                <label style={{ marginTop: '20px', display: 'block' }}>Peso</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                    <input type="range" min="50" max="120" value={peso} onChange={e => setPeso(e.target.value)} style={{ flex: 1 }} />
                                    <span style={{ fontWeight: 'bold', minWidth: '60px' }}>{peso} kg</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '24px' }}>El modelo 3D se ajustará automáticamente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

const styles = {
    loading: { textAlign: 'center', padding: '100px', letterSpacing: '3px', color: '#999' },
    banner: { textAlign: 'center', padding: '32px 24px', borderBottom: '1px solid #e5e5e5' },
    bannerTitle: { fontSize: '22px', letterSpacing: '6px', fontWeight: '700', margin: '0 0 6px' },
    bannerSub: { fontSize: '11px', letterSpacing: '4px', color: '#999', margin: 0 },
    product: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '1100px', margin: '48px auto', padding: '0 24px' },
    carouselWrapper: { position: 'relative' },
    carouselViewport: { width: '100%', overflow: 'hidden' },
    carouselTrack: { display: 'flex', transition: 'transform 0.4s ease-in-out' },
    carouselImg: { width: '100%', minWidth: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '3/4' },
    arrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '8px 12px', zIndex: 10 },
    dots: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' },
    dot: { width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'background-color 0.3s' },
    details: { display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' },
    nombre: { fontSize: '20px', letterSpacing: '3px', fontWeight: '700', margin: 0 },
    precio: { fontSize: '16px', color: '#333', margin: 0 },
    tallasWrapper: {},
    tallas: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    tallaBtn: { padding: '10px 18px', border: '1px solid #e5e5e5', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' },
    tallaBtnSelected: { border: '1px solid #000', backgroundColor: '#000', color: '#fff' },
    tallaBtnDisabled: { color: '#ccc', cursor: 'not-allowed' },
    stockInfo: { fontSize: '11px', color: '#888', marginTop: '8px' },
    tryonBtn: { display: 'flex', alignItems: 'center', padding: '12px 20px', border: '1px solid #000', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px' },
    cartBtn: { padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '3px', fontWeight: '600' },
    details_section: { borderTop: '1px solid #e5e5e5', paddingTop: '12px' },
    summary: { cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', padding: '4px 0' },
    detailsText: { fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: '1.8' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', padding: '32px', position: 'relative' },
    modalClose: { position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer' },
    modalLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '16px' },
    modalCanvas: { backgroundColor: '#f5f5f5', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalControls: { display: 'flex', flexDirection: 'column' },
};

const stylesRel = {
    section: { maxWidth: '1100px', margin: '64px auto', padding: '0 24px' },
    titulo: { fontSize: '12px', letterSpacing: '4px', color: '#999', marginBottom: '32px', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' },
    card: { textDecoration: 'none', color: '#000' },
    img: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
    nombre: { fontSize: '12px', letterSpacing: '2px', fontWeight: '600', marginTop: '12px', marginBottom: '4px' },
    precio: { fontSize: '12px', color: '#666' },
};

export default Producto;