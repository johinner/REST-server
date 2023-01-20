const { check } = require("express-validator");
const { Router } = require("express");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  categoriaPost,
  categoriasGet,
  categoriaGet,
  categoriaPut,
  categoriaDelete,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", categoriasGet);

// Obtener una categoria - publica
router.get(
  "/:id",
  [
    check("id").custom(existeCategoriaPorId),
    check("id", "No es un ID valido ").isMongoId(),
    validarCampos,
  ],
  categoriaGet
);

// Crear categoria - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  categoriaPost
);

// Actualizar una categoria - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaPut
);

// Borrar una categoria = solo Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido ").isMongoId(),
    validarCampos,
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaDelete
);

module.exports = router;
