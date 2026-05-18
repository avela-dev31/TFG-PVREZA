import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resetPasswordRequest } from '../api/authApi';
import '../styles/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">CONTRASEÑA ACTUALIZADA</h1>
          <p className="auth-subtitle">PVREZA CLUB®</p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Tu contraseña ha sido restablecida correctamente.
          </p>
          <Link to="/login" className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
            INICIAR SESIÓN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">NUEVA CONTRASEÑA</h1>
        <p className="auth-subtitle">PVREZA CLUB®</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            minLength={8}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'GUARDANDO...' : 'RESTABLECER CONTRASEÑA'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">Volver al login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
