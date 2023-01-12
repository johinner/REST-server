const { check } = require("express-validator");

const { Router } = require("express"),
  router = Router();

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares/index");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require("../controllers/user");

const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido ").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("name", "El nombre  es obligatorio").not().isEmpty(),
    check("password", "la contrase;a debe ser mas de 6 caracteres").isLength({
      min: 6,
    }),
    check("email", "El correo no es valido").isEmail(),
    check("email").custom(existeEmail),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    //esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido ").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
