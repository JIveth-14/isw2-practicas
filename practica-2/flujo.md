#Comparacion de GitFlow y trunk-based 

GitFlow utiliza varias ramas de larga duración, como main, develop, feature, release y hotfix.
Las nuevas funcionalidades se desarrollan en ramas separadas y se integran cuando están listas.
Este modelo es ideal para proyectos con lanzamientos grandes y poco frecuentes, ya que ofrece mayor control y estabilidad, aunque aumenta la complejidad y el riesgo de conflictos al fusionar ramas.

Trunk-Based Development, en cambio, trabaja principalmente con una sola rama (main o trunk). 
Los desarrolladores integran cambios pequeños y frecuentes, normalmente todos los días, apoyándose en pruebas automatizadas y feature flags para ocultar funcionalidades que aún no están listas. 
Este enfoque facilita la integración continua (CI/CD) y permite realizar despliegues rápidos y frecuentes.

¿Cuál usaría para una aplicación web y por qué?

Para una aplicación web usaría Trunk-Based Development, porque permite integrar cambios de forma continua, 
realizar despliegues frecuentes y detectar errores rápidamente mediante pruebas automatizadas. Además, reduce los conflictos de fusión y
favorece el trabajo colaborativo del equipo. Este modelo es especialmente adecuado para aplicaciones web modernas que necesitan recibir mejoras
constantes y ofrecer nuevas funcionalidades de manera rápida a los usuarios.
