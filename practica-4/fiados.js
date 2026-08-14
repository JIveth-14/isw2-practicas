// Calcula el 5% de mora sobre el monto si está vencido
function calcularMora(monto, diasVencidos) {
  if (typeof diasVencidos !== "number") {
    throw new Error("diasVencidos debe ser un número");
  }
  if (monto < 0) {
    throw new Error("monto no puede ser negativo");
  }
  return diasVencidos > 0 ? monto * 0.05 : 0;
}

module.exports = { calcularMora };