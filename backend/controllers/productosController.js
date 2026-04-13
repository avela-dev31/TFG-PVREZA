const pool = require('../config/db');

// 1. Obtener todo el catálogo
const obtenerProductos = async (req, res) => {
    try {
        const [productos] = await pool.query('SELECT * FROM productos');
        
        res.status(200).json({
            ok: true,
            total: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
};

// 2. Obtener una camiseta específica por su ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [producto] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);

        // Comprobamos si el producto existe
        if (producto.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'Camiseta no encontrada' });
        }

        res.status(200).json({
            ok: true,
            data: producto[0] // Devolvemos solo el objeto, no un array
        });
    } catch (error) {
        console.error('❌ Error obteniendo el producto:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
};

// 3. Obtener el stock disponible de un producto
const obtenerStockPorProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscamos las tallas, colores y la cantidad en stock para esa camiseta
        const [stock] = await pool.query(
            'SELECT talla, color, cantidad FROM stock WHERE id_producto = ?', 
            [id]
        );

        if (stock.length === 0) {
            return res.status(404).json({ ok: false, mensaje: 'No hay información de stock para esta camiseta' });
        }

        res.status(200).json({
            ok: true,
            total_variantes: stock.length,
            data: stock
        });
    } catch (error) {
        console.error('❌ Error obteniendo el stock:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    obtenerStockPorProducto
};