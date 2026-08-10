# Después — Pedido (con SOLID)

// --- Responsabilidad 1: validar stock ---
class ValidadorStock {
  constructor(productoRepo) {
    this.productoRepo = productoRepo;
  }
  validar(items) {
    for (const item of items) {
      const stock = this.productoRepo.getStock(item.productoId);
      if (stock < item.cantidad) {
        throw new Error(`Sin stock para producto ${item.productoId}`);
      }
    }
    return true;
  }
}

// --- Responsabilidad 2: calcular total ---
class CalculadoraTotal {
  constructor(productoRepo, porcentajeISV = 0.15) {
    this.productoRepo = productoRepo;
    this.porcentajeISV = porcentajeISV;
  }
  calcular(items) {
    const subtotal = items.reduce((acc, item) => {
      const precio = this.productoRepo.getPrecio(item.productoId);
      return acc + precio * item.cantidad;
    }, 0);
    const isv = subtotal * this.porcentajeISV;
    return { subtotal, isv, total: subtotal + isv };
  }
}

// --- Responsabilidad 3: persistencia ---
class PedidoRepository {
  guardar(pedido) {
    return db.insert("pedidos", pedido);
  }
}

// --- Responsabilidad 4: generar ticket ---
class GeneradorTicket {
  imprimir(pedidoId, montos) {
    console.log("=== TICKET ===");
    console.log(`Pedido #${pedidoId}`);
    console.log(`Subtotal: L. ${montos.subtotal}`);
    console.log(`ISV: L. ${montos.isv}`);
    console.log(`Total: L. ${montos.total}`);
  }
}

// --- Responsabilidad 5: notificación ---
class NotificadorWhatsApp {
  constructor(whatsappApi, clienteRepo) {
    this.whatsappApi = whatsappApi;
    this.clienteRepo = clienteRepo;
  }
  notificar(clienteId, pedidoId, total) {
    const cliente = this.clienteRepo.getById(clienteId);
    this.whatsappApi.send(cliente.telefono, `Tu pedido #${pedidoId} por L.${total} fue confirmado`);
  }
}

// --- Orquestador: recibe TODO por inyección de dependencias (D) ---
class PedidoService {
  constructor(validadorStock, calculadoraTotal, pedidoRepo, generadorTicket, notificador) {
    this.validadorStock = validadorStock;
    this.calculadoraTotal = calculadoraTotal;
    this.pedidoRepo = pedidoRepo;
    this.generadorTicket = generadorTicket;
    this.notificador = notificador;
  }

  procesarPedido(clienteId, items) {
    this.validadorStock.validar(items);
    const montos = this.calculadoraTotal.calcular(items);
    const pedidoId = this.pedidoRepo.guardar({ clienteId, items, ...montos, fecha: new Date() });
    this.generadorTicket.imprimir(pedidoId, montos);
    this.notificador.notificar(clienteId, pedidoId, montos.total);
    return pedidoId;
  }
}
