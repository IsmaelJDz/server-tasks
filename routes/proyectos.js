const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const proyectoController = require('../controllers/proyectoController');

// Crea proyectos
// api/proyectos
router.post(
  '/',
  auth,
  [
    check('nombre', 'El nombre del proyecto es obligatorio')
      .not()
      .isEmpty()
  ],
  proyectoController.crearProyecto
);

// Obtener todos los proyectos
router.get('/', auth, proyectoController.obtenerProyectos);

// Actualizar los proyectos via ID
router.put(
  '/:id',
  [
    check('Nombre', 'El nombre del proyecto es obligatorio')
      .not()
      .isEmpty()
  ],
  auth,
  proyectoController.actualizarProyecto
);

// Eliminar un proyecto
router.delete(
  '/:id',
  [
    check('Nombre', 'El nombre del proyecto es obligatorio')
      .not()
      .isEmpty()
  ],
  auth,
  proyectoController.eliminarProyecto
);

module.exports = router;
