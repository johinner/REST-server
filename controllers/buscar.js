const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuario = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); //true

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const condiciones = {
    $or: [{ name: regex }, { email: regex }],
    $and: [{ estado: true }],
  };
  const [usuarios, total] = await Promise.all([
    Usuario.find(condiciones),
    Usuario.count(condiciones),
  ]);

  return res.json({
    resultsTotal: total,
    results: usuarios,
  });
};

const buscarCategoria = async (termino, res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino).populate(
      "usuario",
      "name"
    );
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const condiciones = { name: regex, estado: true };

  const [categoria, total] = await Promise.all([
    Categoria.find(condiciones).populate("usuario", "name"),
    Categoria.count(condiciones),
  ]);

  return res.json({
    resultsTotal: total,
    results: categoria,
  });
};

const buscarProducto = async (termino, res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate("categoria", "name")
      .populate("usuario", "name");
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const condiciones = {
    $or: [{ name: regex }],
    $and: [{ estado: true }],
  };

  const [producto, total] = await Promise.all([
    Producto.find(condiciones)
      .populate("categoria", "name")
      .populate("usuario", "name"),
    Producto.count(condiciones),
  ]);

  return res.json({
    resultsTotal: total,
    results: producto,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones pemitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProducto(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se me olvido esta busqueda",
      });
  }
};

module.exports = {
  buscar,
};
