# Práctica 8: Pipeline Verde + URL Viva

## Descripción

Pipeline CI/CD implementado con GitHub Actions para ejecutar tests automatizados en cada push y PR. GitHub Pages configurado para servir la página de prácticas en una URL pública.

## Componentes

### Workflow CI/CD (.github/workflows/ci.yml)

El pipeline ejecuta los siguientes tests:
- **Práctica 4 - Fiados**: Test runner personalizado que valida la lógica de cálculo de mora (5% cuando hay días vencidos)
- **Práctica 4 Citas - Business**: Tests funcionales usando node:test para validar requisitos de gestión de citas médicas

Triggers:
- Push a ramas main y feature/**
- Pull Requests a main

### GitHub Pages

URL pública: https://jiveth-14.github.io/isw2-practicas/

Deploy desde la rama main, sirviendo index.html con links a todas las prácticas.

## Qué corre el pipeline

1. Checkout del código
2. Setup de Node.js 18.x
3. Ejecución de tests de Práctica 4 (fiados)
4. Ejecución de tests de Práctica 4 Citas (business)
5. Report de resultado (pasa/falla)

## Mejoras futuras

- Añadir linting (ESLint) con prettier
- E2E tests para flujos de usuario completos
- Coverage reports (nyc) para medir cobertura de tests
- Notificaciones de fallos en Slack
- Deployment automático a staging en cada PR
