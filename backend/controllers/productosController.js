const Product = require('../models/Products');

const getAll = async (req, res) => {
  try {
    const productos = await Product.getAll();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const producto = await Product.getById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    const variantes = await Product.getVariantes(req.params.id);
    // 💥 NUEVO: Pedimos las imágenes al modelo
    const imagenes = await Product.getImagenes(req.params.id); 

    res.status(200).json({ 
        ok: true, 
        producto: producto, 
        stock: variantes,
        imagenes: imagenes // 💥 NUEVO: Las enviamos al frontend
    });

  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

const getVariantes = async (req, res) => {
  try {
    const variantes = await Product.getVariantes(req.params.id);
    res.status(200).json(variantes);
  } catch (error) {
    console.error('Error en getVariantes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const affected = await Product.update(req.params.id, req.body);
    if (!affected) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error en update:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await Product.delete(req.params.id);
    if (!affected) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, getVariantes, update, remove };