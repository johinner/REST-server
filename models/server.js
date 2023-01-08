const express = require("express"),
  cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    //Middlewares => funcion que siempre van a ejecutarse cuando se levanta el servidor
    this.middlewares();
    //Rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //lectura y parcseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.info(
        `Servidor corriendo en puerto, http://localhost:${this.port}/`
      );
    });
  }
}

module.exports = Server;