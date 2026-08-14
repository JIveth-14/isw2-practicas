const STORAGE_KEY = 'citas-medicas-v1';

const defaultState = {
  patients: [],
  doctors: [],
  appointments: [],
  auditLog: []
};

const storageAdapter = {
  _data: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null;
  },
  setItem(key, value) {
    this._data[key] = String(value);
  },
  removeItem(key) {
    delete this._data[key];
  }
};

function getStorage() {
  if (typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage;
  }
  return storageAdapter;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadState() {
  const raw = getStorage().getItem(STORAGE_KEY);

  if (!raw) {
    return cloneData(defaultState);
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      patients: Array.isArray(parsed.patients) ? parsed.patients : [],
      doctors: Array.isArray(parsed.doctors) ? parsed.doctors : [],
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : []
    };
  } catch (error) {
    return cloneData(defaultState);
  }
}

export function saveState(state) {
  getStorage().setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function resetState() {
  const state = cloneData(defaultState);
  saveState(state);
  return state;
}

function createId(prefix = 'id') {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createAuditLog(action, entityId, detail = '') {
  const state = loadState();
  const entity = action.startsWith('paciente')
    ? 'paciente'
    : action.startsWith('medico')
      ? 'medico'
      : action.startsWith('cita')
        ? 'cita'
        : 'sistema';

  const entry = {
    id: createId('audit'),
    accion: action,
    entidad: entity,
    entidadId: entityId || null,
    detalle: detail,
    fecha: new Date().toISOString()
  };

  state.auditLog.unshift(entry);
  saveState(state);
  return entry;
}

export function createPatient(patientData) {
  const state = loadState();
  const cedula = String(patientData.cedula || '').trim();

  if (state.patients.some((patient) => patient.cedula.toLowerCase() === cedula.toLowerCase())) {
    throw new Error('Ya existe un paciente registrado con esa cédula.');
  }

  const patient = {
    id: createId('patient'),
    nombre: String(patientData.nombre || '').trim(),
    cedula,
    fechaNacimiento: patientData.fechaNacimiento || '',
    genero: patientData.genero || 'No especificado',
    telefono: String(patientData.telefono || '').trim(),
    email: String(patientData.email || '').trim(),
    direccion: String(patientData.direccion || '').trim(),
    fechaRegistro: new Date().toISOString()
  };

  state.patients.push(patient);
  saveState(state);
  createAuditLog('paciente_creado', patient.id, `Paciente ${patient.nombre} registrado.`);
  return patient;
}

export function listPatients() {
  return loadState().patients.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function updatePatient(id, patientData) {
  const state = loadState();
  const index = state.patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    throw new Error('No se encontró el paciente solicitado.');
  }

  const duplicate = state.patients.find((patient) =>
    patient.id !== id && patient.cedula.toLowerCase() === String(patientData.cedula || '').trim().toLowerCase()
  );

  if (duplicate) {
    throw new Error('Ya existe un paciente con esa cédula.');
  }

  const patient = {
    ...state.patients[index],
    ...patientData,
    id,
    cedula: String(patientData.cedula || '').trim(),
    nombre: String(patientData.nombre || '').trim(),
    telefono: String(patientData.telefono || '').trim(),
    email: String(patientData.email || '').trim(),
    direccion: String(patientData.direccion || '').trim()
  };

  state.patients[index] = patient;
  saveState(state);
  createAuditLog('paciente_actualizado', patient.id, `Paciente ${patient.nombre} actualizado.`);
  return patient;
}

export function deletePatient(id) {
  const state = loadState();
  const patient = state.patients.find((item) => item.id === id);

  if (!patient) {
    throw new Error('El paciente no existe.');
  }

  state.patients = state.patients.filter((item) => item.id !== id);
  state.appointments = state.appointments.filter((appointment) => appointment.pacienteId !== id);
  saveState(state);
  createAuditLog('paciente_eliminado', id, `Paciente ${patient.nombre} eliminado.`);
  return true;
}

export function createDoctor(doctorData) {
  const state = loadState();
  const numero = String(doctorData.numeroColegido || '').trim();

  if (state.doctors.some((doctor) => doctor.numeroColegido.toLowerCase() === numero.toLowerCase())) {
    throw new Error('Ya existe un médico con ese número de colegiado.');
  }

  const doctor = {
    id: createId('doctor'),
    nombre: String(doctorData.nombre || '').trim(),
    numeroColegido: numero,
    especialidad: doctorData.especialidad || 'General',
    telefono: String(doctorData.telefono || '').trim(),
    email: String(doctorData.email || '').trim(),
    horarioInicio: doctorData.horarioInicio || '08:00',
    horarioFin: doctorData.horarioFin || '17:00'
  };

  state.doctors.push(doctor);
  saveState(state);
  createAuditLog('medico_creado', doctor.id, `Médico ${doctor.nombre} registrado.`);
  return doctor;
}

export function listDoctors() {
  return loadState().doctors.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function updateDoctor(id, doctorData) {
  const state = loadState();
  const index = state.doctors.findIndex((doctor) => doctor.id === id);

  if (index === -1) {
    throw new Error('No se encontró el médico solicitado.');
  }

  const duplicate = state.doctors.find((doctor) =>
    doctor.id !== id && doctor.numeroColegido.toLowerCase() === String(doctorData.numeroColegido || '').trim().toLowerCase()
  );

  if (duplicate) {
    throw new Error('Ya existe un médico con ese número de colegiado.');
  }

  const doctor = {
    ...state.doctors[index],
    ...doctorData,
    id,
    nombre: String(doctorData.nombre || '').trim(),
    numeroColegido: String(doctorData.numeroColegido || '').trim(),
    telefono: String(doctorData.telefono || '').trim(),
    email: String(doctorData.email || '').trim()
  };

  state.doctors[index] = doctor;
  saveState(state);
  createAuditLog('medico_actualizado', doctor.id, `Médico ${doctor.nombre} actualizado.`);
  return doctor;
}

export function deleteDoctor(id) {
  const state = loadState();
  const doctor = state.doctors.find((item) => item.id === id);

  if (!doctor) {
    throw new Error('El médico no existe.');
  }

  state.doctors = state.doctors.filter((item) => item.id !== id);
  state.appointments = state.appointments.filter((appointment) => appointment.medicoId !== id);
  saveState(state);
  createAuditLog('medico_eliminado', id, `Médico ${doctor.nombre} eliminado.`);
  return true;
}

export function listAppointments() {
  return loadState().appointments.slice().sort((a, b) => {
    const date = (a.fecha || '').localeCompare(b.fecha || '');
    if (date !== 0) {
      return date;
    }
    return (a.hora || '').localeCompare(b.hora || '');
  });
}

export function createAppointment(appointmentData) {
  const state = loadState();

  const required = ['pacienteId', 'medicoId', 'fecha', 'hora', 'motivo'];
  for (const field of required) {
    if (!appointmentData[field]) {
      throw new Error('Todos los campos obligatorios de la cita deben completarse.');
    }
  }

  const duplicate = state.appointments.some((appointment) =>
    appointment.medicoId === appointmentData.medicoId &&
    appointment.fecha === appointmentData.fecha &&
    appointment.hora === appointmentData.hora
  );

  if (duplicate) {
    throw new Error('Ya existe una cita agendada para ese médico en la misma fecha y hora.');
  }

  const appointment = {
    id: createId('appointment'),
    pacienteId: appointmentData.pacienteId,
    medicoId: appointmentData.medicoId,
    fecha: appointmentData.fecha,
    hora: appointmentData.hora,
    motivo: String(appointmentData.motivo || '').trim(),
    tipoCita: appointmentData.tipoCita || 'presencial',
    estado: appointmentData.estado || 'agendada',
    notas: String(appointmentData.notas || '').trim(),
    fechaCreacion: new Date().toISOString()
  };

  state.appointments.push(appointment);
  saveState(state);
  createAuditLog('cita_creada', appointment.id, `Cita programada para ${appointment.fecha} ${appointment.hora}.`);
  return appointment;
}

export function updateAppointment(id, appointmentData) {
  const state = loadState();
  const index = state.appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) {
    throw new Error('La cita no existe.');
  }

  const duplicate = state.appointments.some((appointment) =>
    appointment.id !== id &&
    appointment.medicoId === appointmentData.medicoId &&
    appointment.fecha === appointmentData.fecha &&
    appointment.hora === appointmentData.hora
  );

  if (duplicate) {
    throw new Error('Ya existe una cita agendada para ese médico en la misma fecha y hora.');
  }

  const appointment = {
    ...state.appointments[index],
    ...appointmentData,
    id,
    motivo: String(appointmentData.motivo || '').trim(),
    notas: String(appointmentData.notas || '').trim(),
    tipoCita: appointmentData.tipoCita || 'presencial',
    estado: appointmentData.estado || 'agendada'
  };

  state.appointments[index] = appointment;
  saveState(state);
  createAuditLog('cita_actualizada', appointment.id, `Cita actualizada para ${appointment.fecha} ${appointment.hora}.`);
  return appointment;
}

export function deleteAppointment(id) {
  const state = loadState();
  const appointment = state.appointments.find((item) => item.id === id);

  if (!appointment) {
    throw new Error('La cita no existe.');
  }

  state.appointments = state.appointments.filter((item) => item.id !== id);
  saveState(state);
  createAuditLog('cita_eliminada', id, `Cita ${appointment.fecha} ${appointment.hora} eliminada.`);
  return true;
}

export function filterAppointments(filters = {}) {
  const state = loadState();

  return state.appointments
    .filter((appointment) => {
      if (filters.pacienteId && appointment.pacienteId !== filters.pacienteId) {
        return false;
      }
      if (filters.medicoId && appointment.medicoId !== filters.medicoId) {
        return false;
      }
      if (filters.fecha && appointment.fecha !== filters.fecha) {
        return false;
      }
      if (filters.estado && appointment.estado !== filters.estado) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const date = (a.fecha || '').localeCompare(b.fecha || '');
      if (date !== 0) {
        return date;
      }
      return (a.hora || '').localeCompare(b.hora || '');
    });
}

export function getPatientHistory(patientId) {
  return filterAppointments({ pacienteId: patientId }).slice();
}

export function exportDataToJSON() {
  return JSON.stringify(loadState(), null, 2);
}

export function importDataFromJSON(jsonString) {
  const parsed = JSON.parse(jsonString);
  const next = {
    patients: Array.isArray(parsed.patients) ? parsed.patients : [],
    doctors: Array.isArray(parsed.doctors) ? parsed.doctors : [],
    appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
    auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : []
  };

  saveState(next);
  createAuditLog('datos_importados', null, 'Se restauró la copia de seguridad.');
  return next;
}

export function listAuditLog() {
  return loadState().auditLog.slice(0, 10);
}

export function getReminderAppointments() {
  const today = new Date();
  const tommorow = new Date(today);
  tommorow.setDate(today.getDate() + 1);

  return listAppointments().filter((appointment) => {
    const appointmentDate = new Date(`${appointment.fecha}T${appointment.hora}:00`);
    const diff = appointmentDate.getTime() - today.getTime();
    return appointment.estado === 'agendada' && diff >= 0 && diff <= 86400000 * 2;
  });
}
