const express = require("express"),
  cors = require("cors");

const { dbConnection } = require("../dataBase/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";
    //Conectar a base de datos
    this.conectarDB();
    //Middlewares => funcion que siempre van a ejecutarse cuando se levanta el servidor
    this.middlewares();
    //Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
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
    this.app.use(this.authPath, require("../routes/auth"));
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
