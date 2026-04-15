import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>INICIAR SESIÓN</h1>
        <p style={styles.subtitle}>PVREZA CLUB®</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'CARGANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { fontSize: '20px', letterSpacing: '4px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { fontSize: '12px', letterSpacing: '3px', color: '#999', marginBottom: '40px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '14px 16px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none', letterSpacing: '0.5px' },
  btn: { padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '3px', fontWeight: '600', marginTop: '8px' },
  error: { color: 'red', fontSize: '13px', margin: 0 },
  footer: { marginTop: '24px', fontSize: '13px', color: '#666' },
  link: { color: '#000', fontWeight: '600' },
};

export default Login;