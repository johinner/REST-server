const { response } = require("express");
const { Producto } = require("../models");

const productosGet = async (req, res = response) => {
  const { limite = 0, desde = 0 } = req.query;
  const query = { estado: true };

  const [productos, total] = await Promise.all([
    Producto.find(query)
      .populate("usuario", "name")
      .populate("categoria", "name")
      .skip(desde)
      .limit(limite),
    Producto.countDocuments(query),
  ]);

  res.json({ total, productos });
};

const productoGet = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "name")
    .populate("categoria", "name");
  res.json(producto);
};

const productoPost = async (req, res = response) => {
  const { name, precio, descripcion, disponible, categoria } = req.body;
  name.toUpperCase();
  descripcion.toLowerCase();

  const productoDB = await Producto.findOne({ name });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ya existe: ${productoDB.name} `,
    });
  }

  const data = {
    name,
    precio,
    descripcion,
    disponible,
    usuario: req.usuario._id,
    categoria,
  };

  const producto = await new Producto(data);

  await producto.save();

  res.status(201).json(producto);
};

const productoPut = async (req, res = response) => {
  const { id } = req.params,
    { estado, usuario, ...data } = req.body;

  if (data.name) data.name = data.name.toUpperCase();

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

const productoDelete = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  productoPost,
  productosGet,
  productoGet,
  productoPut,
  productoDelete,
};
