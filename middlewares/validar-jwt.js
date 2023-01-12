const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  // token => es el uid del usuario
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresonde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario No registrado en DB",
      });
    }

    // Verificar si el uid tiene el estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - usuario con estado : false",
      });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
