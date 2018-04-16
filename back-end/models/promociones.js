var restful = require("node-restful");
var mongoose = restful.mongoose;

var promocionesSchema = new mongoose.Schema({
    nombre: String,
    productosV: Array,
    estado: Number,
    tipoPromo: String
});

module.exports = restful.model('promociones', promocionesSchema);