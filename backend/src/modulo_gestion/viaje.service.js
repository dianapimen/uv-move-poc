const db = require('../config/db2');
const asignacionService = require('../modulo_asignacion/asignacion.service');

class ViajeService {
  async solicitarViaje(idUsuario, origen, destino, fechaInicio, fechaFin) {
    // Validar cuenta activa del usuario (RN1)
    const usuarios = await db.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [idUsuario]
    );

    if (!usuarios.length || usuarios[0].estado_cuenta !== 'activa') {
      throw new Error("La cuenta del usuario no está activa.");
    }

    // Insertar el viaje en estado pendiente y retornar el ID generado
    const res = await db.query(
      "INSERT INTO viajes (id_usuario, origen, destino, fecha_inicio, fecha_fin, estado_viaje) VALUES ($1, $2, $3, $4, $5, 'pendiente') RETURNING id_viaje",
      [idUsuario, origen, destino, fechaInicio, fechaFin]
    );

    const idViaje = res[0].id_viaje;

    // Colaboración entre módulos
    const resultadoAsignacion = await asignacionService.procesarAsignacion(idViaje);
    return { id_viaje: idViaje, ...resultadoAsignacion };
  }
}

module.exports = new ViajeService();