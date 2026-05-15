import { useEffect, useState, useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductos } from '../api/productosApi';
import { BACKEND_URL } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';
import '../styles/catalogo.css';

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
      <section className="catalogo-page">
        <h2 className="catalogo-titulo">{titulo}</h2>

        <div className="catalogo-filters">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="catalogo-search"
          />
          <div className="catalogo-filter-row">
            {!coleccion && colecciones.length > 1 && (
              <div className="catalogo-chips">
                <Link to="/catalogo" className="catalogo-chip active">TODOS</Link>
                {colecciones.map(col => (
                  <Link
                    key={col}
                    to={`/catalogo/${col.toLowerCase().replaceAll(' ', '-')}`}
                    className="catalogo-chip"
                  >
                    {col.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
            <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)} className="catalogo-select">
              <option value="nombre">Nombre A-Z</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {loading && <p className="catalogo-loading">CARGANDO...</p>}

        {!loading && productos.length === 0 && (
          <p className="catalogo-loading">NO SE ENCONTRARON PRODUCTOS.</p>
        )}

        {!loading && productos.length > 0 && (
          <div className="catalogo-grid">
            {productos.map(producto => (
              <Link to={`/producto/${producto.id_producto}`} key={producto.id_producto} className="catalogo-card">
                <img
                  src={producto.imagen_url ? `${BACKEND_URL}${producto.imagen_url}` : ''}
                  alt={producto.nombre}
                  className="catalogo-img"
                />
                <p className="catalogo-nombre">{producto.nombre}</p>
                <p className="catalogo-precio">{producto.precio} €</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalogo;
