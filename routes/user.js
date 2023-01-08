const { body } = require("express-validator");

const { Router } = require("express"),
  router = Router();

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require("../controllers/user");

router.get("/", usuariosGet);

router.put("/:id", usuariosPut);

router.post(
  "/",
  [
    body("name", "El nombre  es obligatorio").not().isEmpty(),
    body("password", "la contrase;a de mas de 6 caracteres").isLength({
      min: 6,
    }),
    body("email", "El correo no es valido").isEmail(),
  ],
  usuariosPost
);

router.delete("/", usuariosDelete);

module.exports = router;
