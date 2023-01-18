import express from 'express'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import { normalize, schema } from 'normalizr'

import ContenedorSQL from './contenedores/ContenedorSQL.js'
import ContenedorArchivo from './contenedores/ContenedorArchivo.js'

import config from './config.js'
import faker from 'faker'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES



// Definimos un esquema de autor
const autorSchema = new schema.Entity('autor', {idAttribute: 'email'});

// Definimos un esquema de mensaje
const mensajeSchema = new schema.Entity('mensaje');

// Definimos un esquema de posts
const postSchema = new schema.Entity('posts', {
    autor: autorSchema,
    mensajes: [mensajeSchema]
});




//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productosApi.getAll());

    // actualizacion de productos
    socket.on('update', data => {
        productosApi.save(data);
        io.sockets.emit('productos', productosApi.getAll());
    })

    // carga inicial de mensajes
    socket.emit('mensajes', mensajesApi.listarAll());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', data => {
        mensajesApi.guardar(data);
        const mensajes = mensajesApi.listarAll();
        io.sockets.emit('mensajes', listarMensajesNormalizados(mensajes, postSchema));
    })

});

async function listarMensajesNormalizados(mensajes, schema) {
    return normalize(mensajes, schema);
}

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------

app.get('/api/productos-test', (req, res) => {
    const testProductos = [];
    for (let i = 0; i<5; i++){
        testProductos.push({
            'title': faker.commerce.product(),
            'price': faker.commerce.price(),
            'thumbnail': faker.image.imageUrl()
        })
    }
    res.send(testProductos);
})

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))