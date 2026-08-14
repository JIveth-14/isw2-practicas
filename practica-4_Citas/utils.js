export function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatTime(value) {
  if (!value) return 'Sin hora';
  return value;
}

export function statusBadgeClass(status) {
  const map = {
    agendada: 'status-scheduled',
    completada: 'status-completed',
    cancelada: 'status-cancelled'
  };
  return map[status] || 'status-default';
}

export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
  }, 50);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

export function toCSV(rows) {
  if (!rows.length) {
    return 'No hay datos para exportar';
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((header) => {
      const value = row[header] ?? '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    lines.push(values.join(','));
  }

  return lines.join('\n');
}
