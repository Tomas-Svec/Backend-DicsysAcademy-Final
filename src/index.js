import app from './app.js';
import pool from './config.js'; // Importa el pool

app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});