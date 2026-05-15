import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { isMenuOpen: menuOpen, setIsMenuOpen: setMenuOpen } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header style={styles.header}>
        {/* Izquierda - Hamburguesa */}
        <div style={styles.headerLeft}>
          <button onClick={() => setMenuOpen(true)} style={styles.iconBtn}>
            <Menu size={28} />
          </button>
        </div>

        {/* Centro - Logo */}
        <div style={styles.headerCenter}>
          <Link to="/">
            <img src="/assets/img/png_en_negro.png" alt="Pvreza Club" style={styles.logo} />
          </Link>
        </div>

        {/* Derecha - Carrito + Usuario */}
        <div style={styles.headerRight}>
          {user ? (
            <Link to="/perfil" style={styles.iconBtn}>
              <User size={26} />
            </Link>
          ) : (
            <Link to="/login" style={styles.iconBtn}>
              <User size={26} />
            </Link>
          )}
          <Link to="/carrito" style={styles.iconBtn}>
            <ShoppingBag size={26} />
          </Link>
        </div>
      </header>

      {/* Menú lateral */}
      {menuOpen && (
        <div style={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div style={styles.sideMenu} onClick={e => e.stopPropagation()}>
            <button onClick={() => setMenuOpen(false)} style={styles.closeBtn}>
              <X size={28} />
            </button>
            <nav style={styles.menuNav}>
              <p style={styles.menuTitle}>DROPS</p>
              <Link to="/catalogo/genesis" style={styles.menuLink} onClick={() => setMenuOpen(false)}>GENESIS</Link>
              <Link to="/catalogo/isla-bonita" style={styles.menuLink} onClick={() => setMenuOpen(false)}>ISLA BONITA</Link>
              <hr style={styles.menuDivider} />
              {user ? (
                <>
                  <Link to="/perfil" style={styles.menuLink} onClick={() => setMenuOpen(false)}>MI PERFIL</Link>
                  <Link to="/favoritos" style={styles.menuLink} onClick={() => setMenuOpen(false)}>FAVORITOS</Link>
                  {user.rol === 'admin' && (
                    <Link to="/admin" style={styles.menuLink} onClick={() => setMenuOpen(false)}>ADMIN</Link>
                  )}
                  <button onClick={handleLogout} style={styles.menuLogout}>CERRAR SESIÓN</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.menuLink} onClick={() => setMenuOpen(false)}>INICIAR SESIÓN</Link>
                  <Link to="/registro" style={styles.menuLink} onClick={() => setMenuOpen(false)}>REGISTRO</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: { flex: 1 },
  headerCenter: { flex: 1, textAlign: 'center' },
  headerRight: { flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '16px' },
  logo: { height: '32px', objectFit: 'contain' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 },
  sideMenu: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '280px', backgroundColor: '#fff', padding: '24px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px' },
  menuNav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  menuTitle: { fontSize: '11px', letterSpacing: '2px', color: '#999', marginBottom: '8px' },
  menuLink: { textDecoration: 'none', color: '#000', fontSize: '14px', letterSpacing: '1.5px', fontWeight: '600', padding: '8px 0' },
  menuDivider: { border: 'none', borderTop: '1px solid #e5e5e5', margin: '16px 0' },
  menuLogout: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '14px', letterSpacing: '1.5px', textAlign: 'left', padding: '8px 0' },
};

export default Navbar;  