import express from 'express';
import pool from '../../config.js'

const router = express.Router();

//Listar productos
router.get('/', async (req, res) => {
    try {
        const [result] = await pool.query('select * from productos')
        res.send(result)
    } catch (error) {
        console.log('Error al listar: ', error);
        res.status(404).send('Error al listar las categorias')
    }
})

//Listar productos por ID
router.get('/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const query = 'SELECT * FROM productos WHERE id_categoria = ?';
        const [productos] = await pool.query(query, [id_categoria]);

        res.send(productos);
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});


//Crear productos
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    try {
        // Validar si ya existe un producto con el mismo nombre
        const [existeProducto] = await pool.query('SELECT * FROM productos WHERE nombre = ?', [nombre]);
        if (existeProducto.length > 0) {
            return res.status(400).json({
                status: 400,
                mensaje: 'Ya existe un producto con ese nombre.'
            });
        }

        // Query para insertar el nuevo producto
        const query = `
            INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [nombre, descripcion, precio, stock, id_categoria]);

        res.status(201).json({
            status: 201,
            mensaje: 'Producto creado exitosamente',
            producto: {
                id: result.insertId,
                nombre,
                descripcion,
                precio,
                stock,
                id_categoria
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: 'Error al crear el producto',
            error: error.message
        });
    }
});


//ACTUALIZAR
router.put('/:id', async (req, res) => {
    const { id } = req.params;  // ID del producto a modificar
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    try {
        // Verificar si el producto existe
        const [productoExistente] = await pool.query(
            'SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, c.id AS id_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id WHERE p.id = ?',
            [id]
        );

        if (productoExistente.length === 0) {
            return res.status(404).send('Producto no encontrado.');
        }

        // Validar que la categoria es corresponde al producto
        if (id_categoria && id_categoria !== productoExistente[0].id_categoria) {
            return res.status(400).send('La categoría del producto no coincide.');
        }

        // Actualizar el producto
        const query = `
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?
      WHERE id = ?
    `;

        await pool.query(query, [nombre, descripcion, precio, stock, id_categoria || productoExistente[0].id_categoria, id]);

        res.send({ message: 'Producto actualizado correctamente.' });
    } catch (error) {
        console.log('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto.');
    }
});



//Eliminar Productos
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        //Verificar si existe
        const [existeProducto] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

        if (existeProducto.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        //Query Eliminar
        await pool.query('DELETE FROM productos WHERE id = ?', [id]);


        res.send({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.log('Error al eliminar producto: ', error);
        res.status(500).send('Error al eliminar el producto.');
    }
});

export default router;