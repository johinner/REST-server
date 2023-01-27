const { check } = require("express-validator");
const { Router } = require("express");

const { validarCampos } = require("../middlewares");
const {
  cargarArchivo,
  actualizarArchivo,
  mostrarArchivo,
  actualizarImgCloudinary,
} = require("../controllers");
const { coleccionesPermitas } = require("../helpers");

const router = Router();

router.post("/", cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((coleccion) =>
      coleccionesPermitas(coleccion, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImgCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((coleccion) =>
      coleccionesPermitas(coleccion, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarArchivo
);

module.exports = router;
