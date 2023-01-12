const bcryptjs = require("bcryptjs");

const { response, request } = require("express");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 0, desde = 0 } = req.query;
  const query = { estado: true };

  const [usuarios, total] = await Promise.all([
    Usuario.find(query).skip(desde).limit(limite),
    Usuario.countDocuments(query),
  ]);

  res.json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const usuario = new Usuario({ name, email, password, role });

  // Encriptar el password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar db
  await usuario.save();
  res.json(usuario);
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  //  TODO validar contra base de datos
  if (password) {
    // Encriptar el password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;
  const uid = req.uid;

  //const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  const usuarioAutenticado = req.usuario;
  const msg = `Usuario ${usuario.name} modificado a estado false Por el usuario ${usuarioAutenticado.name}`;

  res.json({
    msg,
    usuario,
    usuarioAutenticado,
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
