//rutas para crear usuarios

const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

// Crea usuario

// api/usuarios
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio")
      .not()
      .isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo 6 caracteres").isLength({
      min: 6
    })
  ],
  usuarioController.createUsuarios
);

module.exports = router;
