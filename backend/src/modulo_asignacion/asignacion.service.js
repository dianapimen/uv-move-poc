const db = require('../config/db2');

class AsignacionService {
  async procesarAsignacion(idViaje) {
    // Consulta adaptada para PostgreSQL (LIMIT 1)
    const vehiculos = await db.query(
      "SELECT * FROM vehiculos WHERE estado = 'disponible' LIMIT 1"
    );

    if (vehiculos.length > 0) {
      const vehiculo = vehiculos[0];

      // Registrar la asignación aceptada y actualizar estados
      await db.query(
        "INSERT INTO asignaciones (id_viaje, id_vehiculo, resultado) VALUES ($1, $2, 'aceptado')",
        [idViaje, vehiculo.id_vehiculo]
      );
      await db.query(
        "UPDATE vehiculos SET estado = 'ocupado' WHERE id_vehiculo = $1",
        [vehiculo.id_vehiculo]
      );
      await db.query(
        "UPDATE viajes SET estado_viaje = 'confirmado' WHERE id_viaje = $1",
        [idViaje]
      );

      return {
        resultado: 'aceptado',
        vehiculo: vehiculo.id_vehiculo,
        ubicacion: vehiculo.ubicacion_actual
      };
    } else {
      // Regla RN3: Registro obligatorio del motivo de rechazo
      const motivo = 'No hay unidades con estado disponible para el horario solicitado';
      await db.query(
        "INSERT INTO asignaciones (id_viaje, resultado, motivo_rechazo) VALUES ($1, 'rechazado', $2)",
        [idViaje, motivo]
      );
      await db.query(
        "UPDATE viajes SET estado_viaje = 'rechazado' WHERE id_viaje = $1",
        [idViaje]
      );

      return { resultado: 'rechazado', motivo_rechazo: motivo };
    }
  }
}

module.exports = new AsignacionService();