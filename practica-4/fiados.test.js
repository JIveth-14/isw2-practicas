// ---------------------------------------------------------------------------
// Mini test runner — sin frameworks, JS puro
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

function test(nombre, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${nombre}`);
  } catch (e) {
    failed++;
    console.log(`  ❌ ${nombre} — ${e.message}`);
  }
}

function assertEqual(actual, esperado) {
  if (actual !== esperado) {
    throw new Error(`Se esperaba ${esperado}, pero se obtuvo ${actual}`);
  }
}

// ---------------------------------------------------------------------------
// Tests para calcularMora
// ---------------------------------------------------------------------------
const { calcularMora } = require("./fiados.js");

// --- Camino feliz ----------------------------------------------------------
test("Monto 100, 5 días vencidos → 5 (5%)", () => {
  assertEqual(calcularMora(100, 5), 5);
});

test("Monto 200, 1 día vencido → 10 (5%)", () => {
  assertEqual(calcularMora(200, 1), 10);
});

// --- Casos borde -----------------------------------------------------------
test("Monto 100, 0 días vencidos → 0", () => {
  assertEqual(calcularMora(100, 0), 0);
});

test("Monto 0, 5 días vencidos → 0", () => {
  assertEqual(calcularMora(0, 5), 0);
});

// --- Más casos borde -------------------------------------------------------
test("Monto con decimales, vencido → 5% exacto", () => {
  assertEqual(calcularMora(150.5, 3), 7.525);
});

test("diasVencidos null lanza error", () => {
  let error = false;
  try {
    calcularMora(100, null);
  } catch (e) {
    error = true;
  }
  if (!error) throw new Error("Debió lanzar error para diasVencidos null");
});

// --- Fase RED: casos que deben lanzar error --------------------------------
test("Monto negativo lanza error", () => {
  let error = false;
  try {
    calcularMora(-100, 5);
  } catch (e) {
    error = true;
  }
  if (!error) throw new Error("Debió lanzar error para monto negativo");
});

test("Días no numérico lanza error", () => {
  let error = false;
  try {
    calcularMora(100, "abc");
  } catch (e) {
    error = true;
  }
  if (!error) throw new Error("Debió lanzar error para días no numéricos");
});

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------
console.log(`\n${passed} pasaron, ${failed} fallaron de ${passed + failed} tests`);
process.exit(failed > 0 ? 1 : 0);