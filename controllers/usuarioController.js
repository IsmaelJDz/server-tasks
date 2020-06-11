const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUsuarios = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // validar que el usuario se unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya exite" });
    }

    // crea usuario
    usuario = new Usuario(req.body);
    // Hashear password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    await usuario.save();

    // Crear y firmar el JWT, informacion de la entidad y datos adicionales
    const payload = {
      usuario: {
        id: usuario.id
      }
    };

    // firmar el JWT
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600 // 1hora
      },
      (error, token) => {
        if (error) throw error;

        // mensaje de
        res.send({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
