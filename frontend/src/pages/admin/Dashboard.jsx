import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProductosConStock, crearProducto, eliminarProducto as eliminarProductoApi } from '../../api/productosApi';
import { getDashboardStats, getTodosPedidos, actualizarEstadoPedido } from '../../api/pedidosApi';
import '../../styles/dashboard.css';

const PRODUCTO_VACIO = { nombre: '', precio: '', coleccion: '', descripcion: '' };

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('resumen');

    const [productos, setProductos] = useState([]);
    const [stats, setStats] = useState({ ventas_mes: 0, pedidos_activos: 0, stock_critico: 0 });
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const dialogRef = useRef(null);
    const [nuevoProducto, setNuevoProducto] = useState(PRODUCTO_VACIO);
    const [creando, setCreando] = useState(false);
    const [modalError, setModalError] = useState('');

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();

    const fetchData = async () => {
        setLoading(true);
        setFetchError('');

        const [statsRes, productosRes, pedidosRes] = await Promise.allSettled([
            getDashboardStats(),
            getProductosConStock(),
            getTodosPedidos()
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (productosRes.status === 'fulfilled') setProductos(productosRes.value.data);
        if (pedidosRes.status === 'fulfilled') setPedidos(pedidosRes.value.data);

        const errores = [];
        if (statsRes.status === 'rejected') errores.push('Stats: ' + (statsRes.reason?.response?.data?.message || statsRes.reason?.message));
        if (productosRes.status === 'rejected') errores.push('Productos: ' + (productosRes.reason?.response?.data?.message || productosRes.reason?.message));
        if (pedidosRes.status === 'rejected') errores.push('Pedidos: ' + (pedidosRes.reason?.response?.data?.message || pedidosRes.reason?.message));
        if (errores.length > 0) setFetchError(errores.join(' | '));

        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
        try {
            await eliminarProductoApi(id);
            setProductos(productos.filter(p => p.id_producto !== id));
        } catch (error) {
            console.error('Error eliminando producto:', error);
        }
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        setModalError('');

        if (!nuevoProducto.nombre.trim() || !nuevoProducto.precio) {
            setModalError('Nombre y precio son obligatorios');
            return;
        }

        setCreando(true);
        try {
            await crearProducto({
                ...nuevoProducto,
                precio: Number.parseFloat(nuevoProducto.precio)
            });
            closeModal();
            setNuevoProducto(PRODUCTO_VACIO);
            await fetchData();
        } catch (error) {
            setModalError(error.response?.data?.message || 'Error al crear el producto');
        } finally {
            setCreando(false);
        }
    };

    const handleEstadoPedido = async (idPedido, nuevoEstado) => {
        const label = nuevoEstado === 'rechazado' ? 'rechazar' : `marcar como "${nuevoEstado}"`;
        if (!window.confirm(`¿Seguro que quieres ${label} el pedido #${idPedido}?`)) return;
        try {
            await actualizarEstadoPedido(idPedido, nuevoEstado);
            await fetchData();
        } catch (error) {
            console.error('Error actualizando estado:', error);
            alert(error.response?.data?.message || 'Error al actualizar el pedido');
        }
    };

    const formatPrecio = (valor) => {
        return Number(valor).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const renderContent = () => {
        if (loading) {
            return <div className="dash-section"><p>Cargando datos...</p></div>;
        }

        switch (activeTab) {
            case 'resumen':
                return (
                    <div className="dash-section">
                        <h2>RESUMEN GENERAL</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>VENTAS DEL MES</h3>
                                <p className="stat-number">{formatPrecio(stats.ventas_mes)} €</p>
                            </div>
                            <div className="stat-card">
                                <h3>PEDIDOS ACTIVOS</h3>
                                <p className="stat-number">{stats.pedidos_activos}</p>
                            </div>
                            <div className="stat-card alert">
                                <h3>STOCK CRÍTICO</h3>
                                <p className="stat-number">{stats.stock_critico}</p>
                                <span className="stat-label">Artículos agotados</span>
                            </div>
                        </div>
                    </div>
                );
            case 'productos':
                return (
                    <div className="dash-section">
                        <div className="section-header">
                            <h2>GESTIÓN DE PRODUCTOS</h2>
                            <button className="btn-primary" onClick={openModal}>+ NUEVO PRODUCTO</button>
                        </div>
                        {productos.length === 0 ? (
                            <p>No hay productos registrados. Crea el primero.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NOMBRE</th>
                                        <th>PRECIO</th>
                                        <th>COLECCIÓN</th>
                                        <th>STOCK</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(p => (
                                        <tr key={p.id_producto}>
                                            <td>#{p.id_producto}</td>
                                            <td><strong>{p.nombre}</strong></td>
                                            <td>{formatPrecio(p.precio)} €</td>
                                            <td>{p.coleccion || '—'}</td>
                                            <td>
                                                <span className={`status-badge ${p.stock_total === 0 ? 'out' : 'ok'}`}>
                                                    {p.stock_total === 0 ? 'AGOTADO' : p.stock_total}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-text danger"
                                                    onClick={() => eliminarProducto(p.id_producto)}
                                                >
                                                    BORRAR
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            case 'pedidos': {
                const pedidosAgrupados = agruparPedidos(pedidos);
                return (
                    <div className="dash-section">
                        <h2>GESTIÓN DE PEDIDOS</h2>
                        {pedidosAgrupados.length === 0 ? (
                            <p>No hay pedidos registrados.</p>
                        ) : (
                            <div className="pedidos-admin-list">
                                {pedidosAgrupados.map(p => (
                                    <div key={p.id_pedido} className="pedido-admin-card">
                                        <div className="pedido-admin-header">
                                            <div>
                                                <strong>Pedido #{p.id_pedido}</strong>
                                                <span className="pedido-admin-date">
                                                    {new Date(p.fecha_pedido).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <span className={`status-badge ${p.estado === 'pagado' ? 'ok' : p.estado === 'rechazado' ? 'out' : ''}`}>
                                                {p.estado.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="pedido-admin-user">
                                            <span>{p.nombre_usuario}</span>
                                            <span className="pedido-admin-email">{p.email_usuario}</span>
                                        </div>
                                        <div className="pedido-admin-total">
                                            TOTAL: {formatPrecio(p.total)} €
                                        </div>
                                        {p.estado === 'pendiente' && (
                                            <div className="pedido-admin-actions">
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => handleEstadoPedido(p.id_pedido, 'pagado')}
                                                >
                                                    ACEPTAR
                                                </button>
                                                <button
                                                    className="btn-text danger"
                                                    onClick={() => handleEstadoPedido(p.id_pedido, 'rechazado')}
                                                >
                                                    RECHAZAR
                                                </button>
                                            </div>
                                        )}
                                        {p.estado === 'pagado' && (
                                            <div className="pedido-admin-actions">
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => handleEstadoPedido(p.id_pedido, 'enviado')}
                                                >
                                                    MARCAR ENVIADO
                                                </button>
                                            </div>
                                        )}
                                        {p.estado === 'enviado' && (
                                            <div className="pedido-admin-actions">
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => handleEstadoPedido(p.id_pedido, 'entregado')}
                                                >
                                                    MARCAR ENTREGADO
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>PVREZA ADMIN</h2>
                    <p>Hola, {user?.nombre}</p>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'resumen' ? 'active' : ''}
                        onClick={() => setActiveTab('resumen')}
                    >
                        RESUMEN
                    </button>
                    <button
                        className={activeTab === 'productos' ? 'active' : ''}
                        onClick={() => setActiveTab('productos')}
                    >
                        PRODUCTOS
                    </button>
                    <button
                        className={activeTab === 'pedidos' ? 'active' : ''}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        PEDIDOS
                    </button>
                </nav>
            </aside>

            <main className="dashboard-content">
                {fetchError && (
                    <div className="dash-section" style={{ color: '#d93025', background: '#fce8e6', padding: '16px', marginBottom: '20px', fontSize: '0.85rem' }}>
                        <strong>Error cargando datos:</strong> {fetchError}
                    </div>
                )}
                {renderContent()}
            </main>

            <dialog ref={dialogRef} className="product-dialog">
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                <h2>NUEVO PRODUCTO</h2>

                <form onSubmit={handleCrear} className="modal-form">
                    <div className="form-field">
                        <label htmlFor="prod-nombre">NOMBRE</label>
                        <input
                            id="prod-nombre"
                            type="text"
                            value={nuevoProducto.nombre}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="prod-precio">PRECIO (€)</label>
                        <input
                            id="prod-precio"
                            type="number"
                            step="0.01"
                            min="0"
                            value={nuevoProducto.precio}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="prod-coleccion">COLECCIÓN</label>
                        <input
                            id="prod-coleccion"
                            type="text"
                            value={nuevoProducto.coleccion}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, coleccion: e.target.value })}
                            placeholder="Ej: Drop Genesis, Isla Bonita"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="prod-descripcion">DESCRIPCIÓN</label>
                        <textarea
                            id="prod-descripcion"
                            value={nuevoProducto.descripcion}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {modalError && <p className="modal-error">{modalError}</p>}

                    <button type="submit" className="btn-primary" disabled={creando}>
                        {creando ? 'CREANDO...' : 'CREAR PRODUCTO'}
                    </button>
                </form>
            </dialog>
        </div>
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
                nombre_usuario: row.nombre_usuario,
                email_usuario: row.email_usuario,
            });
        }
    }
    return Array.from(map.values());
}

export default Dashboard;