import { useEffect, useState, useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductos } from '../api/productosApi';
import { BACKEND_URL } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';

const Catalogo = () => {
  const { coleccion } = useParams();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('nombre');
  const { isCartOpen, isMenuOpen } = useContext(CartContext);

  const colecciones = useMemo(() => {
    const cols = [...new Set(todos.map(p => p.coleccion).filter(Boolean))];
    return cols.sort();
  }, [todos]);

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
    let filtered = todos;

    if (coleccion) {
      const slug = coleccion.toLowerCase();
      filtered = filtered.filter(p => {
        const col = (p.coleccion || '').toLowerCase().replaceAll(' ', '-');
        return col === slug;
      });
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    if (ordenar === 'precio-asc') sorted.sort((a, b) => a.precio - b.precio);
    else if (ordenar === 'precio-desc') sorted.sort((a, b) => b.precio - a.precio);
    else sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return sorted;
  }, [todos, coleccion, busqueda, ordenar]);

  return (
    <div>
      {!isCartOpen && !isMenuOpen && <Banner />}
      <section style={styles.page}>
        <h2 style={styles.titulo}>{titulo}</h2>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.filterRow}>
            {!coleccion && colecciones.length > 1 && (
              <div style={styles.filterChips}>
                <Link to="/catalogo" style={{ ...styles.chip, ...(coleccion ? {} : styles.chipActive) }}>
                  TODOS
                </Link>
                {colecciones.map(col => (
                  <Link
                    key={col}
                    to={`/catalogo/${col.toLowerCase().replaceAll(' ', '-')}`}
                    style={styles.chip}
                  >
                    {col.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
            <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)} style={styles.select}>
              <option value="nombre">Nombre A-Z</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {loading && (
          <p style={styles.loading}>CARGANDO...</p>
        )}

        {!loading && productos.length === 0 && (
          <p style={styles.loading}>NO SE ENCONTRARON PRODUCTOS.</p>
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
  titulo: { textAlign: 'center', fontSize: '13px', letterSpacing: '4px', color: '#999', marginBottom: '32px' },
  loading: { textAlign: 'center', letterSpacing: '3px', color: '#999' },
  filters: { maxWidth: '1100px', margin: '0 auto 32px', display: 'flex', flexDirection: 'column', gap: '16px' },
  searchInput: { width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none', letterSpacing: '0.5px' },
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  filterChips: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  chip: { textDecoration: 'none', color: '#666', fontSize: '11px', letterSpacing: '2px', padding: '8px 16px', border: '1px solid #e0e0e0', fontWeight: '600' },
  chipActive: { backgroundColor: '#000', color: '#fff', borderColor: '#000' },
  select: { padding: '8px 12px', border: '1px solid #e0e0e0', fontSize: '12px', letterSpacing: '1px', outline: 'none', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' },
  card: { textDecoration: 'none', color: '#000' },
  img: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
  nombre: { fontSize: '13px', letterSpacing: '2px', fontWeight: '600', marginTop: '12px', marginBottom: '4px' },
  precio: { fontSize: '13px', color: '#666' },
};

export default Catalogo;
