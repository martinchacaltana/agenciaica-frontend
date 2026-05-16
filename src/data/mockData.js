// ─── Personal (Staff) ─────────────────────────────────────────────────────────
export const staff = [
  { id: 1, nombre: 'Roberto Salas',   documento: '10234567', rol: 'admin',    correo: 'roberto.salas@agencia.com',   telefono: '+51 987 001 001', estado: 'activo',   creado: '2023-11-01' },
  { id: 2, nombre: 'Gabriela Torres', documento: '20345678', rol: 'vendedor', correo: 'gabriela.torres@agencia.com', telefono: '+51 987 002 002', estado: 'activo',   creado: '2024-01-10' },
  { id: 3, nombre: 'Miguel Quispe',   documento: '30456789', rol: 'operador', correo: 'miguel.quispe@agencia.com',   telefono: '+51 987 003 003', estado: 'activo',   creado: '2024-01-22' },
  { id: 4, nombre: 'Claudia Vera',    documento: '40567890', rol: 'vendedor', correo: 'claudia.vera@agencia.com',    telefono: '+51 987 004 004', estado: 'activo',   creado: '2024-02-05' },
  { id: 5, nombre: 'Jesús Pacheco',   documento: '50678901', rol: 'operador', correo: 'jesus.pacheco@agencia.com',   telefono: '+51 987 005 005', estado: 'inactivo', creado: '2024-02-18' },
  { id: 6, nombre: 'Patricia Luna',   documento: '60789012', rol: 'vendedor', correo: 'patricia.luna@agencia.com',   telefono: '+51 987 006 006', estado: 'activo',   creado: '2024-03-03' },
  { id: 7, nombre: 'Omar Castillo',   documento: '70890123', rol: 'operador', correo: 'omar.castillo@agencia.com',   telefono: '+51 987 007 007', estado: 'activo',   creado: '2024-03-15' },
  { id: 8, nombre: 'Sandra Flores',   documento: '80901234', rol: 'admin',    correo: 'sandra.flores@agencia.com',   telefono: '+51 987 008 008', estado: 'activo',   creado: '2024-04-01' },
];

// ─── Clientes ────────────────────────────────────────────────────────────────
export const clients = [
  { id: 1, nombre: 'María García',    email: 'maria.garcia@email.com',   telefono: '+51 987 654 321', documento: '12345678', estado: 'activo',   creado: '2024-01-15' },
  { id: 2, nombre: 'Carlos López',    email: 'carlos.lopez@email.com',   telefono: '+51 912 345 678', documento: '87654321', estado: 'activo',   creado: '2024-02-03' },
  { id: 3, nombre: 'Ana Martínez',    email: 'ana.martinez@email.com',   telefono: '+51 934 567 890', documento: '45678901', estado: 'inactivo', creado: '2024-02-18' },
  { id: 4, nombre: 'Luis Fernández',  email: 'luis.fernandez@email.com', telefono: '+51 956 789 012', documento: '23456789', estado: 'activo',   creado: '2024-03-05' },
  { id: 5, nombre: 'Sofia Rodríguez', email: 'sofia.rodriguez@email.com',telefono: '+51 978 901 234', documento: '67890123', estado: 'activo',   creado: '2024-03-20' },
  { id: 6, nombre: 'Diego Hernández', email: 'diego.hernandez@email.com',telefono: '+51 901 234 567', documento: '34567890', estado: 'inactivo', creado: '2024-04-11' },
  { id: 7, nombre: 'Valentina Pérez', email: 'vale.perez@email.com',     telefono: '+51 923 456 789', documento: '89012345', estado: 'activo',   creado: '2024-04-22' },
  { id: 8, nombre: 'Andrés Torres',   email: 'andres.torres@email.com',  telefono: '+51 945 678 901', documento: '56789012', estado: 'activo',   creado: '2024-05-01' },
];

