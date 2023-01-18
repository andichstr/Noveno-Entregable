import { promises as fs } from 'fs'
import config from '../config.js'

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        try{
            const elements = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(elements[id]);
        }catch(error) {
            console.error(error);
        }
    }

    async listarAll() {
        try{
            const elements = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(elements);
        }catch(error) {
            console.error(error);
        }
    }

    async guardar(obj) {
        try{
            const arch = await fs.readFile(this.ruta, 'utf-8');
            const elements = JSON.parse(arch);
            elements.push(obj);
            fs.writeFile(this.ruta, JSON.stringify(elements), 'utf-8');
        }catch(error) {
            console.error(error);
        }
    }

    async actualizar(elem) {
        try{
            const arch = await fs.readFile(this.ruta, 'utf-8');
            const elements = JSON.parse(arch);
            const index = elements.findIndex(element => element.id == elem.id);
            elements[index] = elem;
            fs.writeFile(this.ruta, JSON.stringify(elements), 'utf-8');
        }catch(error) {
            console.error(error);
        }
    }

    async borrar(id) {
        try{
            const arch = await fs.readFile(this.ruta, 'utf-8');
            const elements = JSON.parse(arch);
            const index = elements.findIndex(element => element.id == id);
            elements.splice(index, 1);
            fs.writeFile(this.ruta, JSON.stringify(elements), 'utf-8');
        }catch(error) {
            console.error(error);
        }
    }

    async borrarAll() {
        try{
            fs.writeFile(this.ruta, '[]', 'utf-8');
        }catch(error) {
            console.error(error);
        }
    }
}


export default ContenedorArchivo