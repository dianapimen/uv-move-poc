
CREATE TABLE usuarios (
    id_usuario VARCHAR(50) NOT NULL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado_cuenta VARCHAR(20) NOT NULL CHECK (estado_cuenta IN ('activa', 'inactiva'))
);

CREATE TABLE viajes (
    id_viaje INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario VARCHAR(50) NOT NULL,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    estado_viaje VARCHAR(20) NOT NULL CHECK (estado_viaje IN ('pendiente', 'confirmado', 'rechazado')),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE vehiculos (
    id_vehiculo VARCHAR(20) NOT NULL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'mantenimiento')),
    ubicacion_actual VARCHAR(100) NOT NULL
);

CREATE TABLE asignaciones (
    id_asignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_viaje INT NOT NULL,
    id_vehiculo VARCHAR(20),
    resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('aceptado', 'rechazado')),
    motivo_rechazo VARCHAR(255),
    FOREIGN KEY (id_viaje) REFERENCES viajes(id_viaje),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);

INSERT INTO usuarios (id_usuario, nombre, estado_cuenta) VALUES ('S24001928', 'Diana', 'activa');
INSERT INTO vehiculos (id_vehiculo, tipo, estado, ubicacion_actual) VALUES ('VH-014', 'Bicicleta', 'disponible', 'Estacionamiento central');