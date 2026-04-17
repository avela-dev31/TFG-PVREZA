import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

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

    // Calculamos el total de dinero
    const cartTotal = cart.reduce((total, item) => total + (item.precio * item.cantidadCompra), 0);

    return (
        <CartContext.Provider value={{ cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};