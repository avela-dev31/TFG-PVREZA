import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crearReserva, getPlazas } from '../api/reservasApi';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/isla-bonita.css';

const COLECCION = 'ISLA BONITA';

const IslaBonita = () => {
  usePageTitle('Isla Bonita — Próximamente');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('idle');
  const [posicion, setPosicion] = useState(null);
  const [error, setError] = useState('');
  const [disponibles, setDisponibles] = useState(null);

  useEffect(() => {
    getPlazas(COLECCION)
      .then(res => setDisponibles(res.data.disponibles))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEstado('loading');
    try {
      const res = await crearReserva(email, COLECCION);
      setPosicion(res.data.posicion);
      setEstado('success');
      setDisponibles(prev => prev !== null ? prev - 1 : null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la reserva');
      setEstado('idle');
    }
  };

  return (
    <div className="isla-page">
      <div className="isla-hero">
        <img src="/assets/img/ISLA BONITA/IMG_7421a.jpg" alt="Isla Bonita" className="isla-hero-img" />
        <div className="isla-hero-overlay">
          <p className="isla-label">PRÓXIMO DROP</p>
          <h1 className="isla-title">ISLA BONITA</h1>
          <p className="isla-subtitle">PRÓXIMAMENTE</p>
        </div>
      </div>

      <div className="isla-content">
        {estado === 'success' ? (
          <div className="isla-success">
            <h2>RESERVA CONFIRMADA</h2>
            <div className="isla-posicion">
              <span className="isla-posicion-label">TU POSICIÓN</span>
              <span className="isla-posicion-number">#{posicion}</span>
              <span className="isla-posicion-sub">DE 10 PLAZAS</span>
            </div>
            <p className="isla-success-text">
              Recibirás un email de confirmación. Te avisaremos cuando la colección esté disponible.
            </p>
            <Link to="/" className="isla-btn">VOLVER AL INICIO</Link>
          </div>
        ) : (
          <>
            <h2 className="isla-heading">RESERVA TU ACCESO EXCLUSIVO</h2>
            <p className="isla-desc">
              Los <strong>10 primeros</strong> en reservar tendrán acceso anticipado a la colección Isla Bonita.
            </p>
            {disponibles !== null && disponibles > 0 && (
              <p className="isla-plazas">{disponibles} {disponibles === 1 ? 'PLAZA DISPONIBLE' : 'PLAZAS DISPONIBLES'}</p>
            )}
            {disponibles === 0 ? (
              <p className="isla-agotado">PLAZAS AGOTADAS</p>
            ) : (
              <form onSubmit={handleSubmit} className="isla-form">
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="isla-input"
                  required
                />
                {error && <p className="isla-error">{error}</p>}
                <button type="submit" className="isla-btn" disabled={estado === 'loading'}>
                  {estado === 'loading' ? 'RESERVANDO...' : 'RESERVAR AHORA'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IslaBonita;
