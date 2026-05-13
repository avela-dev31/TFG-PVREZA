import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../api/pedidosApi';
import { BACKEND_URL } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/checkout.css';

const Checkout = () => {
    usePageTitle('Checkout');
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: user?.nombre || '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        telefono: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pedidoCreado, setPedidoCreado] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.direccion || !form.ciudad || !form.codigoPostal || !form.telefono) {
            setError('Completa todos los campos de envío.');
            return;
        }

        setLoading(true);
        try {
            const items = cart.map(item => ({
                id_stock: item.id_stock,
                cantidad: item.cantidadCompra
            }));

            const res = await crearPedido(items);
            setPedidoCreado(res.data);
            clearCart();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar el pedido.');
        } finally {
            setLoading(false);
        }
    };

    if (pedidoCreado) {
        return (
            <main className="checkout-page">
                <div className="checkout-success">
                    <h1>PEDIDO CONFIRMADO</h1>
                    <p className="order-number">N.º de pedido: <strong>#{pedidoCreado.id_pedido}</strong></p>
                    <p className="order-total">Total: <strong>{Number(pedidoCreado.total).toFixed(2)} €</strong></p>
                    <p className="order-message">Recibirás un email de confirmación en {user.email}</p>
                    <div className="success-actions">
                        <button className="btn-primary" onClick={() => navigate('/perfil')}>VER MIS PEDIDOS</button>
                        <button className="btn-secondary" onClick={() => navigate('/catalogo')}>SEGUIR COMPRANDO</button>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="checkout-page">
                <div className="checkout-empty">
                    <h1>NO HAY PRODUCTOS EN TU CARRITO</h1>
                    <button className="btn-primary" onClick={() => navigate('/catalogo')}>IR AL CATÁLOGO</button>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <h1 className="checkout-title">FINALIZAR COMPRA</h1>

            <div className="checkout-container">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h2>DATOS DE ENVÍO</h2>

                    {error && <p className="checkout-error">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, número, piso..." required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ciudad">Ciudad</label>
                            <input id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="codigoPostal">Código postal</label>
                            <input id="codigoPostal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} maxLength="5" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn-confirm" disabled={loading}>
                        {loading ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
                    </button>
                </form>

                <aside className="checkout-summary">
                    <h2>RESUMEN ({cart.length} artículos)</h2>

                    <div className="checkout-items">
                        {cart.map((item) => (
                            <div key={item.id_stock} className="checkout-item">
                                <img src={`${BACKEND_URL}${item.imagen_url}`} alt={item.nombre} />
                                <div className="checkout-item-info">
                                    <p className="checkout-item-name">{item.nombre}</p>
                                    <p className="checkout-item-meta">Talla: {item.talla} | Cant: {item.cantidadCompra}</p>
                                    <p className="checkout-item-price">{(item.precio * item.cantidadCompra).toFixed(2)} €</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-totals">
                        <div className="totals-row">
                            <span>Subtotal</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="totals-row">
                            <span>Envío</span>
                            <span>GRATIS</span>
                        </div>
                        <div className="totals-final">
                            <span>TOTAL</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Checkout;
