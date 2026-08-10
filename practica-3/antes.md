# Antes — Pedido (sin SOLID)

class Pedido {
  procesarPedido(clienteId, items) {
    // 1. Validar stock
    for (const item of items) {
      const stockDisponible = db.query(
        `SELECT stock FROM productos WHERE id = ${item.productoId}`
      );
      if (stockDisponible < item.cantidad) {
        console.log(`Sin stock para producto ${item.productoId}`);
        return null;
      }
    }

    // 2. Calcular total con ISV (15%)
    let subtotal = 0;
    for (const item of items) {
      const precio = db.query(
        `SELECT precio FROM productos WHERE id = ${item.productoId}`
      );
      subtotal += precio * item.cantidad;
    }
    const isv = subtotal * 0.15;
    const total = subtotal + isv;

    // 3. Guardar en la base de datos
    const pedidoId = db.insert("pedidos", {
      clienteId,
      items,
      subtotal,
      isv,
      total,
      fecha: new Date(),
    });

    // 4. Imprimir el ticket
    console.log("=== TICKET ===");
    console.log(`Pedido #${pedidoId}`);
    console.log(`Subtotal: L. ${subtotal}`);
    console.log(`ISV: L. ${isv}`);
    console.log(`Total: L. ${total}`);

    // 5. Enviar WhatsApp al cliente
    const cliente = db.query(`SELECT telefono FROM clientes WHERE id = ${clienteId}`);
    whatsappApi.send(cliente.telefono, `Tu pedido #${pedidoId} por L.${total} fue confirmado`);

    return pedidoId;
  }
}
