import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import usePageTitle from '../hooks/usePageTitle';
import Banner from "../components/Banner";


// ============================================
// CONFIGURA AQUÍ TU HERO
// Pon 'video' o 'carousel'
// ============================================
const HERO_TYPE = 'video'; // 'video' | 'carousel'

const HERO_VIDEOS = [
  '/assets/video/video-fondo.mp4',
  '/assets/video/AB1946FC-E73B-43A4-A7BF-9C71844C20F9.mov',
];

const HERO_FOTOS = [
  '/assets/img/ISLA BONITA/IMG_1943.JPG',
  '/assets/img/ISLA_BONITA/IMG_1866.JPG',
  '/assets/img/camis/cami_gris.JPG',
];
// ============================================

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

SplashScreen.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

const HeroCarousel = () => {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiva(prev => (prev === HERO_FOTOS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={heroStyles.wrapper}>
      {HERO_FOTOS.map((foto, index) => (
        <img
          key={foto}
          src={foto}
          alt={`Hero ${index + 1}`}
          style={{
            ...heroStyles.slide,
            opacity: activa === index ? 1 : 0,
          }}
        />
      ))}
      {/* Puntos */}
      <div style={heroStyles.dots}>
        {HERO_FOTOS.map((foto, index) => (
          <button
            key={foto}
            type="button"
            aria-label={`Ir a imagen ${index + 1}`}
            onClick={() => setActiva(index)}
            style={{ ...heroStyles.dot, backgroundColor: activa === index ? '#fff' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </div>
  );
};

const HeroVideo = () => {
  // 1. Estado para saber si estamos en móvil (pantallas de menos de 768px de ancho)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 2. Efecto para escuchar si el usuario redimensiona la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    // Limpiamos el evento al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Elegimos el vídeo según el dispositivo
  // IMPORTANTE: Asegúrate de tener estos dos archivos en tu carpeta public/assets/video/
  const videoSource = isMobile 
    ? '/assets/video/AB1946FC-E73B-43A4-A7BF-9C71844C20F9.mov' 
    : '/assets/video/video-fondo.mp4';

  return (
    <div style={heroStyles.wrapper}>
      <video
        key={videoSource} // La clave hace que React recargue el vídeo si cambia de móvil a desktop
        autoPlay
        muted
        loop
        playsInline
        style={heroStyles.video}
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

const Home = () => {
  usePageTitle("Inicio");
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
      <Banner/>
        {HERO_TYPE === 'carousel' ? <HeroCarousel /> : <HeroVideo />}
      </section>

      {/* DROPS */}
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

// ============================================
// ESTILOS
// ============================================

const splashStyles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    animation: 'fadeOut 0.5s ease 1.5s forwards',
  },
  logo: { height: '60px', objectFit: 'contain' },
};

const heroStyles = {
  wrapper: { position: 'relative', width: '100%', height: '100%' },
  slide: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', transition: 'opacity 1s ease-in-out',
  },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  tag: { color: '#fff', fontSize: '11px', letterSpacing: '4px', marginBottom: '8px' },
  title: { color: '#fff', fontSize: '48px', letterSpacing: '8px', fontWeight: '700', margin: '0 0 24px' },
  btn: {
    padding: '14px 40px', backgroundColor: '#fff', color: '#000',
    textDecoration: 'none', fontSize: '12px', letterSpacing: '3px', fontWeight: '600',
  },
  dots: {
    position: 'absolute', bottom: '24px', width: '100%',
    display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10,
  },
  dot: { width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'background-color 0.3s' },
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