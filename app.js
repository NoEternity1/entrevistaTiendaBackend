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
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

function getMenu() {
    return new Promise ((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Connectado al servidor SQL");
                const query = "SELECT * FROM category";
                connection.query(query, function (err, result) {
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

app.get("/", function(req, res){
    
    //captura las categorias y las envia al front end para menu
    getMenu().then((categorias) => {
        const menuList = [];
        categorias.map((categoria) => {
            menuList.push("<li><a class=dropdown-item href=/" + categoria.name + ">" + categoria.name + "</a></li>");
        })
        res.send(menuList.join(""));
        //res.send(categorias);
    }).catch((err) => {
        console.log("Error ", err);
    }).finally(() => {
        connection.end();
    });

})





//listener
app.listen(PORT, () => {
    console.log("servidor en puerto 3000");
})