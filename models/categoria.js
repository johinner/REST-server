const { Schema, model } = require("mongoose");

const categoriaSchema = Schema({
  name: {
    type: String,
    require: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    require: true,
  },
});

module.exports = model("Categoria", categoriaSchema);
