import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import usePageTitle from '../hooks/usePageTitle';
import '../styles/checkout.css';

const CheckoutSuccess = () => {
    usePageTitle('Pago completado');
    const { clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <main className="checkout-page">
            <div className="checkout-success">
                <h1>PAGO COMPLETADO</h1>
                <p className="order-message">
                    Tu pedido ha sido procesado correctamente.<br />
                    Recibirás un email de confirmación en breve.
                </p>
                <div className="success-actions">
                    <button className="btn-primary" onClick={() => navigate('/perfil')}>VER MIS PEDIDOS</button>
                    <button className="btn-secondary" onClick={() => navigate('/catalogo')}>SEGUIR COMPRANDO</button>
                </div>
            </div>
        </main>
    );
};

export default CheckoutSuccess;
