import {
  createPatient,
  createDoctor,
  createAppointment,
  updatePatient,
  updateDoctor,
  updateAppointment,
  deletePatient,
  deleteDoctor,
  deleteAppointment,
  listPatients,
  listDoctors,
  listAppointments,
  listAuditLog,
  getPatientHistory,
  getReminderAppointments,
  exportDataToJSON,
  importDataFromJSON
} from './database.js';

import { formatDate, formatTime, statusBadgeClass, showToast, downloadFile, toCSV } from './utils.js';

const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const appointmentForm = document.getElementById('appointmentForm');
const patientTable = document.getElementById('patientsTable');
const doctorTable = document.getElementById('doctorsTable');
const appointmentTable = document.getElementById('appointmentsTable');
const auditList = document.getElementById('auditList');
const reminders = document.getElementById('reminders');
const patientSelect = document.getElementById('appointmentPatient');
const doctorSelect = document.getElementById('appointmentDoctor');

function refreshDropdowns() {
  const patients = listPatients();
  const doctors = listDoctors();

  const patientOptions = ['<option value="">Seleccione un paciente</option>']
    .concat(patients.map((patient) => `<option value="${patient.id}">${patient.nombre} - ${patient.cedula}</option>`))
    .join('');

  const doctorOptions = ['<option value="">Seleccione un médico</option>']
    .concat(doctors.map((doctor) => `<option value="${doctor.id}">${doctor.nombre} - ${doctor.especialidad}</option>`))
    .join('');

  patientSelect.innerHTML = patientOptions;
  doctorSelect.innerHTML = doctorOptions;
}

