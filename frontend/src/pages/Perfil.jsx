import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMisPedidos } from '../api/pedidosApi';
import { updateProfile, updatePassword } from '../api/authApi';
import { BACKEND_URL } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/perfil.css';

const ESTADO_LABEL = {
    pendiente: 'PENDIENTE',
    pagado: 'PAGADO',
    enviado: 'ENVIADO',
    entregado: 'ENTREGADO'
};

const Perfil = () => {
    usePageTitle('Mi cuenta');
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);

    const [tab, setTab] = useState('pedidos');

    const [form, setForm] = useState({ nombre: '', email: '', altura: '', peso: '' });
    const [editMsg, setEditMsg] = useState('');
    const [editError, setEditError] = useState('');
    const [saving, setSaving] = useState(false);

    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwMsg, setPwMsg] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSaving, setPwSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        setForm({
            nombre: user.nombre || '',
            email: user.email || '',
            altura: user.altura || '',
            peso: user.peso || '',
        });
    }, [user]);

    useEffect(() => {
        if (!user || user.rol === 'admin') return;
        getMisPedidos()
            .then(res => setPedidos(agruparPedidos(res.data)))
            .catch(() => setPedidos([]))
            .finally(() => setLoadingPedidos(false));
    }, [user]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditMsg('');
        setEditError('');
        setSaving(true);
        try {
            const res = await updateProfile({
                nombre: form.nombre,
                email: form.email,
                altura: form.altura || null,
                peso: form.peso || null,
            });
            updateUser(res.data.user);
            setEditMsg('Perfil actualizado correctamente');
        } catch (err) {
            setEditError(err.response?.data?.message || 'Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    const handlePwSubmit = async (e) => {
        e.preventDefault();
        setPwMsg('');
        setPwError('');

        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError('Las contraseñas no coinciden');
            return;
        }

        setPwSaving(true);
        try {
            await updatePassword({
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwMsg('Contraseña actualizada');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setPwSaving(false);
        }
    };

    return (
        <main className="perfil-page">
            <div className="perfil-container">
                <header className="perfil-header">
                    <h1>MI CUENTA</h1>
                    <button onClick={handleLogout} className="logout-btn">CERRAR SESIÓN</button>
                </header>

                <section className="user-info-card">
                    <div className="info-group">
                        <label>NOMBRE</label>
                        <p>{user.nombre}</p>
                    </div>
                    <div className="info-group">
                        <label>EMAIL</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-group">
                        <label>ROL</label>
                        <p className="role-tag">{user.rol.toUpperCase()}</p>
                    </div>
                </section>

                {user.rol === 'admin' ? (
                    <div className="admin-zone">
                        <h2>PANEL DE CONTROL</h2>
                        <p>Tienes privilegios de administrador para gestionar la tienda.</p>
                        <button className="action-btn admin" onClick={() => navigate('/admin')}>
                            IR AL DASHBOARD
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="perfil-tabs">
                            <button
                                className={`perfil-tab ${tab === 'pedidos' ? 'active' : ''}`}
                                onClick={() => setTab('pedidos')}
                            >
                                MIS PEDIDOS
                            </button>
                            <button
                                className={`perfil-tab ${tab === 'editar' ? 'active' : ''}`}
                                onClick={() => setTab('editar')}
                            >
                                EDITAR PERFIL
                            </button>
                            <button
                                className={`perfil-tab ${tab === 'password' ? 'active' : ''}`}
                                onClick={() => setTab('password')}
                            >
                                CONTRASEÑA
                            </button>
                        </div>

                        {tab === 'pedidos' && (
                            <div className="perfil-section">
                                {loadingPedidos ? (
                                    <p>Cargando pedidos...</p>
                                ) : pedidos.length === 0 ? (
                                    <div className="empty-orders">
                                        <p>Aún no has realizado ningún pedido en PVREZA.</p>
                                        <button className="action-btn" onClick={() => navigate('/catalogo')}>
                                            EXPLORAR CATÁLOGO
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {pedidos.map((pedido) => (
                                            <div key={pedido.id_pedido} className="order-card">
                                                <div className="order-header">
                                                    <div>
                                                        <span className="order-id">Pedido #{pedido.id_pedido}</span>
                                                        <span className="order-date">
                                                            {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                                                                day: 'numeric', month: 'long', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <span className={`order-status status-${pedido.estado}`}>
                                                        {ESTADO_LABEL[pedido.estado] || pedido.estado}
                                                    </span>
                                                </div>
                                                <div className="order-items">
                                                    {pedido.items.map((item, i) => (
                                                        <div key={i} className="order-item">
                                                            <img src={`${BACKEND_URL}${item.imagen_url}`} alt={item.nombre} />
                                                            <div className="order-item-info">
                                                                <p className="order-item-name">{item.nombre}</p>
                                                                <p className="order-item-meta">Talla: {item.talla} | Cant: {item.cantidad}</p>
                                                            </div>
                                                            <p className="order-item-price">{(item.precio_unitario * item.cantidad).toFixed(2)} €</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-footer">
                                                    <span className="order-total">TOTAL: {Number(pedido.total).toFixed(2)} €</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === 'editar' && (
                            <div className="perfil-section">
                                <form onSubmit={handleEditSubmit} className="edit-form">
                                    <div className="form-group">
                                        <label>NOMBRE</label>
                                        <input
                                            type="text"
                                            value={form.nombre}
                                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>EMAIL</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>ALTURA (cm)</label>
                                            <input
                                                type="number"
                                                min="100"
                                                max="250"
                                                value={form.altura}
                                                onChange={(e) => setForm({ ...form, altura: e.target.value })}
                                                placeholder="175"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>PESO (kg)</label>
                                            <input
                                                type="number"
                                                min="30"
                                                max="300"
                                                value={form.peso}
                                                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                                                placeholder="75"
                                            />
                                        </div>
                                    </div>
                                    {editMsg && <p className="form-success">{editMsg}</p>}
                                    {editError && <p className="form-error">{editError}</p>}
                                    <button type="submit" className="action-btn" disabled={saving}>
                                        {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {tab === 'password' && (
                            <div className="perfil-section">
                                <form onSubmit={handlePwSubmit} className="edit-form">
                                    <div className="form-group">
                                        <label>CONTRASEÑA ACTUAL</label>
                                        <input
                                            type="password"
                                            value={pwForm.currentPassword}
                                            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>NUEVA CONTRASEÑA</label>
                                        <input
                                            type="password"
                                            value={pwForm.newPassword}
                                            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                            required
                                        />
                                        <span className="form-hint">Mínimo 8 caracteres, una mayúscula y un número</span>
                                    </div>
                                    <div className="form-group">
                                        <label>CONFIRMAR CONTRASEÑA</label>
                                        <input
                                            type="password"
                                            value={pwForm.confirmPassword}
                                            onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {pwMsg && <p className="form-success">{pwMsg}</p>}
                                    {pwError && <p className="form-error">{pwError}</p>}
                                    <button type="submit" className="action-btn" disabled={pwSaving}>
                                        {pwSaving ? 'CAMBIANDO...' : 'CAMBIAR CONTRASEÑA'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

function agruparPedidos(rows) {
    const map = new Map();
    for (const row of rows) {
        if (!map.has(row.id_pedido)) {
            map.set(row.id_pedido, {
                id_pedido: row.id_pedido,
                total: row.total,
                estado: row.estado,
                fecha_pedido: row.fecha_pedido,
                items: []
            });
        }
        map.get(row.id_pedido).items.push({
            nombre: row.nombre,
            imagen_url: row.imagen_url,
            talla: row.talla,
            cantidad: row.cantidad,
            precio_unitario: row.precio_unitario
        });
    }
    return Array.from(map.values());
}

export default Perfil;
