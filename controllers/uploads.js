const { response } = require("express");
const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json({ msg: "No hay archivo que subir" });
  //   return;
  // }
  try {
    const nombreArchivo = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombreArchivo });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarArchivo = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con el id: " + id,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un Producto con el id: " + id,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }
  try {
    //limpiar imagenes previas
    if (modelo.img) {
      // Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();
    res.json({ modelo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const actualizarImgCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con el id: " + id,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un Producto con el id: " + id,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }
  try {
    // borrar img anterior
    if (modelo.img) {
      const nombreArr = modelo.img.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");

      cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const mostrarArchivo = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con el id: " + id,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un Producto con el id: " + id,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }
  try {
    //limpiar imagenes previas
    if (modelo.img) {
      // Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
  const NotImg = path.join(__dirname, "../assets", "13.1 no-image.jpg");
  res.sendFile(NotImg);
};

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  mostrarArchivo,
  actualizarImgCloudinary,
};
