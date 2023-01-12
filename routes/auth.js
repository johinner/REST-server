const { check } = require("express-validator");
const { Router } = require("express");
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contrase;a es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
