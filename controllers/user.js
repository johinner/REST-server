const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  // /api/usuarios/?q=hola&nombre=yo&apikey=alfa0212
  const query = req.query;
  const params = res.json({
    msg: "get API - controlador",
    query,
  });
};

const usuariosPost = (req, res = response) => {
  const body = req.body;
  res.json({
    msg: "post API - controllers",
    body,
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
