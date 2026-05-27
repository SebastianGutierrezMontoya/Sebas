import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly CART_CACHE_KEY = 'multiverse_cart_items';
  private carritoSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  public carrito$ = this.carritoSubject.asObservable();

  constructor() {
    // Escuchar cambios en localStorage desde otras ventanas/tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.CART_CACHE_KEY) {
        this.recargarCarrito();
      }
    });

    // Escuchar cambios en localStorage cada 500ms (para sincronización dentro de la misma ventana)
    setInterval(() => {
      const carritoActual = this.loadCartFromStorage();
      const carritoEnMemoria = this.carritoSubject.value;
      
      // Comparar si el carrito cambió
      if (JSON.stringify(carritoActual) !== JSON.stringify(carritoEnMemoria)) {
        this.carritoSubject.next(carritoActual);
      }
    }, 500);
  }

  /**
   * Carga el carrito desde localStorage
   */
  private loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const cached = localStorage.getItem(this.CART_CACHE_KEY);
      if (!cached) return [];
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Error cargando carrito desde localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  private saveCartToStorage(carrito: CartItem[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.CART_CACHE_KEY, JSON.stringify(carrito));
      this.carritoSubject.next(carrito);
      this.notificarCambioCarrito();
    } catch (error) {
      console.warn('Error guardando carrito en localStorage:', error);
    }
  }

  /**
   * Notifica al JS que el carrito cambió para que actualice la UI
   */
  private notificarCambioCarrito(): void {
    if (typeof window !== 'undefined' && (window as any).actualizarCarritoUI) {
      (window as any).actualizarCarritoUI();
    }
  }

  /**
   * Recarga el carrito desde localStorage
   */
  private recargarCarrito(): void {
    const carrito = this.loadCartFromStorage();
    this.carritoSubject.next(carrito);
  }

  /**
   * Obtiene el carrito actual (valor actual del BehaviorSubject)
   */
  getCarritoActual(): CartItem[] {
    return this.carritoSubject.value;
  }

  /**
   * Obtiene el total del carrito
   */
  getTotal(): number {
    return this.carritoSubject.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  /**
   * Obtiene la cantidad total de items
   */
  getCantidadTotal(): number {
    return this.carritoSubject.value.reduce((sum, item) => sum + item.qty, 0);
  }

  /**
   * Agrega un item al carrito
   */
  agregarAlCarrito(id: string, name: string, price: number): void {
    const carrito = this.getCarritoActual();
    const existente = carrito.find(item => item.id === id);

    if (existente) {
      existente.qty = (existente.qty || 1) + 1;
    } else {
      carrito.push({ id, name, price: parseFloat(price.toString()) || 0, qty: 1 });
    }

    this.saveCartToStorage(carrito);
  }

  /**
   * Elimina un item del carrito
   */
  eliminarDelCarrito(index: number): void {
    const carrito = this.getCarritoActual();
    if (index >= 0 && index < carrito.length) {
      carrito.splice(index, 1);
      this.saveCartToStorage(carrito);
    }
  }

  /**
   * Actualiza la cantidad de un item
   */
  actualizarCantidad(index: number, delta: number): void {
    const carrito = this.getCarritoActual();
    if (index >= 0 && index < carrito.length) {
      carrito[index].qty += delta;
      if (carrito[index].qty <= 0) {
        carrito.splice(index, 1);
      }
      this.saveCartToStorage(carrito);
    }
  }

  /**
   * Vacía el carrito
   */
  vaciarCarrito(): void {
    this.saveCartToStorage([]);
  }

  /**
   * Retorna si el carrito está vacío
   */
  estaVacio(): boolean {
    return this.getCarritoActual().length === 0;
  }
}
