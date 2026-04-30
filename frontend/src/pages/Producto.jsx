/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoById, getProductos } from '../api/productosApi';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 💥 Importamos Auth
import AvatarCreator from '../components/AvatarCreator'; // 💥 Importamos el creador 3D
import Banner from '../components/Banner';
import '../styles/producto.css';

const BACKEND_URL = 'http://localhost:3000';

const Producto = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { isAuthenticated, user } = useAuth(); // 💥 Obtenemos estado de login

    const [producto, setProducto] = useState(null);
    const [stock, setStock] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
    const [fotoActiva, setFotoActiva] = useState(0);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    
    // Estados para el avatar
    const [altura, setAltura] = useState(175);
    const [peso, setPeso] = useState(75);
    const [relacionados, setRelacionados] = useState([]);

    // ✅ AÑADE ESTO
    const handleAbrirProbador = () => {
        // Si tiene sesión, le precargamos sus datos
        if (isAuthenticated && user) {
            setAltura(user.altura || 175);
            setPeso(user.peso || 75);
        } else {
            // Si es invitado, ponemos valores por defecto
            setAltura(175);
            setPeso(75);
        }
        // Finalmente, abrimos el modal
        setIsTryOnOpen(true);
    };


    useEffect(() => {
        window.scrollTo(0, 0);
        getProductoById(id)
            .then(res => {
                const data = res.data;
                if (data.ok) {
                    setProducto(data.producto);
                    setStock(data.stock);
                    setImagenes(data.imagenes.map(img => img.url));
                    setFotoActiva(0);
                    setTallaSeleccionada(null);
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
        <Banner/>
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
                                        alt={`${producto.nombre}`}
                                        style={styles.carouselImg}
                                    />
                                ))
                            ) : (
                                <img src={`${BACKEND_URL}${producto.imagen_url}`} alt={producto.nombre} style={styles.carouselImg} />
                            )}
                        </div>
                    </div>
                    {imagenes.length > 1 && (
                        <>
                            <button onClick={anterior} style={{ ...styles.arrow, left: '12px' }}>&#10094;</button>
                            <button onClick={siguiente} style={{ ...styles.arrow, right: '12px' }}>&#10095;</button>
                        </>
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
                    </div>

                    <button style={styles.tryonBtn} onClick={handleAbrirProbador}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <path d="M12 3v19" /><path d="M5 10h14" /><path d="M5 15h14" />
                        </svg>
                        Probar en mi Avatar 3D
                    </button>

                    <button
                        style={{ ...styles.cartBtn, opacity: tallaSeleccionada ? 1 : 0.5 }}
                        disabled={!tallaSeleccionada}
                        onClick={() => addToCart(producto, tallaSeleccionada)}
                    >
                        {tallaSeleccionada ? 'Añadir al carrito' : 'Selecciona una talla'}
                    </button>

                    <details style={styles.details_section}>
                        <summary style={styles.summary}><strong>DETALLES DEL PRODUCTO</strong></summary>
                        <p style={styles.detailsText}>{producto.descripcion}</p>
                    </details>
                </div>
            </section>

            {/* MODAL PROBADOR 3D */}
            {isTryOnOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button onClick={() => setIsTryOnOpen(false)} style={styles.modalClose}>&times;</button>
                        <div style={styles.modalLayout}>
                            
                            {/* 💥 LADO IZQUIERDO: EL AVATAR REAL */}
                            <div style={styles.modalCanvas}>
                                <AvatarCreator 
                                    altura={Number(altura)} 
                                    peso={Number(peso)} 
                                    onAvatarGuardado={() => {}} 
                                />
                            </div>

                            {/* 💥 LADO DERECHO: CONTROLES INTELIGENTES */}
                            <div style={styles.modalControls}>
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>
                                    {isAuthenticated ? 'TUS MEDIDAS GUARDADAS' : 'CONFIGURA TU AVATAR'}
                                </h2>
                                
                                {isAuthenticated ? (
                                    <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '20px', lineHeight: '1.6' }}>
                                        Hola <strong>{user.nombre}</strong>, estamos proyectando tu avatar con los datos de tu perfil.
                                    </p>
                                ) : (
                                    <p style={{ fontSize: '0.85rem', color: '#dc3545', marginBottom: '20px' }}>
                                        ⚠️ No has iniciado sesión. Introduce tus datos manualmente para el probador virtual.
                                    </p>
                                )}

                                <label style={styles.label}>Altura</label>
                                <div style={styles.inputGroup}>
                                    <input type="range" min="150" max="210" value={altura} onChange={e => setAltura(e.target.value)} style={{ flex: 1 }} />
                                    <span style={styles.valDisplay}>{altura} cm</span>
                                </div>

                                <label style={{ ...styles.label, marginTop: '20px' }}>Peso</label>
                                <div style={styles.inputGroup}>
                                    <input type="range" min="50" max="120" value={peso} onChange={e => setPeso(e.target.value)} style={{ flex: 1 }} />
                                    <span style={styles.valDisplay}>{peso} kg</span>
                                </div>

                                <div style={styles.infoBox}>
                                    <p style={{ margin: 0 }}><strong>Talla recomendada:</strong> {altura > 180 || peso > 85 ? 'XL' : 'L'}</p>
                                </div>

                                {!isAuthenticated && (
                                    <Link to="/login" style={styles.loginLink}>¿Quieres guardar tus medidas? Inicia sesión</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

// --- ESTILOS ACTUALIZADOS ---
const styles = {
    // ... mantén tus estilos de loading, banner, product, carousel, details, etc.
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
    details: { display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' },
    nombre: { fontSize: '20px', letterSpacing: '3px', fontWeight: '700', margin: 0 },
    precio: { fontSize: '16px', color: '#333', margin: 0 },
    tallasWrapper: {},
    tallas: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    tallaBtn: { padding: '10px 18px', border: '1px solid #e5e5e5', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' },
    tallaBtnSelected: { border: '1px solid #000', backgroundColor: '#000', color: '#fff' },
    tallaBtnDisabled: { color: '#ccc', cursor: 'not-allowed' },
    tryonBtn: { display: 'flex', alignItems: 'center', padding: '12px 20px', border: '1px solid #000', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px', marginTop: '10px' },
    cartBtn: { padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '3px', fontWeight: '600' },
    details_section: { borderTop: '1px solid #e5e5e5', paddingTop: '12px' },
    summary: { cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', padding: '4px 0' },
    detailsText: { fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: '1.8' },
    
    // MODAL
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' },
    modalContent: { backgroundColor: '#fff', width: '95%', maxWidth: '1000px', height: '85vh', overflow: 'hidden', position: 'relative', borderRadius: '4px' },
    modalClose: { position: 'absolute', top: '20px', right: '25px', background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', zIndex: 10 },
    modalLayout: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', height: '100%' },
    modalCanvas: { backgroundColor: '#f9f9f9', height: '100%', borderRight: '1px solid #eee' },
    modalControls: { padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    label: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888' },
    inputGroup: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' },
    valDisplay: { fontWeight: '700', fontSize: '14px', minWidth: '60px', textAlign: 'right' },
    infoBox: { marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderLeft: '4px solid #000' },
    loginLink: { marginTop: '20px', fontSize: '12px', color: '#000', textDecoration: 'underline', fontWeight: '600' }
};

export default Producto;