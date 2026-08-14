import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resetState,
  createPatient,
  createDoctor,
  createAppointment,
  filterAppointments,
  getPatientHistory,
  createAuditLog
} from '../database.js';

const buildPatient = (cedula = '12345678') => ({
  nombre: 'Ana López',
  cedula,
  fechaNacimiento: '1990-05-14',
  genero: 'Femenino',
  telefono: '987654321',
  email: 'ana@example.com',
  direccion: 'Calle Falsa 123'
});

const buildDoctor = (numero = 'MED-100') => ({
  nombre: 'Dr. Carlos Ruiz',
  numeroColegido: numero,
  especialidad: 'Cardiología',
  telefono: '912345678',
  email: 'carlos@clinica.com',
  horarioInicio: '08:00',
  horarioFin: '12:00'
});

const buildAppointment = ({ pacienteId, medicoId, fecha = '2026-08-20', hora = '09:00' }) => ({
  pacienteId,
  medicoId,
  fecha,
  hora,
  motivo: 'Control general',
  tipoCita: 'presencial',
  estado: 'agendada',
  notas: 'Revisión anual'
});

test('RF1.5: no permite duplicar pacientes por cédula', () => {
  resetState();

  createPatient(buildPatient('11111111'));

  assert.throws(() => createPatient(buildPatient('11111111')), /ya existe/i);
});

test('RF3.2: no permite citas duplicadas para el mismo médico en la misma fecha y hora', () => {
  resetState();

  const paciente = createPatient(buildPatient('22222222'));
  const medico = createDoctor(buildDoctor('MED-200'));

  createAppointment(buildAppointment({ pacienteId: paciente.id, medicoId: medico.id }));

  assert.throws(
    () => createAppointment(buildAppointment({ pacienteId: paciente.id, medicoId: medico.id })),
    /ya existe una cita/i
  );
});

test('RF3.7: filtra citas por estado, paciente y médico', () => {
  resetState();

  const pacienteA = createPatient(buildPatient('33333333'));
  const pacienteB = createPatient(buildPatient('44444444'));
  const medicoA = createDoctor(buildDoctor('MED-300'));
  const medicoB = createDoctor(buildDoctor('MED-400'));

  createAppointment({ ...buildAppointment({ pacienteId: pacienteA.id, medicoId: medicoA.id, fecha: '2026-09-10', hora: '10:00' }), estado: 'agendada' });
  createAppointment({ ...buildAppointment({ pacienteId: pacienteA.id, medicoId: medicoB.id, fecha: '2026-09-10', hora: '11:00' }), estado: 'completada' });
  createAppointment({ ...buildAppointment({ pacienteId: pacienteB.id, medicoId: medicoA.id, fecha: '2026-09-11', hora: '09:00' }), estado: 'cancelada' });

  const result = filterAppointments({ pacienteId: pacienteA.id, estado: 'agendada' });

  assert.equal(result.length, 1);
  assert.equal(result[0].medicoId, medicoA.id);
});

test('RF4.1: guarda el historial de citas de cada paciente', () => {
  resetState();

  const paciente = createPatient(buildPatient('55555555'));
  const medico = createDoctor(buildDoctor('MED-500'));

  createAppointment({ ...buildAppointment({ pacienteId: paciente.id, medicoId: medico.id, fecha: '2026-09-15', hora: '08:30' }), estado: 'agendada' });

  const history = getPatientHistory(paciente.id);

  assert.equal(history.length, 1);
  assert.equal(history[0].motivo, 'Control general');
});

test('RF4.4: registra auditoría de cambios', () => {
  resetState();

  const paciente = createPatient(buildPatient('66666666'));
  const audit = createAuditLog('paciente_creado', paciente.id, 'Registro inicial');

  assert.equal(audit.entidad, 'paciente');
  assert.equal(audit.accion, 'paciente_creado');
  assert.match(audit.detalle, /Registro inicial/i);
});
