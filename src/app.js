import express from 'express';
import pool from './config.js';
import clientes from './modulos/categorias/ruta.js';
import productos from './modulos/productos/ruta.js';

const app = express();

//prueba de que anda
const getCategorias = async() =>{
  try {
    const result = await pool.query("select * from categorias;");
    console.log(result);
    
  } catch (error) {
    console.log(error);
    
  }
};

getCategorias()


app.use(express.json());

//configura el puerto
app.set('port',process.env.DB_PORT);


//ruta
app.use('/api/categorias', clientes);

//productos
app.use('/api/productos', productos);






export default app;