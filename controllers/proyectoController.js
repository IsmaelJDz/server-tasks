const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
  console.log(req.body);
  // Revisar si hay errores
  const errores = validationResult(req);
  console.log(errores);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);

    // Guardar el creador JWT
    proyecto.creador = req.usuario.id;

    // Guardamos el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error.response);
    res.status(500).json({ error: 'Hubo un error' });
  }
};

// Obtiene todos los proyectos del usuario acutal

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1
    });
    res.json({ proyectos });
  } catch (error) {
    res.status(500).send('Hubo un error');
  }
};

// Actualiza un proyecto

exports.actualizarProyecto = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extraer la informacion del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).res.send({ msg: 'Proyecto no encontrado' });
    }

    // verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      {
        new: true
      }
    );
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
};

// Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).res.send({ msg: 'Proyecto no encontrado' });
    }

    // verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // Eliminar proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Proyecto Eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
};
