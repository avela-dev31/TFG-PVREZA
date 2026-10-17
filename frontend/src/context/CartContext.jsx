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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart]);

    // Función para añadir al carrito
    const addToCart = (producto, tallaObj) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex(
                (item) => item.id_producto === producto.id_producto && item.id_stock === tallaObj.id_stock
            );

            if (itemIndex >= 0) {
                return prevCart.map((item, index) =>
                    index === itemIndex
                        ? { ...item, cantidadCompra: item.cantidadCompra + 1 }
                        : item
                );
            } else {
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

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.precio * item.cantidadCompra), 0);

    const value = useMemo(
        () => ({ cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, clearCart, cartTotal, isMenuOpen, setIsMenuOpen }),
        [cart, isCartOpen, cartTotal, isMenuOpen]
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