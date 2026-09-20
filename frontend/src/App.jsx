import { useState } from 'react'

export default function App() {
  const [pantalla, setPantalla] = useState(1)
  const [origen, setOrigen] = useState('CAMPUS IXTACZOQUITLAN')
  const [destino, setDestino] = useState('COCO')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  const usuario = { nombre: 'Diana', matricula: 'S24001928', estadoCuenta: 'activa' }

const handleSolicitar = async (simularSinStock = false) => {
    setLoading(true)
    
    // Simulación de respuesta inmediata para la PoC
    setTimeout(() => {
      setLoading(false)
      if (simularSinStock) {
        // Escenario 2: Aplicación de Regla RN3 (Rechazado)
        setResultado({ 
          resultado: 'rechazado', 
          motivo_rechazo: 'No hay unidades con estado disponible para el horario solicitado' 
        })
        setPantalla(5) // Redirige a Pantalla 5: Alerta de Rechazo
      } else {
        // Escenario 1: Asignación Exitosa
        setResultado({ 
          resultado: 'aceptado', 
          vehiculo: 'VH-014' 
        })
        setPantalla(4) // Redirige a Pantalla 4: Confirmación
      }
    }, 400)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      {/* PANTALLA 1: Inicio / Mis Viajes */}
      {pantalla === 1 && (
        <div>
          <h2>Hola, {usuario.nombre}</h2>
          <p><strong>Matrícula:</strong> {usuario.matricula}</p>
          <span style={{ background: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
            Cuenta {usuario.estadoCuenta}
          </span>
          <br /><br />
          <button style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setPantalla(2)}>
            + Solicitar Viaje
          </button>
          <h3 style={{ marginTop: '20px' }}>Mis Viajes</h3>
          <ul>
            <li>USBI - Pista (Confirmado)</li>
            <li>USBI - Fortín (Rechazado)</li>
          </ul>
        </div>
      )}

      {/* PANTALLA 2: Solicitar Viaje */}
      {pantalla === 2 && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Solicitar Viaje</h2>
          <label>Origen:</label>
          <input style={{ width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }} value={origen} onChange={e => setOrigen(e.target.value)} />
          
          <label>Destino:</label>
          <input style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }} value={destino} onChange={e => setDestino(e.target.value)} />
          
          <button disabled={loading} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleSolicitar(false)}>
            {loading ? 'Procesando...' : 'Buscar Vehículo Disponible'}
          </button>
          
          <button disabled={loading} style={{ width: '100%', padding: '8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleSolicitar(true)}>
            Simular vehículo no disponible (RN3)
          </button>
        </div>
      )}

      {/* PANTALLA 4: Viaje Confirmado (Aceptado) */}
      {pantalla === 4 && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#28a745' }}>✓ Viaje Confirmado</h2>
          <p><strong>Ruta:</strong> {origen} → {destino}</p>
          <p><strong>Vehículo Asignado:</strong> {resultado?.vehiculo || 'VH-014'}</p>
          <button style={{ width: '100%', padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setPantalla(1)}>Volver al Inicio</button>
        </div>
      )}

      {/* PANTALLA 5: Sin Disponibilidad (Rechazado RN3) */}
      {pantalla === 5 && (
        <div>
          <h2 style={{ color: '#dc3545', textAlign: 'center' }}>✕ Sin vehículos disponibles</h2>
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
            <strong>Motivo de rechazo:</strong> {resultado?.motivo_rechazo || 'No hay unidades con estado disponible para el horario solicitado'}
          </div>
          <button style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setPantalla(2)}>Elegir otro horario</button>
        </div>
      )}

    </div>
  )
}