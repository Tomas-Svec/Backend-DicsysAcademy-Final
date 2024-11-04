import express from 'express';
import pool from '../../config.js'

const router = express.Router();

//listar categorias
router.get('/',async(req,res) =>{
    try {
        const [result] = await pool.query('select * from categorias')
        res.send(result)
    } catch (error) {
        console.log('Error al listar: ',error);
        res.status(404).send('Error al listar las categorias')
    }
})

//crear categorias
router.post('/', async(req,res) => {
    const body = req.body
    
    const {nombre} = req.body;

    if(!nombre){
        return res.status(400).json({
            status: 400,
            mensaje: 'El campo "nombre" es obligatorio.'
        });
    }

    try {
        //Validación si existe:
        const [existeCategorias] = await pool.query(
            'SELECT * FROM categorias WHERE nombre = ?',
            [nombre]
        );

        if (existeCategorias.length > 0){
            return res.status(409).json({
                status: 409,
                mensaje: 'Ya existe una categoria con ese nombre.'
            })
        }

        //Query SQL
        const [result] = await pool.query(
            'INSERT INTO categorias (nombre) VALUES (?)', [nombre]
        );
        res.status(201).json({
            status: 201,
            mensaje: 'Se creó la categoría con éxito',
            data: { nombre }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: 'Error al crear la categoría',
            error: error.message
        });
    }

});

//Actualizar categorias
router.put('/:id', async (req,res) =>{
    const {id} = req.params;
    const {nombre} = req.body;

    //Validación si no pasa parametros
    if(!id || !nombre){
        return res.status(400).json({
            status: 400,
            mensaje: 'El id y el nombre son obligatorios'
        });
    }

    
    try {
        const [result] = await pool.query(
            'UPDATE categorias SET nombre = ? WHERE id = ?',
            [nombre, id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                status: 404,
                mensaje: 'No se encontró una categoría con ese ID.'
            });
        }
        //Respuesta positiva
        res.json({
            status: 200,
            mensaje: 'La categoría se actualizó con éxito',
            data: { id, nombre }
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: 'Error al actualizar la categoría',
            error: error.message
        });
    }


})

//eliminar categorias
router.delete('/:id', async (req,res)=>{
    const {id} = req.params;

    //Validación
    if(!id){
        return res.status(400).json({
            status: 400,
            mensaje: 'El id es obligatorio'
        });
    }

    try {
        const [result] = await pool.query(
            'DELETE FROM categorias WHERE id = ?',
            [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                status: 404,
                mensaje: 'No se encontró una categoría con ese ID.'
            });
        }

        //Respuesta positiva
        res.json({
            status: 200,
            mensaje: 'La categoría se borrió con éxito',
            data: { id }
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: 'Error al borrar la categoría',
            error: error.message
        });
    }
})


export default router;