const { response } = require("express");
const { Categoria } = require("../models");

// obtenerCaregorias - paginado - total - populate

const categoriasGet = async (req, res = response) => {
  const { limite = 0, desde = 0 } = req.query;
  const query = { estado: true };

  const [categorias, total] = await Promise.all([
    Categoria.find(query).populate("usuario", "name").skip(desde).limit(limite),
    Categoria.countDocuments(query),
  ]);

  res.json({ total, categorias });
};

// obtenerCategoria - populate {}

const categoriaGet = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "name");

  res.json(categoria);
};

const categoriaPost = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoriaDB = await Categoria.findOne({ name });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.name}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    name,
    usuario: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

// actualizarCategoria

const categoriaPut = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);
};

// borrarCategoria - estado: false

const categoriaDelete = async (req, res) => {
  const { id } = req.params;

  //const usuario = await Categoria.findByIdAndDelete(id);
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoria);
};

module.exports = {
  categoriaPost,
  categoriasGet,
  categoriaGet,
  categoriaPut,
  categoriaDelete,
};
