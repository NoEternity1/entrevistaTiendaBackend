//jshint esversion:6

//require
const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
require('dotenv').config();

//express
const app = express();

//bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//public files
app.use(express.static("public"));

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "null"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//dbConnect
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.host,
    user            : process.env.user,
    password        : process.env.password,
    database        : process.env.database
});


//Captura Todas las categorias
function getMenu() {
    return new Promise ((resolve, reject) => {
        pool.getConnection((err) => {
            if (err) {
                reject(err);
            } else {
                //console.log("Capturando categorias para el menu");
                const query = "SELECT * FROM category";
                pool.query(query, function(err, result){
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            }
        })
    }) 
}

//captura todos los productos de una categoria en especifico
function getProduct(categoryID) {
    return new Promise ((resolve, reject) => {
        pool.getConnection((err) => {
            if (err) {
                reject(err);
            } else {
                const query = "SELECT * FROM product WHERE category=" + categoryID;
                pool.query(query, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            }
        })
    })
}

//encuentra producto por nombre
function findProduct(productName) {
    return new Promise ((resolve, reject) => {
        pool.getConnection((err) => {
            if (err) {
                reject(err);
            } else {
                const query = "SELECT * FROM product WHERE name='" + productName + "'";
                pool.query(query, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}

app.get("/categorias", function(req, res){
    getMenu()
        .then((categorias) => {
            const listaCategorias = categorias;
            res.send(listaCategorias);
        })
        .catch((err) => {
            console.log("Error ", err);
        })
});

app.get("/categorias/:categoryid", function(req, res){
    const categoryID = req.params.categoryid;
    getProduct(categoryID)
        .then((products) => {
            const listaProductos = products;
            res.send(listaProductos);
        })
        .catch((err) => {
            console.log("Error: ", err);
        })
});

app.get("/buscar/:buscarProductoNombre", function(req, res){
    const productName = req.params.buscarProductoNombre;
    findProduct(productName)
        .then((result) => {
            const productoEncontrado = result;
            res.send(productoEncontrado)
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
});


//listener
let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 3000;
}

app.listen(PORT, () => {
    console.log("servidor en puerto 3000");
})