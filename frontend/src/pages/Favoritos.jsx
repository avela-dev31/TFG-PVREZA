import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getFavoritos, removeFavorito } from '../api/authApi';
import { BACKEND_URL } from '../constants';
import { CartContext } from '../context/CartContext';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import '../styles/catalogo.css';

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
            <section className="catalogo-page">
                <h2 className="catalogo-titulo">MIS FAVORITOS</h2>

                {loading && <p className="catalogo-loading">CARGANDO...</p>}

                {!loading && items.length === 0 && (
                    <div className="favoritos-empty">
                        <p>No tienes productos en favoritos.</p>
                        <Link to="/catalogo" className="favoritos-explore-btn">EXPLORAR CATÁLOGO</Link>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="catalogo-grid">
                        {items.map(p => (
                            <div key={p.id_producto} className="favorito-card">
                                <Link to={`/producto/${p.id_producto}`} className="catalogo-card">
                                    <img
                                        src={p.imagen_url ? `${BACKEND_URL}${p.imagen_url}` : ''}
                                        alt={p.nombre}
                                        className="catalogo-img"
                                    />
                                    <p className="catalogo-nombre">{p.nombre}</p>
                                    <p className="catalogo-precio">{p.precio} €</p>
                                </Link>
                                <button onClick={() => handleRemove(p.id_producto)} className="favorito-remove-btn">
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

export default Favoritos;
