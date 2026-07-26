# Limpieza de código

```java
int x=0;
if(a==true){
System.out.println("Correcto");
}else{
System.out.println("Incorrecto");
}
```

## Code Smells encontrados

La variable `x` tiene un nombre poco descriptivo.
El codigo no está correctamente indentado.
La comparación `a == true` es innecesaria.
El codigo puede mejorar su legibilidad siguiendo buenas practicas.

## Actualizado

```java
boolean a = true;

if (a) {
    System.out.println("Correcto");
} else {
    System.out.println("Incorrecto");
}
```

## Cambios realizados

Se elimino la comparación `== true`.
Se mejoró la indentación del codigo.
Se utilizo una variable de tipo `boolean`.
Se aumentó la legibilidad del codigo.

   
## Conclusión

Aplicar buenas practicas de programación mejora la legibilidad, el mantenimiento y la calidad del codigo.