function renderPatients() {
  const patients = listPatients();
  patientTable.innerHTML = patients.map((patient) => `
    <tr>
      <td>${patient.nombre}</td>
      <td>${patient.cedula}</td>
      <td>${patient.telefono}</td>
      <td>${patient.email}</td>
      <td>
        <button class="small-button" data-patient-edit="${patient.id}">Editar</button>
        <button class="small-button danger" data-patient-delete="${patient.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function renderDoctors() {
  const doctors = listDoctors();
  doctorTable.innerHTML = doctors.map((doctor) => `
    <tr>
      <td>${doctor.nombre}</td>
      <td>${doctor.numeroColegido}</td>
      <td>${doctor.especialidad}</td>
      <td>${doctor.horarioInicio} - ${doctor.horarioFin}</td>
      <td>
        <button class="small-button" data-doctor-edit="${doctor.id}">Editar</button>
        <button class="small-button danger" data-doctor-delete="${doctor.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function renderAppointments() {
  const appointments = listAppointments();

  appointmentTable.innerHTML = appointments.map((appointment) => {
    const patient = listPatients().find((item) => item.id === appointment.pacienteId);
    const doctor = listDoctors().find((item) => item.id === appointment.medicoId);
    return `
      <tr>
        <td>${patient ? patient.nombre : 'Paciente no encontrado'}</td>
        <td>${doctor ? doctor.nombre : 'Médico no encontrado'}</td>
        <td>${formatDate(appointment.fecha)}</td>
        <td>${formatTime(appointment.hora)}</td>
        <td><span class="status ${statusBadgeClass(appointment.estado)}">${appointment.estado}</span></td>
        <td>
          <button class="small-button" data-appointment-edit="${appointment.id}">Editar</button>
          <button class="small-button danger" data-appointment-delete="${appointment.id}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAuditLog() {
  const items = listAuditLog();
  auditList.innerHTML = items.map((item) => `
    <li>
      <strong>${item.accion}</strong>
      <span>${new Date(item.fecha).toLocaleString('es-ES')}</span>
      <p>${item.detalle}</p>
    </li>
  `).join('');
}

function renderReminders() {
  const appointments = getReminderAppointments();

  if (!appointments.length) {
    reminders.innerHTML = '<div class="reminder-item">No hay recordatorios próximos.</div>';
    return;
  }

  reminders.innerHTML = appointments.map((appointment) => {
    const patient = listPatients().find((item) => item.id === appointment.pacienteId);
    const doctor = listDoctors().find((item) => item.id === appointment.medicoId);
    return `
      <div class="reminder-item">
        <strong>Recordatorio:</strong> ${patient ? patient.nombre : 'Paciente'} con ${doctor ? doctor.nombre : 'médico'} el ${formatDate(appointment.fecha)} a las ${formatTime(appointment.hora)}.
      </div>
    `;
  }).join('');
}

function renderAll() {
  refreshDropdowns();
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderAuditLog();
  renderReminders();
}

patientForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(patientForm).entries());

  try {
    const patientId = document.getElementById('patientId').value;
    if (patientId) {
      updatePatient(patientId, formData);
      showToast('Paciente actualizado correctamente', 'success');
    } else {
      createPatient(formData);
      showToast('Paciente registrado correctamente', 'success');
    }

    patientForm.reset();
    document.getElementById('patientId').value = '';
    document.getElementById('cancelPatientEdit').classList.add('hidden');
    renderAll();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

doctorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(doctorForm).entries());

  try {
    const doctorId = document.getElementById('doctorId').value;
    if (doctorId) {
      updateDoctor(doctorId, formData);
      showToast('Médico actualizado correctamente', 'success');
    } else {
      createDoctor(formData);
      showToast('Médico registrado correctamente', 'success');
    }

    doctorForm.reset();
    document.getElementById('doctorId').value = '';
    document.getElementById('cancelDoctorEdit').classList.add('hidden');
    renderAll();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(appointmentForm).entries());

  try {
    const appointmentId = document.getElementById('appointmentId').value;
    if (appointmentId) {
      updateAppointment(appointmentId, formData);
      showToast('Cita actualizada correctamente', 'success');
    } else {
      createAppointment(formData);
      showToast('Cita creada correctamente', 'success');
    }

    appointmentForm.reset();
    document.getElementById('appointmentId').value = '';
    document.getElementById('cancelAppointmentEdit').classList.add('hidden');
    renderAll();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

patientTable.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-patient-edit]');
  const deleteButton = event.target.closest('[data-patient-delete]');

  if (editButton) {
    const patient = listPatients().find((item) => item.id === editButton.dataset.patientEdit);
    if (!patient) return;

    const fields = new FormData(patientForm);
    const entries = Object.fromEntries(fields.entries());
    document.getElementById('patientId').value = patient.id;
    Object.entries(patient).forEach(([key, value]) => {
      const input = patientForm.elements.namedItem(key);
      if (input) {
        input.value = value;
      }
    });
    document.getElementById('cancelPatientEdit').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (deleteButton) {
    try {
      deletePatient(deleteButton.dataset.patientDelete);
      showToast('Paciente eliminado correctamente', 'success');
      renderAll();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
});

doctorTable.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-doctor-edit]');
  const deleteButton = event.target.closest('[data-doctor-delete]');

  if (editButton) {
    const doctor = listDoctors().find((item) => item.id === editButton.dataset.doctorEdit);
    if (!doctor) return;

    document.getElementById('doctorId').value = doctor.id;
    Object.entries(doctor).forEach(([key, value]) => {
      const input = doctorForm.elements.namedItem(key);
      if (input) {
        input.value = value;
      }
    });
    document.getElementById('cancelDoctorEdit').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (deleteButton) {
    try {
      deleteDoctor(deleteButton.dataset.doctorDelete);
      showToast('Médico eliminado correctamente', 'success');
      renderAll();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
});

appointmentTable.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-appointment-edit]');
  const deleteButton = event.target.closest('[data-appointment-delete]');

  if (editButton) {
    const appointment = listAppointments().find((item) => item.id === editButton.dataset.appointmentEdit);
    if (!appointment) return;

    document.getElementById('appointmentId').value = appointment.id;
    Object.entries(appointment).forEach(([key, value]) => {
      const input = appointmentForm.elements.namedItem(key);
      if (input) {
        input.value = value;
      }
    });
    document.getElementById('cancelAppointmentEdit').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (deleteButton) {
    try {
      deleteAppointment(deleteButton.dataset.appointmentDelete);
      showToast('Cita eliminada correctamente', 'success');
      renderAll();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
});

document.getElementById('cancelPatientEdit').addEventListener('click', () => {
  patientForm.reset();
  document.getElementById('patientId').value = '';
  document.getElementById('cancelPatientEdit').classList.add('hidden');
});

document.getElementById('cancelDoctorEdit').addEventListener('click', () => {
  doctorForm.reset();
  document.getElementById('doctorId').value = '';
  document.getElementById('cancelDoctorEdit').classList.add('hidden');
});

document.getElementById('cancelAppointmentEdit').addEventListener('click', () => {
  appointmentForm.reset();
  document.getElementById('appointmentId').value = '';
  document.getElementById('cancelAppointmentEdit').classList.add('hidden');
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active-view'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.view);
    if (target) {
      target.classList.add('active-view');
    }
  });
});

document.getElementById('exportCsvBtn').addEventListener('click', () => {
  const rows = listAppointments().map((appointment) => ({
    paciente: listPatients().find((item) => item.id === appointment.pacienteId)?.nombre || 'N/A',
    medico: listDoctors().find((item) => item.id === appointment.medicoId)?.nombre || 'N/A',
    fecha: appointment.fecha,
    hora: appointment.hora,
    motivo: appointment.motivo,
    estado: appointment.estado,
    tipoCita: appointment.tipoCita
  }));

  downloadFile('citas.csv', toCSV(rows), 'text/csv;charset=utf-8;');
  showToast('CSV exportado correctamente', 'success');
});

document.getElementById('backupBtn').addEventListener('click', () => {
  const json = exportDataToJSON();
  downloadFile('citas-medicas-backup.json', json, 'application/json;charset=utf-8;');
  showToast('Respaldo JSON exportado', 'success');
});

document.getElementById('restoreInput').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) return;

  file.text().then((content) => {
    try {
      importDataFromJSON(content);
      showToast('Respaldo importado correctamente', 'success');
      renderAll();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      event.target.value = '';
    }
  }).catch((error) => showToast(error.message, 'error'));
});

window.getPatientHistory = getPatientHistory;
renderAll();
