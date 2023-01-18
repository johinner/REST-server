const { check } = require("express-validator");
const { Router } = require("express");

const { validarJWT, validarCampos } = require("../middlewares");
const { crearCategoria } = require("../controllers/categorias");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", (req, res) => {
  res.json("get");
});

// Obtener una categoria - publica
router.get("/:id", (req, res) => {
  res.json("get - id");
});

// Crear categoria - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar una categoria - cualquier persona con un token valido
router.put("/:id", (req, res) => {
  res.json("put");
});

// Borrar una categoria = solo Admin
router.delete("/:id", (req, res) => {
  res.json("delete - 'estado'");
});

module.exports = router;
