import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../models/models';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './productos.html',
})
export class Producto implements OnInit {

  productos: Productos[] = [];

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  productoToDelete: Productos | null = null;

  page = 1;

  MODULO_ID = 8; // Reemplaza con el ID del módulo de productos en tu sistema de permisos

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private service: ProductosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  // ========================
  // LOAD
  // ========================
  loadProductos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const search = this.form.value.search || '';

    this.service.getProductos(search, this.page).subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar productos';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ========================
  // BUSCAR
  // ========================
  buscar(): void {
    this.page = 1;
    this.loadProductos();
  }

  // ========================
  // NAVIGATION
  // ========================
  crearProducto(): void {
    this.router.navigate(['/productos/form']);
  }

  Auditoria(): void {
    this.router.navigate(['/productos/auditoria']);
  }

  editarProducto(producto: Productos): void {
    this.router.navigate(['/productos/form', producto.prod_id]);
  }

  // ========================
  // DELETE MODAL
  // ========================
  confirmarEliminar(producto: Productos): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.productoToDelete = producto;
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.showDeleteModal = false;
    this.productoToDelete = null;
  }

  eliminarProducto(): void {
    if (!this.productoToDelete) return;

    this.isLoading = true;

    this.service.delete(this.productoToDelete.prod_id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.productoToDelete = null;
        this.loadProductos();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar producto';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ========================
  // PAGINACIÓN
  // ========================
  siguiente(): void {
    this.page++;
    this.loadProductos();
  }

  anterior(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProductos();
    }
  }
}