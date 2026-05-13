import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../constants';
import '../styles/carrito-page.css';

const Carrito = () => {
    const { cart, removeFromCart, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <main className="cart-page-empty">
                <h1>TU CARRITO ESTÁ VACÍO</h1>
                <p>Parece que aún no has añadido nada de la colección DROP GENESIS.</p>
                <Link title="Volver al catálogo" to="/catalogo" className="btn-back">VOLVER A LA TIENDA</Link>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <header className="cart-page-header">
                <h1>CESTA DE COMPRA</h1>
                <p>{cart.length} ARTÍCULOS EN TU CARRITO</p>
            </header>

            <div className="cart-container">
                {/* LISTA DE PRODUCTOS */}
                <section className="cart-items-list">
                    {cart.map((item) => (
                        <div key={item.id_stock} className="cart-item-row">
                            <div className="item-img">
                                <img src={`${BACKEND_URL}${item.imagen_url}`} alt={item.nombre} />
                            </div>
                            
                            <div className="item-info">
                                <h3>{item.nombre}</h3>
                                <p className="item-meta">TALLA: {item.talla}</p>
                                <p className="item-price-unit">{item.precio} €</p>
                                
                                <div className="item-controls">
                                    <button onClick={() => removeFromCart(item.id_stock)} className="btn-remove">
                                        ELIMINAR
                                    </button>
                                </div>
                            </div>

                            <div className="item-quantity-display">
                                <span>CANTIDAD: {item.cantidadCompra}</span>
                            </div>

                            <div className="item-total-price">
                                {(item.precio * item.cantidadCompra).toFixed(2)} €
                            </div>
                        </div>
                    ))}
                </section>

                {/* RESUMEN DE PAGO (Lado derecho o abajo) */}
                <aside className="cart-summary-box">
                    <h2>RESUMEN</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{cartTotal.toFixed(2)} €</span>
                    </div>
                    <div className="summary-row">
                        <span>Envío</span>
                        <span>GRATIS</span>
                    </div>
                    <div className="summary-total">
                        <span>TOTAL (IVA incluido)</span>
                        <span>{cartTotal.toFixed(2)} €</span>
                    </div>
                    
                    <button className="btn-checkout" onClick={() => navigate('/checkout')}>TRAMITAR PEDIDO</button>
                    
                    <div className="payment-methods">
                        <p>MÉTODOS DE PAGO ACEPTADOS</p>
                        <div className="icons">
                            <span>VISA</span> <span>MC</span> <span>PAYPAL</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Carrito;