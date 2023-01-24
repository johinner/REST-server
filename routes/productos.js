const { Router } = require("express");
const { check } = require("express-validator");
const {
  productoPost,
  productosGet,
  productoGet,
  productoPut,
  productoDelete,
} = require("../controllers/productos");
const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const producto = require("../models/producto");

const router = Router();

router.get("/", productosGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido ").isMongoId(),
    validarCampos,
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoGet
);

router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  productoPost
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido ").isMongoId(),
    validarCampos,
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido ").isMongoId(),
    validarCampos,
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  productoDelete
);

module.exports = router;
