import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { BACKEND_URL } from '../constants';
import '../styles/cart.css';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <>
            {/* Fondo oscuro desenfocado */}
            <div 
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
                onClick={() => setIsCartOpen(false)}
            />

            {/* Panel lateral */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>CARRITO ({cart.length})</h2>
                    <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="empty-cart">TU CARRITO ESTÁ VACÍO.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id_stock} className="cart-item">
                                <img src={`${BACKEND_URL}${item.imagen_url}`} alt={item.nombre} />
                                <div className="item-details">
                                    <p className="item-name">{item.nombre}</p>
                                    <p className="item-size">TALLA: {item.talla}</p>
                                    <p className="item-qty">CANTIDAD: {item.cantidadCompra}</p>
                                    <p className="item-price">{item.precio} €</p>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id_stock)}>
                                    Quitar
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>TOTAL</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <button className="checkout-btn" onClick={() => { setIsCartOpen(false); navigate('/carrito'); }}>PASAR POR CAJA</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;