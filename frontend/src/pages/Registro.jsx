import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import AvatarCreator from '../components/AvatarCreator'; 

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
  
  const [paso, setPaso] = useState(1); 
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSiguientePaso = (e) => {
    e.preventDefault(); 
    
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }
    
    // Validación extra para asegurar que ponen números lógicos
    if (form.altura < 100 || form.altura > 250 || form.peso < 30 || form.peso > 200) {
        setError('Por favor, introduce una altura y peso válidos.');
        return;
    }
    
    setError('');
    setPaso(2); 
  };

  const handleRegistroFinal = async (avatarUrl) => {
    setError('');
    setLoading(true);
    
    try {
      const datosCompletos = {
        ...form,
        avatar_url: avatarUrl 
      };

      const res = await registerRequest(datosCompletos);
      login(res.data.user, res.data.token);
      navigate('/perfil'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      setPaso(1); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      
      {paso === 1 ? (
        
        <div style={styles.card}>
          <h1 style={styles.title}>CREAR CUENTA</h1>
          <p style={styles.subtitle}>PASO 1: DATOS PERSONALES</p>

          <form onSubmit={handleSiguientePaso} style={styles.form}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              style={styles.input}
              required
            />
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
              placeholder="Contraseña (mín. 8 caract., 1 mayúsc., 1 núm.)"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <div style={styles.row}>
                <input
                type="number"
                name="altura"
                placeholder="Altura (cm)"
                value={form.altura}
                onChange={handleChange}
                style={{...styles.input, width: '100%'}}
                required
                />
                <input
                type="number"
                name="peso"
                placeholder="Peso (kg)"
                value={form.peso}
                onChange={handleChange}
                style={{...styles.input, width: '100%'}}
                required
                />
            </div>

            {error && <p style={styles.error}>{error}</p>}
            
            <button type="submit" style={styles.btn}>
              SIGUIENTE →
            </button>
          </form>

          <p style={styles.footer}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={styles.link}>Inicia sesión</Link>
          </p>
        </div>

      ) : (

        <div style={styles.avatarContainer}>
          <button onClick={() => setPaso(1)} style={styles.backBtn}>
            ← VOLVER A MIS DATOS
          </button>
          
          {loading ? (
             <div style={styles.loadingBox}>
                <h2 style={styles.title}>FORJANDO IDENTIDAD...</h2>
                <p style={styles.subtitle}>Guardando perfil en la base de datos de PVREZA</p>
             </div>
          ) : (
             <AvatarCreator
                onAvatarGuardado={handleRegistroFinal} 
                altura={Number(form.altura)} 
                peso={Number(form.peso)}
             />
          )}
        </div>

      )}

    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { fontSize: '20px', letterSpacing: '4px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { fontSize: '12px', letterSpacing: '3px', color: '#999', marginBottom: '40px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  // Nueva fila para poner altura y peso uno al lado del otro
  row: { display: 'flex', gap: '10px', width: '100%' }, 
  input: { padding: '14px 16px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none', letterSpacing: '0.5px' },
  btn: { padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '3px', fontWeight: '600', marginTop: '8px' },
  error: { color: 'red', fontSize: '13px', margin: 0 },
  footer: { marginTop: '24px', fontSize: '13px', color: '#666' },
  link: { color: '#000', fontWeight: '600' },
  
  avatarContainer: { width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' },
  backBtn: { alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', fontWeight: 'bold', textDecoration: 'underline' },
  loadingBox: { textAlign: 'center', padding: '100px 20px', border: '1px solid #eee' }
};

export default Registro;