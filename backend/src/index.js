const express = require('express');
const cors = require('cors');
const db = require('./config/db2');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/viajes/solicitar', async (req, res) => {
  console.log("-> Petición recibida:", req.body);
  const { id_usuario, origen, destino, simular_sin_stock } = req.body;

  try {
    // Escenario 2: Simulación de sin disponibilidad (RN3)
    if (simular_sin_stock) {
      console.log("-> Ejecutando simulación RN3...");
      const motivo = 'No hay unidades con estado disponible para el horario solicitado';
      return res.json({ resultado: 'rechazado', motivo_rechazo: motivo });
    }

    // Escenario 1: Búsqueda con sintaxis PostgreSQL (LIMIT 1)
    console.log("-> Consultando vehículos disponibles...");
    const vehiculos = await db.query("SELECT * FROM vehiculos WHERE estado = 'disponible' LIMIT 1");

    if (vehiculos.length > 0) {
      const vehiculo = vehiculos[0];
      console.log("-> Vehículo asignado:", vehiculo.id_vehiculo);

      const resViaje = await db.query(
        "INSERT INTO viajes (id_usuario, origen, destino, fecha_inicio, fecha_fin, estado_viaje) VALUES ($1, $2, $3, NOW(), NOW(), 'confirmado') RETURNING id_viaje",
        [id_usuario || 'S24001928', origen, destino]
      );
      const idViaje = resViaje[0].id_viaje;

      await db.query("INSERT INTO asignaciones (id_viaje, id_vehiculo, resultado) VALUES ($1, $2, 'aceptado')", [idViaje, vehiculo.id_vehiculo]);
      await db.query("UPDATE vehiculos SET estado = 'ocupado' WHERE id_vehiculo = $1", [vehiculo.id_vehiculo]);

      return res.json({ resultado: 'aceptado', vehiculo: vehiculo.id_vehiculo });
    } else {
      console.log("-> Sin unidades disponibles.");
      const motivo = 'No hay unidades con estado disponible para el horario solicitado';
      return res.json({ resultado: 'rechazado', motivo_rechazo: motivo });
    }

  } catch (error) {
    console.error("❌ Error en la consulta:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Servidor escuchando en http://localhost:3001"));