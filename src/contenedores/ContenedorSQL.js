const knex = require('knex');

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async get(id) {
        this.knex.select('*').from(this.tabla).where('id', id)
        .then((rows) => {
            return rows;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }

    async getAll() {
        this.knex.select('*').from(this.tabla)
        .then((rows) => {
            return rows;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }

    async save(elem) {
        this.knex.insert(elem).into(this.tabla)
        .then((rows) => {
            return rows;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }

    async update(elem, id) {
        this.knex(this.tabla).update(elem).where('id', id)
        .then((rows) => {
            return rows;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }



    async del(id) {
        this.knex(this.tabla).where('id', id).del()
        .then(() => {
            console.log(`El elemento con id: ${id} fue borrado exitosamente`)
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }

    async delAll() {
        this.knex(this.tabla).del()
        .then(() => {
            console.log(`Se borraron todos los elementos de la tabla ${this.tabla}`)
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
        .finally(() => {
            this.knex.destroy();
        })
    }

    async disconnect() {
        this.knex.destroy();
    }
}

module.exports = ContenedorSQL;