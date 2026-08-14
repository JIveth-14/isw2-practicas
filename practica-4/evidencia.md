# Evidencia — Tests `calcularMora`

## Salida de `node fiados.test.js`

```
  ✅ Monto 100, 5 días vencidos → 5 (5%)
  ✅ Monto 200, 1 día vencido → 10 (5%)
  ✅ Monto 100, 0 días vencidos → 0
  ✅ Monto 0, 5 días vencidos → 0
  ✅ Monto con decimales, vencido → 5% exacto
  ✅ diasVencidos null lanza error
  ✅ Monto negativo lanza error
  ✅ Días no numérico lanza error

8 pasaron, 0 fallaron de 8 tests
```

**Resultado:** 8/8 tests pasan ✅
**Runner:** Mini test runner casero (sin frameworks)