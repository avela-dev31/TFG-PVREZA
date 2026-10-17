import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { isMenuOpen: menuOpen, setIsMenuOpen: setMenuOpen } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-left">
          <button onClick={() => setMenuOpen(true)} className="navbar-icon">
            <Menu size={28} />
          </button>
        </div>

        <div className="navbar-center">
          <Link to="/">
            <img src="/assets/img/png_en_negro.png" alt="Pvreza Club" className="navbar-logo" />
          </Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <Link to="/perfil" className="navbar-icon">
              <User size={26} />
            </Link>
          ) : (
            <Link to="/login" className="navbar-icon">
              <User size={26} />
            </Link>
          )}
          <Link to="/carrito" className="navbar-icon">
            <ShoppingBag size={26} />
          </Link>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`menu-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side menu */}
      <div className={`side-menu${menuOpen ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <button onClick={() => setMenuOpen(false)} className="menu-close-btn">
          <X size={28} />
        </button>
        <nav className="menu-nav">
          <p className="menu-section-title">DROPS</p>
          <Link to="/catalogo/drop-genesis" className="menu-link" onClick={() => setMenuOpen(false)}>GENESIS</Link>
          <Link to="/catalogo/isla-bonita" className="menu-link" onClick={() => setMenuOpen(false)}>ISLA BONITA</Link>
          <hr className="menu-divider" />
          {user ? (
            <>
              <Link to="/perfil" className="menu-link" onClick={() => setMenuOpen(false)}>MI PERFIL</Link>
              <Link to="/favoritos" className="menu-link" onClick={() => setMenuOpen(false)}>FAVORITOS</Link>
              {user.rol === 'admin' && (
                <Link to="/admin" className="menu-link" onClick={() => setMenuOpen(false)}>ADMIN</Link>
              )}
              <button onClick={handleLogout} className="menu-logout">CERRAR SESIÓN</button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-link" onClick={() => setMenuOpen(false)}>INICIAR SESIÓN</Link>
              <Link to="/registro" className="menu-link" onClick={() => setMenuOpen(false)}>REGISTRO</Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