// ─── Paquetes Turísticos (sin cupos — la disponibilidad la manejan las Salidas)
export const packages = [
  { id: 1, destino: 'Huacachina & Buggies',   precio: 180, duracion: 1, descripcion: 'Paseo en tubulares por las dunas y práctica de sandboarding en el Oasis de América.',       categoria: 'Aventura',     imagen: '🏜️', estado: 'activo' },
  { id: 2, destino: 'Reserva de Paracas',      precio: 220, duracion: 1, descripcion: 'Tour por las playas de la Reserva Nacional: Playa Roja, Lagunillas y formaciones rocosas.', categoria: 'Naturaleza',   imagen: '🌊', estado: 'activo' },
  { id: 3, destino: 'Islas Ballestas',         precio: 150, duracion: 1, descripcion: 'Tour en lancha para observar lobos marinos, pingüinos de Humboldt y aves guaneras.',        categoria: 'Naturaleza',   imagen: '🚤', estado: 'activo' },
  { id: 4, destino: 'Sobrevuelo Líneas Nazca', precio: 450, duracion: 1, descripcion: 'Vuelo panorámico sobre los milenarios geoglifos de Nazca desde el aeródromo.',             categoria: 'Arqueológico', imagen: '✈️', estado: 'activo' },
  { id: 5, destino: 'Viñedos y Bodegas',       precio: 120, duracion: 1, descripcion: 'Recorrido por las principales bodegas vitivinícolas de Ica con cata de vinos y piscos.',   categoria: 'Cultural',     imagen: '🍷', estado: 'activo' },
  { id: 6, destino: 'Cañón de los Perdidos',   precio: 280, duracion: 1, descripcion: 'Expedición al impresionante cañón ubicado en el desierto de Ocucaje. Paisajes irreales.',  categoria: 'Aventura',     imagen: '🌵', estado: 'activo' },
];

// ─── Salidas (instancias programadas de cada paquete) ─────────────────────────
export const salidas = [
  { id: 'SAL-001', paqueteId: 1, fecha: '2024-06-15', hora: '08:00', cuposTotales: 20, cuposOcupados: 18, estado: 'activa'     },
  { id: 'SAL-002', paqueteId: 2, fecha: '2024-06-20', hora: '07:30', cuposTotales: 15, cuposOcupados: 15, estado: 'activa'     },
  { id: 'SAL-003', paqueteId: 3, fecha: '2024-06-22', hora: '09:00', cuposTotales: 30, cuposOcupados: 8,  estado: 'activa'     },
  { id: 'SAL-004', paqueteId: 4, fecha: '2024-07-01', hora: '06:00', cuposTotales: 10, cuposOcupados: 3,  estado: 'programada' },
  { id: 'SAL-005', paqueteId: 1, fecha: '2024-07-10', hora: '08:00', cuposTotales: 20, cuposOcupados: 20, estado: 'activa'     },
  { id: 'SAL-006', paqueteId: 5, fecha: '2024-07-15', hora: '10:00', cuposTotales: 25, cuposOcupados: 5,  estado: 'programada' },
  { id: 'SAL-007', paqueteId: 6, fecha: '2024-06-25', hora: '07:00', cuposTotales: 18, cuposOcupados: 16, estado: 'activa'     },
  { id: 'SAL-008', paqueteId: 3, fecha: '2024-05-30', hora: '09:00', cuposTotales: 30, cuposOcupados: 30, estado: 'completada' },
];

// ─── Reservas ────────────────────────────────────────────────────────────────
export const reservations = [
  { id: 'RES-001', clienteId: 1, paqueteId: 1, salidaId: 'SAL-001', fecha: '2024-05-10', fechaViaje: '2024-06-15', estado: 'confirmado', personas: 2, total: 360 },
  { id: 'RES-002', clienteId: 2, paqueteId: 3, salidaId: 'SAL-003', fecha: '2024-05-12', fechaViaje: '2024-06-22', estado: 'pendiente',  personas: 4, total: 600 },
  { id: 'RES-003', clienteId: 5, paqueteId: 4, salidaId: 'SAL-004', fecha: '2024-05-14', fechaViaje: '2024-07-01', estado: 'confirmado', personas: 1, total: 450 },
  { id: 'RES-004', clienteId: 3, paqueteId: 2, salidaId: 'SAL-002', fecha: '2024-05-16', fechaViaje: '2024-06-20', estado: 'cancelado',  personas: 2, total: 440 },
  { id: 'RES-005', clienteId: 7, paqueteId: 1, salidaId: 'SAL-005', fecha: '2024-05-18', fechaViaje: '2024-07-10', estado: 'pendiente',  personas: 3, total: 540 },
  { id: 'RES-006', clienteId: 4, paqueteId: 6, salidaId: 'SAL-007', fecha: '2024-05-20', fechaViaje: '2024-06-25', estado: 'confirmado', personas: 2, total: 560 },
  { id: 'RES-007', clienteId: 8, paqueteId: 3, salidaId: 'SAL-003', fecha: '2024-05-22', fechaViaje: '2024-06-22', estado: 'confirmado', personas: 5, total: 750 },
  { id: 'RES-008', clienteId: 6, paqueteId: 5, salidaId: 'SAL-006', fecha: '2024-05-24', fechaViaje: '2024-07-15', estado: 'cancelado',  personas: 2, total: 240 },
];

