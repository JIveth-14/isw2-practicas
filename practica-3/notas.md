# Notas — Principios aplicados

**Principio 2: Una función, una responsabilidad (S — SRP)**
Cada clase ahora tiene una sola razón para cambiar: ValidadorStock solo valida,
CalculadoraTotal solo calcula, PedidoRepository solo persiste, GeneradorTicket
solo imprime y NotificadorWhatsApp solo notifica. Antes, un cambio en la lógica
de WhatsApp obligaba a tocar la misma clase que maneja stock y base de datos.

**Principio 9: Diseñá para el cambio (D — DIP)**
PedidoService ya no crea ni conoce las implementaciones concretas de guardado
o envío: las recibe inyectadas en el constructor. Esto permite mockear
PedidoRepository o NotificadorWhatsApp en tests sin tocar la lógica del
servicio, y cambiar de WhatsApp API sin modificar PedidoService.
