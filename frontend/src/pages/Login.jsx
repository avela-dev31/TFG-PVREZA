import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest, verify2FA } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import SocialAuthButtons from '../components/SocialAuthButtons';
import '../styles/auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const codeInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginRequest(form);
      if (res.data.requires2FA) {
        setNeeds2FA(true);
        setTempToken(res.data.tempToken);
        setTimeout(() => codeInputRef.current?.focus(), 100);
      } else {
        login(res.data.user, res.data.token, res.data.refreshToken);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verify2FA(tempToken, totpCode);
      login(res.data.user, res.data.token, res.data.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto');
      setTotpCode('');
    } finally {
      setLoading(false);
    }
  };

  if (needs2FA) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">VERIFICACIÓN 2FA</h1>
          <p className="auth-subtitle">Introduce el código de tu app de autenticación</p>

          <form onSubmit={handle2FASubmit} className="auth-form">
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              className="auth-input totp-input"
              autoComplete="one-time-code"
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-btn" disabled={loading || totpCode.length !== 6}>
              {loading ? 'VERIFICANDO...' : 'VERIFICAR'}
            </button>
          </form>

          <p className="auth-footer">
            <button
              type="button"
              className="auth-link"
              onClick={() => { setNeeds2FA(false); setTempToken(''); setTotpCode(''); setError(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">INICIAR SESIÓN</h1>
        <p className="auth-subtitle">PVREZA CLUB®</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'CARGANDO...' : 'ENTRAR'}
          </button>
        </form>

        <SocialAuthButtons />

        <p className="auth-footer">
          <Link to="/forgot-password" className="auth-link">¿Has olvidado tu contraseña?</Link>
        </p>
        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="auth-link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
