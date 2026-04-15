import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/producto.css';

const Producto = () => {
    const { id } = useParams();

    // Estados de datos
    const [producto, setProducto] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [fotoActiva, setFotoActiva] = useState(0);

    // Estados del Modal Probador 3D
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [altura, setAltura] = useState(175);
    const [peso, setPeso] = useState(75);

    const BACKEND_URL = 'http://localhost:3000';

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/camisetas/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setProducto(data.producto);
                    setStock(data.stock);
                    setImagenes(data.imagenes.map(img => img.url));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error obteniendo el producto:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Cargando PVREZA CLUB...</div>;
    if (!producto) return <div className="loading">Producto no encontrado</div>;

    return (
        <main>
            <section className="banner">
                <div className="banner-content">
                    <h2>PVREZA CLUB®</h2>
                    <p>CREATED TO CREATE</p>
                </div>
            </section>

            <section className="product">
                <div className="carousel" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div
                        className="carousel-track"
                        style={{
                            display: 'flex',
                            transition: 'transform 0.4s ease-in-out',
                            transform: `translateX(-${fotoActiva * 100}%)`
                        }}
                    >
                        {/* Si hay fotos en la nueva tabla, las mostramos. Si no, mostramos la foto principal antigua por si acaso */}
                        {imagenes.length > 0 ? (
                            imagenes.map((fotoUrl, index) => (
                                <img
                                    key={index}
                                    src={`${BACKEND_URL}${fotoUrl}`}
                                    alt={`${producto.nombre} - vista ${index + 1}`}
                                    style={{ width: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '3/4' }}
                                />
                            ))
                        ) : (
                            <img
                                src={`${BACKEND_URL}${producto.imagen_url}`}
                                alt={producto.nombre}
                                style={{ width: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '3/4' }}
                            />
                        )}
                    </div>

                    {/* Flechas de navegación (solo se muestran si hay más de 1 foto) */}
                    {imagenes.length > 1 && (
                        <>
                            <button
                                onClick={() => setFotoActiva(prev => prev === 0 ? imagenes.length - 1 : prev - 1)}
                                className="slider-arrow left"
                            >
                                &#10094;
                            </button>
                            <button
                                onClick={() => setFotoActiva(prev => prev === imagenes.length - 1 ? 0 : prev + 1)}
                                className="slider-arrow right"
                            >
                                &#10095;
                            </button>
                        </>
                    )}

                    {/* Puntos de navegación */}
                    {imagenes.length > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px', position: 'absolute', bottom: '15px', width: '100%' }}>
                            {imagenes.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setFotoActiva(index)}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: fotoActiva === index ? '#000' : '#ccc',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-details">
                    <h1>{producto.nombre}</h1>
                    <p className="price">{producto.precio} €</p>

                    <div className="color-options">
                        <button className="boton-camis">
                            <img src={`${BACKEND_URL}${producto.imagen_url}`} alt="Color Único" />
                        </button>
                    </div>

                    <div className="size-container">
                        <div className="size-options">
                            {stock.map((item) => (
                                <button
                                    key={item.id_stock}
                                    disabled={item.cantidad <= 0}
                                    className={tallaSeleccionada?.id_stock === item.id_stock ? 'selected' : ''}
                                    onClick={() => setTallaSeleccionada(item)}
                                    title={item.cantidad <= 0 ? "Sin stock" : ""}
                                >
                                    {item.talla}
                                </button>
                            ))}
                        </div>
                        {tallaSeleccionada && (
                            <p style={{ fontSize: '11px', marginTop: '10px', color: '#888' }}>
                                {tallaSeleccionada.cantidad} unidades disponibles
                            </p>
                        )}
                    </div>

                    {/* BOTÓN PARA ABRIR EL MODAL */}
                    <button
                        className="tryon-trigger-btn"
                        type="button"
                        onClick={() => setIsTryOnOpen(true)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M12 3v19"></path><path d="M5 10h14"></path><path d="M5 15h14"></path>
                        </svg>
                        Probar en mi Avatar 3D
                    </button>

                    <button
                        className="add-to-cart"
                        disabled={!tallaSeleccionada}
                        style={{ opacity: tallaSeleccionada ? 1 : 0.5 }}
                    >
                        {tallaSeleccionada ? 'Añadir al carrito' : 'Selecciona una talla'}
                    </button>

                    <details className="product-details-section">
                        <summary><strong>Detalles del Producto</strong></summary>
                        <p>{producto.descripcion}</p>
                    </details>

                    <details className="size-guide-section">
                        <summary><strong>Guia de Tallas</strong></summary>
                        <p>Medidas aproximadas para el corte de PVREZA CLUB:</p>
                        <ul>
                            <li>S: Pecho 88-92 cm</li>
                            <li>M: Pecho 92-96 cm</li>
                            <li>L: Pecho 96-100 cm</li>
                            <li>XL: Pecho 100-104 cm</li>
                        </ul>
                    </details>
                </div>
            </section>

            {/* =========================================
                MODAL DEL PROBADOR VIRTUAL
                ========================================= */}
            {isTryOnOpen && (
                <div className="tryon-modal" style={{ display: 'block' }}>
                    <div className="tryon-content">
                        {/* BOTÓN CERRAR */}
                        <span
                            className="tryon-close"
                            onClick={() => setIsTryOnOpen(false)}
                        >
                            &times;
                        </span>

                        <div className="tryon-layout">
                            <div id="avatar-canvas-container" className="tryon-canvas">
                                <p id="loading-text" style={{ color: '#666' }}>Cargando probador...</p>
                            </div>

                            <div className="tryon-controls">
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Configura tu Avatar</h2>

                                {/* SLIDER ALTURA */}
                                <label htmlFor="height-slider">Altura</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="range"
                                        id="height-slider"
                                        min="150"
                                        max="210"
                                        value={altura}
                                        onChange={(e) => setAltura(e.target.value)}
                                    />
                                    <span id="height-val" style={{ fontWeight: 'bold' }}>{altura} cm</span>
                                </div>

                                {/* SLIDER PESO */}
                                <label htmlFor="weight-slider" style={{ marginTop: '15px' }}>Peso</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="range"
                                        id="weight-slider"
                                        min="50"
                                        max="120"
                                        value={peso}
                                        onChange={(e) => setPeso(e.target.value)}
                                    />
                                    <span id="weight-val" style={{ fontWeight: 'bold' }}>{peso} kg</span>
                                </div>

                                <div className="tryon-actions" style={{ marginTop: '30px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>El modelo 3D se ajustará automáticamente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Producto;