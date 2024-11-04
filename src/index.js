// index.js
import app from './app.js';
import pool from './config.js'; // Importa el pool

// ... (resto de tu código)

// Verificar la conexión a la base de datos al iniciar el servidor
/*
pool.getConnection((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Salir de la aplicación si hay un error
    } else {
        console.log('Conexión a la base de datos establecida');
    }
});
*/

app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});