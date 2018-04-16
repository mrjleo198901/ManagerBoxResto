
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Factura = require('../models/factura');

Factura.methods(['get', 'put', 'post', 'delete', 'search']);
Factura.register(router, '/factura');

module.exports = router;


router.post('/getVentasByDate', function (req, res, next) {

    Factura.find(
        {
            /*"fecha_emision": {
                $gte: new Date(req.body.fecha_ini + "T00:00:00.000Z"),
                $lte: new Date(req.body.fecha_fin + "T23:00:00.000Z")

            }*/
            "fecha_emision": {
                $gte: new Date(req.body.fecha_ini),
                $lte: new Date(req.body.fecha_fin)
            }

        }, function (err, datos) {
            //console.log(datos)
            if (err) {
                return next(err)

            }
            res.json(datos);
        }
    )
});


router.post('/getVentasByDateDF', function (req, res, next) {
    Factura.find({
        "detalleFacturaV.fecha": {
            $gte: new Date(req.body.fecha_ini),
            $lte: new Date(req.body.fecha_fin)
        }, "cajero": req.body.cajero
    },
        { detalleFacturaV: 1, nombre: 1 },
        function (err, datos) {
            if (err) { return next(err) }
            res.json(datos);
        })
});

router.post('/getVentasByDateCajero', function (req, res, next) {

    Factura.find({
        "fecha_emision": {
            $gte: new Date(req.body.fecha_ini),
            $lte: new Date(req.body.fecha_fin)
        }, "cajero": mongoose.Types.ObjectId(req.body.cajero)
    }, function (err, datos) {
        if (err) { return next(err) }
        res.json(datos);
    })
});

router.get('/getLastOne', function (req, res, next) {
    Factura.findOne({}, {}, { sort: { 'created_at': -1 } }, function (err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});