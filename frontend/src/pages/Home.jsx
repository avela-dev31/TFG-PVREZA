import { Link } from 'react-router-dom';
import Banner from '../components/Banner';

const Home = () => {
  return (
    <div>
      <Banner />

      {/* Hero */}
      <section style={styles.hero}>
        <img src="/assets/img/camis/cami_azul.JPG" alt="Hero" style={styles.heroImg} />
        <div style={styles.heroOverlay}>
          <p style={styles.heroTag}>NEW DROP</p>
          <h2 style={styles.heroTitle}>GENESIS</h2>
          <Link to="/catalogo/genesis" style={styles.heroBtn}>SHOP NOW</Link>
        </div>
      </section>

      {/* Drops */}
      <section style={styles.drops}>
        <h2 style={styles.sectionTitle}>DROPS</h2>
        <div style={styles.dropsGrid}>
          <Link to="/catalogo/genesis" style={styles.dropCard}>
            <img src="/assets/img/camis/cami_azul.JPG" alt="Genesis" style={styles.dropImg} />
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

const styles = {
  hero: { position: 'relative', height: '80vh', overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  heroTag: { color: '#fff', fontSize: '11px', letterSpacing: '4px', marginBottom: '8px' },
  heroTitle: { color: '#fff', fontSize: '48px', letterSpacing: '8px', fontWeight: '700', margin: '0 0 24px' },
  heroBtn: { padding: '14px 40px', backgroundColor: '#fff', color: '#000', textDecoration: 'none', fontSize: '12px', letterSpacing: '3px', fontWeight: '600' },
  drops: { padding: '64px 24px' },
  sectionTitle: { textAlign: 'center', fontSize: '13px', letterSpacing: '4px', marginBottom: '40px', color: '#999' },
  dropsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' },
  dropCard: { textDecoration: 'none', color: '#000' },
  dropImg: { width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
  dropName: { textAlign: 'center', fontSize: '13px', letterSpacing: '3px', fontWeight: '600', marginTop: '16px' },
};

export default Home;