import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';
import '../styles/home.css';

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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div>
      {!isCartOpen && !isMenuOpen && <Banner />}

      <section className="hero-section">
        <HeroVideo />
      </section>

      <section className="drops-section">
        <h2 className="drops-title">DROPS</h2>
        <div className="drops-grid">
          <Link to="/catalogo/drop-genesis" className="drop-card">
            <img src="/assets/img/camis/IMG_8516a.jpg" alt="Genesis" className="drop-img" />
            <p className="drop-name">GENESIS</p>
          </Link>
          <Link to="/catalogo/isla-bonita" className="drop-card">
            <img src="/assets/img/ISLA BONITA/IMG_7421a.jpg" alt="Isla Bonita" className="drop-img" />
            <p className="drop-name">ISLA BONITA</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
