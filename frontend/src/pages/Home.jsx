import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';
import { getProductos } from '../api/productosApi';
import { BACKEND_URL } from '../constants';
import '../styles/home.css';
import '../styles/catalogo.css';

const VIDEO_DESKTOP = '/assets/video/video-fondo.mp4';
const VIDEO_MOBILE = '/assets/video/AB1946FC-E73B-43A4-A7BF-9C71844C20F9.mov';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-overlay">
      <img src="/assets/img/png_en_negro.png" alt="Pvreza Club" className="splash-logo" />
    </div>
  );
};

SplashScreen.propTypes = { onFinish: PropTypes.func.isRequired };

const HeroVideo = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoSource = isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP;

  return (
    <div className="hero-wrapper">
      <video key={videoSource} autoPlay muted loop playsInline className="hero-video">
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

const Home = () => {
  usePageTitle('Inicio');
  const { isCartOpen, isMenuOpen } = useContext(CartContext);
  const [showSplash, setShowSplash] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;
    getProductos()
      .then(res => { if (!cancelado) setProductos(res.data); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="page-enter">
      {!isCartOpen && !isMenuOpen && <Banner />}

      <section className="hero-section">
        <HeroVideo />
      </section>

      <section className="productos-section">
        <h2 className="drops-title">ALL PRODUCTS</h2>
        {loading && <p className="catalogo-loading">CARGANDO...</p>}
        {!loading && productos.length > 0 && (
          <div className="catalogo-grid">
            {productos.map(producto => (
              <Link to={`/producto/${producto.id_producto}`} key={producto.id_producto} className="catalogo-card">
                <div className="catalogo-img-wrapper">
                  <img
                    src={producto.imagen_url ? `${BACKEND_URL}${producto.imagen_url}` : ''}
                    alt={producto.nombre}
                    className="catalogo-img"
                  />
                </div>
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

export default Home;
