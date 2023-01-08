const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const { response, request } = require("express");
const Usuario = require("../models/usuario");

const usuariosGet = (req = request, res = response) => {
  // /api/usuarios/?q=hola&nombre=yo&apikey=alfa0212
  const query = req.query;
  const params = res.json({
    msg: "get API - controlador",
    query,
  });
};

const usuariosPost = async (req, res = response) => {
  // validacion
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  const usuario = new Usuario({ name, email, password, role });

  // Verificar si el email existe
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    return res.status(400).json({
      msg: "El correo ya esta registrado",
    });
  }

  // Encriptar el password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar db
  await usuario.save();
  res.json({
    msg: "post API - controllers",
    usuario,
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  res.json({
    msg: "put API - controllers",
    id,
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    msg: "delete API - controllers",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
};
