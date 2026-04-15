const Banner = () => (
  <section style={styles.banner}>
    <h2 style={styles.title}>PVREZA CLUB®</h2>
    <p style={styles.subtitle}>CREATED TO CREATE</p>
  </section>
);

const styles = {
  banner: { textAlign: 'center', padding: '48px 24px', backgroundColor: '#fff' },
  title: { fontSize: '28px', letterSpacing: '6px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { fontSize: '13px', letterSpacing: '4px', color: '#666', margin: 0 },
};

export default Banner;