Api desarrollada para generar consultas a una base de datos de productos al momento de recibir una peticion.
El lenguaje utilizado es nodejs.

Funcionamiento

La api cuenta con 3 Endpoint para realizar las siguientes consultas:

1.- GET /categorias, la cual entrega como resultado todas las categorias disponibles.
2.- GET /categorias/:categoryid, la cual entrega como resultados todos los productos que pertenecen a una categoria en especifico.
3.- GET /buscar/:buscarProductoNombre, la cual entrega el resultado de la buscade de un producto por nombre.

La informacion entregada es en formato JSON, de la siguiente manera:

[
  {
  "id": 5,
  "name": "ENERGETICA MR BIG",
  "url_image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/misterbig3308256.jpg",
  "price": 1490,
  "discount": 20,
  "category": 1
  }
]
