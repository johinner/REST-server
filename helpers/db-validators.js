const { Categoria, Roles, Usuario } = require("../models");

const esRoleValido = async (role = "") => {
  const existeRol = await Roles.findOne({ role });
  if (!existeRol) throw new Error(`El rol ${role} no esta registrado en la BD`);
};

const existeEmail = async (email = "") => {
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail)
    throw new Error(`El correo ${email} ya esta registrado en la BD`);
};

const existeUsuarioPorId = async (id = "") => {
  const existeUsario = await Usuario.findById(id);
  if (!existeUsario) throw new Error(`El id no existe ${id}`);
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoriaPorId,
};
