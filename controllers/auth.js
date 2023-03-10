const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }
    // Verificar la contrase/a
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }
    // Generar el JWT
    const token = await generarJWT(usuario.id);
    res.json({
      msg: "login ok",
      usuario,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignin = (req, res = response) => {
  const { id_token } = req.body;

  res.json({
    msg: "Todo ok! google signin",
  });
};

module.exports = { login, googleSignin };
