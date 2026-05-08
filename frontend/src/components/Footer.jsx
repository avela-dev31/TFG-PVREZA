import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="pvreza-footer">
      <div className="footer-container">
        
        {/* Sección 1: Newsletter */}
        <div className="footer-newsletter">
          <h2>ÚNETE AL CLUB</h2>
          <p>Acceso anticipado a drops, descuentos exclusivos y noticias de PVREZA.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="TU CORREO ELECTRÓNICO" required />
            <button type="submit">→</button>
          </form>
        </div>

        {/* Sección 2: Enlaces */}
        <div className="footer-links">
          <div className="footer-column">
            <h3>TIENDA</h3>
            <Link to="/catalogo">Comprar Todo</Link>
            <Link to="/catalogo/genesis">Drop Genesis</Link>
          </div>
          
          <div className="footer-column">
            <h3>SOPORTE</h3>
            <Link to="/faq">Preguntas Frecuentes</Link>
            <Link to="/envios">Envíos y Devoluciones</Link>
            <Link to="/contacto">Contacto</Link>
          </div>

          <div className="footer-column">
            <h3>SOCIAL</h3>
            <a href="https://www.instagram.com/pvreza.club/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@pvrezaclub" target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>
      </div>

      {/* Sección 3: Legal y Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.</p>
        <div className="legal-links">
          <Link to="/privacidad">Política de Privacidad</Link>
          <Link to="/terminos">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;