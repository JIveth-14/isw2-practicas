# Práctica 8: Pipeline Verde + URL Viva

## Criterios de éxito - Completados

- [x] Workflow CI/CD en .github/workflows/ci.yml
- [x] Run verde visible en GitHub Actions
- [x] URL pública respondiendo (GitHub Pages)
- [x] Branch protection activo en main
- [x] Pull request mergeado exitosamente

## URLs Públicas

**GitHub Pages (Portfolio de prácticas):**
https://jiveth-14.github.io/isw2-practicas/

**Workflow CI/CD:**
https://github.com/JIveth-14/isw2-practicas/actions/workflows/ci.yml

**Run Verde más reciente:**
https://github.com/JIveth-14/isw2-practicas/actions/runs/34918377334

## Workflow CI/CD (.github/workflows/ci.yml)

Ejecuta en cada push y PR a main:

```
Triggers: push (main, feature/**) | pull_request (main)
Node.js: 18.x
Tests:
  - practica-4/fiados.test.js (cálculo de mora - TDD)
  - practica-4_Citas/tests/business.test.js (gestión de citas médicas)
```

Estado actual: **VERDE** ✓

## Branch Protection (main)

Configuración:
- Require status checks: CI workflow debe pasar
- Strict mode: Requiere que PR esté actualizado con main
- Enforce for admins: Deshabilitado

El repo se defiende automáticamente: ningún código llega a main sin que el pipeline pase.

## GitHub Pages

- Source: Deploy from branch (main, root directory)
- Status: Active
- URL: https://jiveth-14.github.io/isw2-practicas/
- Content: index.html con portfolio de 6 prácticas

## Qué corre el pipeline

1. Checkout del código
2. Setup Node.js 18.x
3. Ejecutar practica-4/fiados.test.js (8 tests)
4. Ejecutar practica-4_Citas/tests/business.test.js (5 tests)
5. Report final (pase/falle)

Tiempo típico: ~10 segundos por run

## Mejoras futuras posibles

- Linting (ESLint) + formato (Prettier)
- Coverage reports (nyc) para cobertura de código
- E2E tests para flujos completos
- Notificaciones en Slack de fallos
- Deployment automático a staging/preview en cada PR
- Performance benchmarks
- Security scanning (dependencies)
