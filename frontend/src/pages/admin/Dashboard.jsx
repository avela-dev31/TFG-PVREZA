import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProductosConStock, eliminarProducto as eliminarProductoApi } from '../../api/productosApi';
import { getDashboardStats, getTodosPedidos } from '../../api/pedidosApi';
import '../../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('resumen');

    const [productos, setProductos] = useState([]);
    const [stats, setStats] = useState({ ventas_mes: 0, pedidos_activos: 0, stock_critico: 0 });
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, productosRes, pedidosRes] = await Promise.all([
                    getDashboardStats(),
                    getProductosConStock(),
                    getTodosPedidos()
                ]);
                setStats(statsRes.data);
                setProductos(productosRes.data);
                setPedidos(pedidosRes.data);
            } catch (error) {
                console.error('Error cargando datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
        try {
            await eliminarProductoApi(id);
            setProductos(productos.filter(p => p.id_producto !== id));
        } catch (error) {
            console.error('Error eliminando producto:', error);
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
                            <button className="btn-primary">+ NUEVO PRODUCTO</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NOMBRE</th>
                                    <th>PRECIO</th>
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
                                        <td>
                                            <span className={`status-badge ${p.stock_total === 0 ? 'out' : 'ok'}`}>
                                                {p.stock_total === 0 ? 'AGOTADO' : p.stock_total}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="btn-text">EDITAR</button>
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
                    </div>
                );
            case 'pedidos':
                return (
                    <div className="dash-section">
                        <h2>ÚLTIMOS PEDIDOS</h2>
                        {pedidos.length === 0 ? (
                            <p>No hay pedidos registrados.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>TOTAL</th>
                                        <th>ESTADO</th>
                                        <th>FECHA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map((p, i) => (
                                        <tr key={`${p.id_pedido}-${i}`}>
                                            <td>#{p.id_pedido}</td>
                                            <td>{formatPrecio(p.total)} €</td>
                                            <td>
                                                <span className={`status-badge ${p.estado === 'entregado' ? 'ok' : ''}`}>
                                                    {p.estado.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{new Date(p.fecha_pedido).toLocaleDateString('es-ES')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
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
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;