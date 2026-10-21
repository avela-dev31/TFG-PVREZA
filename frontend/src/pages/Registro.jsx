import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import SocialAuthButtons from '../components/SocialAuthButtons';
import '../styles/auth.css';

const Registro = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    altura: '',
    peso: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    if (form.altura < 100 || form.altura > 250 || form.peso < 30 || form.peso > 200) {
      setError('Por favor, introduce una altura y peso válidos.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await registerRequest(form);
      login(res.data.user, res.data.token);
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">CREAR CUENTA</h1>

        <form onSubmit={handleRegistro} className="auth-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="auth-input"
            required
          />
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
            placeholder="Contraseña (mín. 8 caract., 1 mayúsc., 1 núm.)"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <div className="auth-row">
            <input
              type="number"
              name="altura"
              placeholder="Altura (cm)"
              value={form.altura}
              onChange={handleChange}
              className="auth-input"
              required
            />
            <input
              type="number"
              name="peso"
              placeholder="Peso (kg)"
              value={form.peso}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </button>
        </form>

        <SocialAuthButtons />

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
