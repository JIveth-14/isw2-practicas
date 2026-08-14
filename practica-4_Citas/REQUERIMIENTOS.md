# Requerimientos - Sistema de Gestión de Citas Médicas

## Descripción General
Aplicación web standalone en HTML, CSS y JavaScript para gestionar citas médicas. La aplicación debe permitir crear, visualizar, editar y eliminar citas, así como gestionar pacientes y médicos.

---

## 1. Requerimientos Funcionales

### 1.1 Gestión de Pacientes
- **RF1.1**: El sistema debe permitir registrar nuevos pacientes con los siguientes datos:
  - Nombre completo
  - Cédula/Número de identificación
  - Fecha de nacimiento
  - Género
  - Teléfono
  - Email
  - Dirección
- **RF1.2**: El sistema debe permitir visualizar el listado de todos los pacientes registrados
- **RF1.3**: El sistema debe permitir editar la información de un paciente existente
- **RF1.4**: El sistema debe permitir eliminar un paciente del sistema
- **RF1.5**: El sistema debe validar que no existan pacientes duplicados (por cédula)

### 1.2 Gestión de Médicos
- **RF2.1**: El sistema debe permitir registrar médicos con los siguientes datos:
  - Nombre completo
  - Número de colegiado
  - Especialidad
  - Teléfono
  - Email
  - Horario de atención
- **RF2.2**: El sistema debe permitir visualizar el listado de todos los médicos registrados
- **RF2.3**: El sistema debe permitir editar la información de un médico
- **RF2.4**: El sistema debe permitir eliminar un médico del sistema

### 1.3 Gestión de Citas Médicas
- **RF3.1**: El sistema debe permitir agendar una nueva cita con los siguientes datos:
  - Paciente (seleccionar de lista)
  - Médico (seleccionar de lista)
  - Fecha de la cita
  - Hora de la cita
  - Motivo de la consulta
  - Tipo de consulta (presencial/virtual)
- **RF3.2**: El sistema debe validar que no existan citas duplicadas en la misma hora para el mismo médico
- **RF3.3**: El sistema debe permitir visualizar el calendario de citas
- **RF3.4**: El sistema debe permitir visualizar todas las citas agendadas en formato de listado
- **RF3.5**: El sistema debe permitir editar una cita existente
- **RF3.6**: El sistema debe permitir cancelar/eliminar una cita
- **RF3.7**: El sistema debe filtrar citas por:
  - Paciente
  - Médico
  - Fecha
  - Estado (agendada, completada, cancelada)

### 1.4 Funcionalidades Adicionales
- **RF4.1**: El sistema debe mantener un registro del historial de citas de cada paciente
- **RF4.2**: El sistema debe generar recordatorios de citas (notificaciones visuales)
- **RF4.3**: El sistema debe permitir exportar el listado de citas en formato PDF o CSV
- **RF4.4**: El sistema debe mantener un log de auditoría de cambios realizados

---

## 2. Requerimientos No Funcionales

### 2.1 Rendimiento
- **RNF1.1**: La aplicación debe cargar en menos de 2 segundos
- **RNF1.2**: Las operaciones CRUD deben ejecutarse en menos de 500ms
- **RNF1.3**: La búsqueda de pacientes/médicos debe ser instantánea (< 100ms)

### 2.2 Almacenamiento
- **RNF2.1**: Los datos deben persistir usando localStorage del navegador
- **RNF2.2**: La aplicación debe permitir backup y restauración de datos (exportar/importar JSON)

### 2.3 Seguridad
- **RNF3.1**: La aplicación debe validar todos los datos de entrada
- **RNF3.2**: No debe haber acceso a datos sin autenticación (opcional para versión inicial)
- **RNF3.3**: Los datos sensibles no deben exponerse en logs o consola

### 2.4 Usabilidad
- **RNF4.1**: Interfaz intuitiva y responsive (mobile-friendly)
- **RNF4.2**: Mensajes de error y éxito claros y en español
- **RNF4.3**: Navegación fácil entre secciones

### 2.5 Compatibilidad
- **RNF5.1**: Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- **RNF5.2**: No requiere dependencias externas (standalone)

---

## 3. Estructura Técnica

### 3.1 Tecnologías
- **Frontend**: HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Almacenamiento**: LocalStorage
- **Formatos de datos**: JSON

### 3.2 Componentes principales
- **index.html**: Página principal con estructura HTML
- **styles.css**: Estilos de la aplicación
- **app.js**: Lógica principal de la aplicación
- **database.js**: Gestión de datos (CRUD)
- **utils.js**: Funciones auxiliares y utilidades
- **calendar.js**: Gestión del calendario de citas (opcional)

### 3.3 Estructura de datos

#### Paciente
```json
{
  "id": "UUID",
  "nombre": "string",
  "cedula": "string",
  "fechaNacimiento": "date",
  "genero": "string",
  "telefono": "string",
  "email": "string",
  "direccion": "string",
  "fechaRegistro": "date"
}
```

#### Médico
```json
{
  "id": "UUID",
  "nombre": "string",
  "numeroColegido": "string",
  "especialidad": "string",
  "telefono": "string",
  "email": "string",
  "horarioInicio": "time",
  "horarioFin": "time"
}
```

#### Cita
```json
{
  "id": "UUID",
  "pacienteId": "UUID",
  "medicoId": "UUID",
  "fecha": "date",
  "hora": "time",
  "motivo": "string",
  "tipoCita": "presencial|virtual",
  "estado": "agendada|completada|cancelada",
  "notas": "string",
  "fechaCreacion": "date"
}
```

---

## 4. Criterios de Aceptación

- [ ] La aplicación es completamente funcional en una sola página HTML
- [ ] Todos los CRUD operan correctamente
- [ ] Los datos persisten entre sesiones
- [ ] No hay errores en la consola del navegador
- [ ] La interfaz es intuitiva y responsiva
- [ ] Se valida la entrada de datos correctamente
- [ ] Se manejan adecuadamente los casos de error

---

## 5. Notas Adicionales

- Esta es una versión inicial. Las futuras versiones podrían incluir:
  - Autenticación y roles de usuario
  - Base de datos backend
  - Notificaciones por email/SMS
  - Integración con calendarios externos
  - API REST
  - Reportes avanzados

---

**Versión**: 1.0  
**Fecha de creación**: 2026-08-13  
**Autor**: Jessica Iveth Paz Dubón
