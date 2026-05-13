import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMisPedidos } from '../api/pedidosApi';
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);

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

                <div className="perfil-actions">
                    {user.rol === 'admin' ? (
                        <div className="admin-zone">
                            <h2>PANEL DE CONTROL</h2>
                            <p>Tienes privilegios de administrador para gestionar la tienda.</p>
                            <button className="action-btn admin" onClick={() => navigate('/admin')}>
                                IR AL DASHBOARD
                            </button>
                        </div>
                    ) : (
                        <div className="user-zone">
                            <h2>MIS PEDIDOS</h2>
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
                </div>
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
