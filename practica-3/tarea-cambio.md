# Tarea entre sesiones

## 1. Clase o función con más de una razón para cambiar

Para esta actividad revisé mi propio código de una lista enlazada en C++.

La función que seleccioné es `main()`.

La función `main()` tiene varias responsabilidades dentro del programa. Entre ellas se encuentran mostrar el menú, recibir la opción del usuario, 
solicitar datos, ejecutar las diferentes operaciones y mostrar mensajes.

Por esta razón, existen diferentes situaciones que pueden provocar que la función `main()` tenga que cambiar.

### Razones para cambiar

1. Cambiar o agregar opciones al menú.
2. Cambiar la forma en que se reciben los datos del usuario.
3. Cambiar los mensajes que se muestran en pantalla.
4. Agregar nuevas operaciones como eliminar un nodo.
5. Cambiar la forma en que se controla la navegación del programa.
6. Agregar validaciones para los datos introducidos por el usuario.

Por ejemplo, actualmente el menú contiene:

- Agregar
- Presentar
- Buscar
- Modificar
- Salir

Si se quisiera agregar una nueva operación como "Eliminar", sería necesario modificar la función `main()` para agregar una nueva opción y un nuevo `case`.

Esto demuestra que `main()` tiene más de una razón para cambiar y que concentra varias responsabilidades.

---

## 2. Relación entre "diseñado para el cambio" y S, O y L

El principio de "diseñado para el cambio" significa que el código debe estar organizado de manera que los cambios futuros 
puedan realizarse fácilmente y sin afectar innecesariamente otras partes del programa.

Este concepto se relaciona con los principios SOLID.

### S — Single Responsibility Principle

El principio de responsabilidad única establece que una clase o función debe tener una sola responsabilidad y una sola razón para cambiar.

En mi código, la función `main()` tiene varias responsabilidades porque muestra el menú, recibe información del usuario, controla el `switch`, ejecuta operaciones y muestra mensajes.

Por lo tanto, `main()` podría mejorarse separando estas responsabilidades en diferentes funciones.

Por ejemplo:

- `mostrarMenu()`
- `agregar()`
- `presentar()`
- `buscar()`
- `modificar()`
- `eliminar()`

De esta manera, cada función tendría una responsabilidad más específica y los cambios serían más fáciles de realizar.

### O — Open/Closed Principle

El principio Open/Closed establece que una parte del software debe estar abierta para extensión, pero cerrada para modificación.

En mi código, si quisiera agregar una nueva operación, por ejemplo "Eliminar", tendría que modificar la función `main()` agregando una nueva opción al menú y un nuevo `case`.

Una mejor estructura permitiría agregar nuevas funcionalidades sin modificar demasiado el código que ya existe.

Esto facilita el mantenimiento y disminuye el riesgo de introducir errores.

### L — Liskov Substitution Principle

El principio de sustitución de Liskov indica que una clase hija debe poder utilizarse en lugar de su clase padre sin cambiar el comportamiento esperado del programa.

Mi programa actual no utiliza herencia, por lo que este principio no se puede observar directamente en el código.

Sin embargo, se relaciona con el concepto de "diseñado para el cambio", porque busca que los componentes puedan ser reemplazados o extendidos sin provocar problemas en el funcionamiento del sistema.

Si en el futuro el programa utilizara diferentes tipos de nodos mediante herencia, este principio ayudaría a garantizar que las clases derivadas mantuvieran el comportamiento esperado.

---

## 3. Conclusión

Al analizar mi código pude identificar que la función `main()` tiene varias responsabilidades y, por lo tanto, varias razones para cambiar.

Esto demuestra la importancia de diseñar el código pensando en los cambios futuros.

El principio S ayuda a separar responsabilidades, el principio O permite agregar funcionalidades reduciendo las modificaciones al código existente y
el principio L permite trabajar con diferentes implementaciones mediante sustitución sin alterar el comportamiento esperado.

Aplicar estos principios permite crear un código más organizado, mantenible y preparado para futuros cambios.
