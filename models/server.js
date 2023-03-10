const express = require("express"),
  cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../dataBase/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      uploads: "/api/uploads",
    };
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

    //carrgar de archivo
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
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
