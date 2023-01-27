const auth = require("../controllers/auth");
const categorias = require("../controllers/categorias");
const buscar = require("../controllers/buscar");
const producto = require("../controllers/productos");
const user = require("../controllers/user");
const uploads = require("../controllers/uploads");

module.exports = {
  ...auth,
  ...categorias,
  ...buscar,
  ...producto,
  ...user,
  ...uploads,
};
