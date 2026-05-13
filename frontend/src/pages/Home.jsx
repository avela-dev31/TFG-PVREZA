import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import usePageTitle from '../hooks/usePageTitle';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';

const VIDEO_DESKTOP = '/assets/video/video-fondo.mp4';
const VIDEO_MOBILE = '/assets/video/AB1946FC-E73B-43A4-A7BF-9C71844C20F9.mov';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={splashStyles.overlay}>
      <img src="/assets/img/png_en_negro.png" alt="Pvreza Club" style={splashStyles.logo} />
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
    <div style={heroStyles.wrapper}>
      <video key={videoSource} autoPlay muted loop playsInline style={heroStyles.video}>
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

      <section style={heroStyles.section}>
        <HeroVideo />
      </section>

      <section style={styles.drops}>
        <h2 style={styles.sectionTitle}>DROPS</h2>
        <div style={styles.dropsGrid}>
          <Link to="/catalogo/drop-genesis" style={styles.dropCard}>
            <img src="/assets/img/camis/IMG_8516a.jpg" alt="Genesis" style={styles.dropImg} />
            <p style={styles.dropName}>GENESIS</p>
          </Link>
          <Link to="/catalogo/isla-bonita" style={styles.dropCard}>
            <img src="/assets/img/ISLA BONITA/IMG_7421a.jpg" alt="Isla Bonita" style={styles.dropImg} />
            <p style={styles.dropName}>ISLA BONITA</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

const splashStyles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    animation: 'fadeOut 0.5s ease 1.5s forwards',
  },
  logo: { height: '60px', objectFit: 'contain' },
};

const heroStyles = {
  section: { position: 'relative', height: '90vh', overflow: 'hidden' },
  wrapper: { position: 'relative', width: '100%', height: '100%' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
};

const styles = {
  drops: { padding: '64px 24px' },
  sectionTitle: { textAlign: 'center', fontSize: '13px', letterSpacing: '4px', marginBottom: '40px', color: '#999' },
  dropsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' },
  dropCard: { textDecoration: 'none', color: '#000' },
  dropImg: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
  dropName: { textAlign: 'center', fontSize: '13px', letterSpacing: '3px', fontWeight: '600', marginTop: '16px' },
};

export default Home;