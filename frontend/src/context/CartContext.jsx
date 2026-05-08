/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

const CART_KEY = 'pvreza_cart';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart]);

    // Función para añadir al carrito
    const addToCart = (producto, tallaObj) => {
        setCart((prevCart) => {
            // Comprobamos si ya existe ese producto CON ESA TALLA en el carrito
            const itemIndex = prevCart.findIndex(
                (item) => item.id_producto === producto.id_producto && item.id_stock === tallaObj.id_stock
            );

            if (itemIndex >= 0) {
                // Si existe, le sumamos 1 a la cantidad
                const newCart = [...prevCart];
                newCart[itemIndex].cantidadCompra += 1;
                return newCart;
            } else {
                // Si no existe, lo añadimos como nuevo
                return [...prevCart, { 
                    ...producto, 
                    id_stock: tallaObj.id_stock,
                    talla: tallaObj.talla,
                    cantidadCompra: 1 
                }];
            }
        });
        setIsCartOpen(true); 
    };

    // Función para eliminar un item concreto
    const removeFromCart = (id_stock) => {
        setCart(prevCart => prevCart.filter(item => item.id_stock !== id_stock));
    };

    const cartTotal = cart.reduce((total, item) => total + (item.precio * item.cantidadCompra), 0);

    const value = useMemo(
        () => ({ cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, cartTotal }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cart, isCartOpen, cartTotal]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};