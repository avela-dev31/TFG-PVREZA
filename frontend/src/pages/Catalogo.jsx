import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductos } from '../api/productosApi';
import { BACKEND_URL } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Catalogo = () => {
  const { coleccion } = useParams();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isCartOpen, isMenuOpen } = useContext(CartContext);

  const titulo = coleccion
    ? coleccion.replaceAll('-', ' ').toUpperCase()
    : 'ALL PRODUCTS';

  usePageTitle(titulo);

  useEffect(() => {
    let cancelado = false;

    getProductos()
      .then(res => {
        if (!cancelado) setTodos(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => { cancelado = true; };
  }, []);

  const productos = useMemo(() => {
    if (!coleccion) return todos;
    const slug = coleccion.toLowerCase();
    return todos.filter(p => {
      const col = (p.coleccion || '').toLowerCase().replaceAll(' ', '-');
      return col === slug;
    });
  }, [todos, coleccion]);

  return (
    <div>
    {!isCartOpen && !isMenuOpen && <Banner />}
      <section style={styles.page}>
        <h2 style={styles.titulo}>{titulo}</h2>

        {loading && (
          <p style={styles.loading}>CARGANDO...</p>
        )}

        {!loading && productos.length === 0 && (
          <p style={styles.loading}>NO HAY PRODUCTOS EN ESTA COLECCIÓN.</p>
        )}

        {!loading && productos.length > 0 && (
          <div style={styles.grid}>
            {productos.map(producto => (
              <Link to={`/producto/${producto.id_producto}`} key={producto.id_producto} style={styles.card}>
                <img
                  src={producto.imagen_url
                    ? `${BACKEND_URL}${producto.imagen_url}`
                    : '/assets/img/camis/cami_azul.JPG'
                  }
                  alt={producto.nombre}
                  style={styles.img}
                />
                <p style={styles.nombre}>{producto.nombre}</p>
                <p style={styles.precio}>{producto.precio} €</p>
              </Link>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' },
  card: { textDecoration: 'none', color: '#000' },
  img: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
  nombre: { fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginTop: '12px', marginBottom: '4px' },
  precio: { fontSize: '13px', color: '#666' },
};

export default Catalogo;
