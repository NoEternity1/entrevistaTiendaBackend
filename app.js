//jshint esversion:6

//require
const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
require('dotenv').config();

//express
const app = express();

const PORT = process.env.PORT || 3000;

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
                //console.log("Capturando productos que pertenecen a la categoria seleccionada");
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

function findProduct(productName) {

    return new Promise ((resolve, reject) => {
        pool.getConnection((err) => {
            if (err) {
                reject(err);
            } else {
                //console.log("buscando producto");
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
    
    //captura las categorias y las envia al front end para menu
    getMenu()
        .then((categorias) => {
            const menuList = [];
            categorias.map((categoria) => {
                menuList.push("<li><a id=" + categoria.id + " class=dropdown-item href=# onclick=buscarProductos(id) >" + categoria.name + "</a></li>");
            })
            res.send(menuList.join(""));
        })
        .catch((err) => {
            console.log("Error ", err);
        })
});

app.get("/categorias/:categoryid", function(req, res){
    
    const categoryID = req.params.categoryid;

    getProduct(categoryID)
        .then((products) => {
            const listaProductos = [];
            products.map((product) => {
                listaProductos.push(
                    "<div class=col-3><div class=card style=width: 18rem;><img src=" + product.url_image + " class=card-img-top alt=''><div class=card-body><h5 class=card-title>" + product.name + "</h5><p class=card-text>" + product.price + "</p><a href=# class='btn btn-primary'>Go somewhere</a></div></div></div>"
                )
            })
            res.send(listaProductos.join(""));
        })
        .catch((err) => {
            console.log("Error: ", err);
        })
});

app.get("/buscar/:buscarProductoNombre", function(req, res){
    const productName = req.params.buscarProductoNombre;

    findProduct(productName)
        .then((result) => {
            const productoEncontrado = [];
            result.map((product) => {
                productoEncontrado.push(
                    "<div class=col-3><div class=card style=width: 18rem;><img src=" + product.url_image + " class=card-img-top alt=''><div class=card-body><h5 class=card-title>" + product.name + "</h5><p class=card-text>" + product.price + "</p><a href=# class='btn btn-primary'>Go somewhere</a></div></div></div>"
                )
            })
            
            res.send(productoEncontrado.join(""));
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
});


//listener
app.listen(PORT, () => {
    console.log("servidor en puerto 3000");
})