// ─── Pagos ───────────────────────────────────────────────────────────────────
export const payments = [
  { id: 'PAY-001', reservaId: 'RES-001', clienteId: 1, monto: 360, metodo: 'tarjeta',      estado: 'pagado',      fecha: '2024-05-10', referencia: 'TXN-8821' },
  { id: 'PAY-002', reservaId: 'RES-002', clienteId: 2, monto: 600, metodo: 'transferencia', estado: 'pendiente',   fecha: '2024-05-12', referencia: 'TXN-8822' },
  { id: 'PAY-003', reservaId: 'RES-003', clienteId: 5, monto: 450, metodo: 'efectivo',     estado: 'pagado',      fecha: '2024-05-14', referencia: 'TXN-8823' },
  { id: 'PAY-004', reservaId: 'RES-004', clienteId: 3, monto: 440, metodo: 'tarjeta',      estado: 'reembolsado', fecha: '2024-05-16', referencia: 'TXN-8824' },
  { id: 'PAY-005', reservaId: 'RES-005', clienteId: 7, monto: 270, metodo: 'tarjeta',      estado: 'pendiente',   fecha: '2024-05-18', referencia: 'TXN-8825' },
  { id: 'PAY-006', reservaId: 'RES-006', clienteId: 4, monto: 560, metodo: 'transferencia', estado: 'pagado',      fecha: '2024-05-20', referencia: 'TXN-8826' },
  { id: 'PAY-007', reservaId: 'RES-007', clienteId: 8, monto: 750, metodo: 'efectivo',     estado: 'pagado',      fecha: '2024-05-22', referencia: 'TXN-8827' },
  { id: 'PAY-008', reservaId: 'RES-008', clienteId: 6, monto: 240, metodo: 'tarjeta',      estado: 'reembolsado', fecha: '2024-05-24', referencia: 'TXN-8828' },
];

// ─── Estadísticas mensuales ───────────────────────────────────────────────────
export const monthlyStats = [
  { mes: 'Ene', ingresos: 18400, reservas: 14 },
  { mes: 'Feb', ingresos: 22100, reservas: 18 },
  { mes: 'Mar', ingresos: 19800, reservas: 16 },
  { mes: 'Abr', ingresos: 28500, reservas: 24 },
  { mes: 'May', ingresos: 31200, reservas: 27 },
  { mes: 'Jun', ingresos: 26700, reservas: 22 },
  { mes: 'Jul', ingresos: 34100, reservas: 30 },
  { mes: 'Ago', ingresos: 29400, reservas: 26 },
  { mes: 'Sep', ingresos: 23800, reservas: 20 },
  { mes: 'Oct', ingresos: 31500, reservas: 28 },
  { mes: 'Nov', ingresos: 38200, reservas: 34 },
  { mes: 'Dic', ingresos: 42100, reservas: 38 },
];

// ─── Destinos populares ───────────────────────────────────────────────────────
export const destinoStats = [
  { destino: 'Huacachina',      reservas: 58 },
  { destino: 'Islas Ballestas', reservas: 42 },
  { destino: 'Reserva Paracas', reservas: 36 },
  { destino: 'Líneas Nazca',    reservas: 24 },
  { destino: 'Bodegas Ica',     reservas: 19 },
  { destino: 'C. Perdidos',     reservas: 12 },
];

// ─── Comprobantes ─────────────────────────────────────────────────────────────
export const vouchers = [
  { id: 'VOU-001', tipo: 'boleta',      numero: 'B001-000001',  clienteId: 1, fecha: '2024-05-10', total: 360, detalle: 'Tour Huacachina & Buggies (2 pax)',        estado: 'emitido' },
  { id: 'VOU-002', tipo: 'factura',     numero: 'F001-000001',  clienteId: 2, fecha: '2024-05-12', total: 600, detalle: 'Full Day Islas Ballestas (4 pax)',          estado: 'emitido' },
  { id: 'VOU-003', tipo: 'nota_credito',numero: 'NC01-000001',  clienteId: 3, fecha: '2024-05-16', total: 450, detalle: 'Anulación Sobrevuelo Líneas Nazca',         estado: 'emitido' },
  { id: 'VOU-004', tipo: 'factura',     numero: 'F001-000002',  clienteId: 5, fecha: '2024-05-14', total: 280, detalle: 'Expedición Cañón de los Perdidos',          estado: 'emitido' },
  { id: 'VOU-005', tipo: 'boleta',      numero: 'B001-000002',  clienteId: 8, fecha: '2024-05-22', total: 600, detalle: 'Tour Viñedos y Bodegas (5 pax)',            estado: 'emitido' },
];
