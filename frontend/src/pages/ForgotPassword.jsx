import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authApi';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">CORREO ENVIADO</h1>
          <p className="auth-subtitle">PVREZA CLUB®</p>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
            Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link to="/login" className="auth-link">VOLVER AL LOGIN</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">RECUPERAR CONTRASEÑA</h1>
        <p className="auth-subtitle">PVREZA CLUB®</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">Volver al login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
