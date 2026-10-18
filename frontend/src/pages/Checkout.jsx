import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearCheckoutSession } from '../api/pedidosApi';
import { imgUrl } from '../constants';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/checkout.css';

const Checkout = () => {
    usePageTitle('Checkout');
    const { cart, cartTotal } = useContext(CartContext);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePagar = async () => {
        setError('');
        setLoading(true);

        try {
            const items = cart.map(item => ({
                id_stock: item.id_stock,
                cantidad: item.cantidadCompra
            }));

            const res = await crearCheckoutSession(items);
            window.location.href = res.data.url;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar el pago.');
            setLoading(false);
        }
    };

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
                <div className="checkout-form">
                    <h2>RESUMEN DE PAGO</h2>

                    {error && <p className="checkout-error">{error}</p>}

                    <div className="checkout-user-info">
                        <p><strong>{user?.nombre}</strong></p>
                        <p>{user?.email}</p>
                    </div>

                    <p className="checkout-stripe-note">
                        Al pulsar el botón serás redirigido a Stripe para completar el pago de forma segura.
                    </p>

                    <button
                        className="btn-confirm"
                        onClick={handlePagar}
                        disabled={loading}
                    >
                        {loading ? 'REDIRIGIENDO...' : 'PAGAR CON TARJETA'}
                    </button>
                </div>

                <aside className="checkout-summary">
                    <h2>RESUMEN ({cart.length} artículos)</h2>

                    <div className="checkout-items">
                        {cart.map((item) => (
                            <div key={item.id_stock} className="checkout-item">
                                <img src={imgUrl(item.imagen_url)} alt={item.nombre} />
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
