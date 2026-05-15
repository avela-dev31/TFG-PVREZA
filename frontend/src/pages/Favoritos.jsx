import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getFavoritos, removeFavorito } from '../api/authApi';
import { BACKEND_URL } from '../constants';
import { CartContext } from '../context/CartContext';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';

const Favoritos = () => {
    usePageTitle('Favoritos');
    const { isCartOpen, isMenuOpen } = useContext(CartContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFavoritos()
            .then(res => setItems(res.data))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (idProducto) => {
        await removeFavorito(idProducto);
        setItems(prev => prev.filter(p => p.id_producto !== idProducto));
    };

    return (
        <div>
            {!isCartOpen && !isMenuOpen && <Banner />}
            <section style={styles.page}>
                <h2 style={styles.titulo}>MIS FAVORITOS</h2>

                {loading && <p style={styles.loading}>CARGANDO...</p>}

                {!loading && items.length === 0 && (
                    <div style={styles.empty}>
                        <p>No tienes productos en favoritos.</p>
                        <Link to="/catalogo" style={styles.link}>EXPLORAR CATÁLOGO</Link>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div style={styles.grid}>
                        {items.map(p => (
                            <div key={p.id_producto} style={styles.card}>
                                <Link to={`/producto/${p.id_producto}`} style={styles.cardLink}>
                                    <img
                                        src={p.imagen_url ? `${BACKEND_URL}${p.imagen_url}` : ''}
                                        alt={p.nombre}
                                        style={styles.img}
                                    />
                                    <p style={styles.nombre}>{p.nombre}</p>
                                    <p style={styles.precio}>{p.precio} €</p>
                                </Link>
                                <button onClick={() => handleRemove(p.id_producto)} style={styles.removeBtn}>
                                    ELIMINAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

const styles = {
    page: { padding: '48px 24px' },
    titulo: { textAlign: 'center', fontSize: '13px', letterSpacing: '4px', color: '#999', marginBottom: '48px' },
    loading: { textAlign: 'center', letterSpacing: '3px', color: '#999' },
    empty: { textAlign: 'center', color: '#666', fontSize: '14px' },
    link: { display: 'inline-block', marginTop: '20px', padding: '14px 32px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', letterSpacing: '3px', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' },
    card: { position: 'relative' },
    cardLink: { textDecoration: 'none', color: '#000' },
    img: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
    nombre: { fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginTop: '12px', marginBottom: '4px' },
    precio: { fontSize: '13px', color: '#666', margin: 0 },
    removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '1.5px', color: '#999', textDecoration: 'underline', marginTop: '8px', padding: 0 },
};

export default Favoritos;
