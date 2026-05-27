
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit, NgZone } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { PedidosProductosService } from '../../services/pedidosproductos.service';
import { Pedidos, PedidosProductos } from '../../models/models';

@Component({
  selector: 'app-carsidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './carsidebar.html',
//   styleUrl: './navbar.css',
})
export class Carsidebar implements OnInit {

    usuario: any = null;
    isAuthenticated = false;
    Carscript = 'cart-sidebar.js'
    isSubmitting = false;
    pedido_id = 0;

    constructor(
    public authService: AuthService,
    public carritoService: CarritoService,
    private router: Router,
    private ngZone: NgZone,
    private pedidosService: PedidosService,
    private pedidosProductosService: PedidosProductosService
  ) {



  }

  ngOnInit(): void {
    this.loadid();
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });

    this.loadScript('cart-sidebar.js');
    
    // Exponer métodos de Angular al scope global para que el JS los pueda usar
    (window as any).submitCheckoutAngular = (cartData: any) => this.submitCheckout(cartData);
    
    // Exponer los métodos del CarritoService para que el JS los use
    (window as any).carritoAngular = {
      agregarAlCarrito: (id: string, name: string, price: number) => 
        this.carritoService.agregarAlCarrito(id, name, price),
      eliminarDelCarrito: (index: number) => 
        this.carritoService.eliminarDelCarrito(index),
      actualizarCantidad: (index: number, delta: number) => 
        this.carritoService.actualizarCantidad(index, delta),
      vaciarCarrito: () => 
        this.carritoService.vaciarCarrito(),
      getCarritoActual: () => 
        this.carritoService.getCarritoActual(),
      getTotal: () => 
        this.carritoService.getTotal(),
      getCantidadTotal: () => 
        this.carritoService.getCantidadTotal()
    };

    // Exponer función para actualizar la UI del carrito desde JS
    (window as any).actualizarCarritoUI = () => {
      const renderCart = (window as any).renderCart;
      if (renderCart && typeof renderCart === 'function') {
        renderCart();
      }
    };
  }


  private obtenerProximoIdPedido(): Promise<number> {
    return new Promise((resolve) => {
      this.pedidosService.getAll().subscribe({
        next: (peds: any[]) => {
          if (!peds || peds.length === 0) {
            resolve(1);
          } else {
            const maxId = Math.max(...peds.map(p => p.ped_id || 0));
            resolve(maxId + 1);
          }
        },
        error: () => {
          // Si hay error, retorna 1
          resolve(1);
        }
      });
    });
  }

  async loadid(): Promise<void> {
    this.obtenerProximoIdPedido().then(id => {
      this.pedido_id = id;
    });

  }


  private loadScript(scriptPath: string): void {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;
    document.body.appendChild(script);
  }

  /**
   * Realiza el submit del pedido
   */
  submitCheckout(checkoutData: any): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    // Validar que el usuario esté autenticado
    if (!this.isAuthenticated || !this.usuario) {
      alert('Debes estar autenticado para realizar un pedido');
      this.isSubmitting = false;
      return;
    }

    if (!checkoutData.items || checkoutData.items.length === 0) {
      alert('El carrito está vacío');
      this.isSubmitting = false;
      return;
    }

    // Crear el pedido
    const pedido: Pedidos = {
      ped_id: this.pedido_id, // El backend generará el ID
      usu_id: this.usuario.id_usuario,
      ped_fecha_pedido: new Date().toISOString().split('T')[0],
      ped_total: checkoutData.total,
      ped_direccion_envio: checkoutData.direccion,
      ped_notas: checkoutData.notas || '',
      ped_estado: 1,
    };

    this.pedidosService.create(pedido).subscribe({
      next: (pedidoCreado: any) => {
        // Una vez creado el pedido, crear los registros de productos
        this.crearProductosPedido(pedidoCreado.ped_id, checkoutData.items);
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        alert('Error al crear el pedido. Por favor intenta nuevamente.');
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Crea los registros de PedidosProductos
   */
  private crearProductosPedido(pedidoId: number, items: any[]): void {
    if (!items || items.length === 0) {
      alert('El carrito está vacío');
      this.isSubmitting = false;
      return;
    }

    let itemsProcesados = 0;
    let errores = 0;

    items.forEach(item => {
      const pedidoProducto: PedidosProductos = {
        ped_id: pedidoId,
        prod_id: item.id,
        pped_cantidad: item.qty,
        pped_precio_unitario: item.price,
        pped_total: item.price * item.qty,
        pped_descuento: 0,
        pped_estado: 1
      };

      this.pedidosProductosService.create(pedidoProducto).subscribe({
        next: () => {
          itemsProcesados++;
          // Si todos los items fueron procesados, finalizar
          if (itemsProcesados === items.length) {
            this.finalizarPedido(pedidoId);
          }
        },
        error: (error) => {
          console.error(`Error al crear producto ${item.id}:`, error);
          errores++;
          itemsProcesados++;
          if (itemsProcesados === items.length) {
            this.finalizarPedido(pedidoId, errores);
          }
        }
      });
    });
  }

  /**
   * Finaliza el proceso del pedido
   */
  private finalizarPedido(pedidoId: number, errores: number = 0): void {
    this.isSubmitting = false;

    if (errores > 0) {
      alert(`Pedido creado con ID ${pedidoId}, pero hubo errores al guardar algunos productos.`);
    } else {
      alert(`¡Pedido realizado exitosamente! Tu número de pedido es: ${pedidoId}`);
    }

    // Limpiar el carrito usando el servicio
    this.carritoService.vaciarCarrito();

    // Cerrar el modal y el carrito
    const modal = document.getElementById('checkout-modal');
    const overlay = document.getElementById('checkout-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');

    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');

    // Redirigir a mis pedidos después de 1.5 segundos
    setTimeout(() => {
      this.router.navigate(['/mis_pedidos', this.usuario.id_usuario]);
    }, 1500);
  }

}