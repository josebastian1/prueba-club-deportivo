import express from 'express';
import { promises as fs } from 'fs';

const app = express();
const rutaArchivo = 'deportes.json';

app.listen(3000, () => {
    console.log(`Servidor escuchando en el puerto 3000`);
});

app.use(express.json());

// Ruta para obtener el JSON con todos los deportes registrados

app.get('/deportes', async (req, res) => {
    try {
        const data = await fs.readFile(rutaArchivo, 'utf8');
        const deportes = JSON.parse(data);
        res.json(deportes);
    } catch (err) {
        res.status(500).send(`Error al leer el archivo JSON: ${err.message}`);
    }
});

// Ruta para agregar un deporte

app.post('/deportes', async (req, res) => {
    const { nombre, numero_de_jugadores, canchas_disponibles, valor_de_la_hora } = req.body;

    try {
        const data = await fs.readFile(rutaArchivo, 'utf8');
        const deportes = JSON.parse(data);

        // Agregar el nuevo deporte
        deportes.push({ nombre, numero_de_jugadores, canchas_disponibles, valor_de_la_hora });

        // Guardar los nuevos deportes en el JSON
        await fs.writeFile(rutaArchivo, JSON.stringify(deportes, null, 2));
        res.status(201).send('Deporte agregado exitosamente');
    } catch (err) {
        res.status(500).send(`Error al procesar la solicitud: ${err.message}`);
    }
});

// Ruta para eliminar un deporte

app.delete('/deportes/:nombre', async (req, res) => {
    const { nombre } = req.params;

    try {
        const data = await fs.readFile(rutaArchivo, 'utf8');
        let deportes = JSON.parse(data);

        // Filtrar el deporte a eliminar (por nombre)
        deportes = deportes.filter(deporte => deporte.nombre !== nombre);

        // Guardar en JSON
        await fs.writeFile(rutaArchivo, JSON.stringify(deportes, null, 2));
        res.send('Deporte eliminado exitosamente');
    } catch (err) {
        res.status(500).send(`Error al procesar la solicitud: ${err.message}`);
    }
});

// Ruta para editar el valor de la hora de un deporte

app.put('/deportes/:nombre', async (req, res) => {
    const { nombre } = req.params;
    const { valor_de_la_hora } = req.body;

    try {
        const data = await fs.readFile(rutaArchivo, 'utf8');
        const deportes = JSON.parse(data);

        // Encontrar el deporte por su nombre y actualizar el valor de la hora
        const deporteIndex = deportes.findIndex(d => d.nombre === nombre);
        if (deporteIndex === -1) {
            res.status(404).send('Deporte no encontrado');
            return;
        }

        deportes[deporteIndex].valor_de_la_hora = valor_de_la_hora;

        // Guardar los deportes actualizados en el JSON
        await fs.writeFile(rutaArchivo, JSON.stringify(deportes, null, 2));
        res.send('Valor de la hora del deporte actualizado exitosamente');
    } catch (err) {
        res.status(500).send(`Error al procesar la solicitud: ${err.message}`);
    }
});