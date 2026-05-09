import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { CategoriaService, Categoria } from '../../services/categoria.service';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  categorias: Categoria[] = [];
  isLoading = false;
  errorMessage = '';
  showDeleteModal = false;
  categoriaToDelete: Categoria | null = null;

  MODULO_ID = 7; // Reemplaza con el ID del módulo de categorías en tu sistema de permisos

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  // Cargar todas las categorías
  loadCategorias(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        this.categorias = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Fuerza detección de cambios
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorMessage = 'Error al cargar las categorías';
        this.isLoading = false;
        this.cdr.detectChanges(); // Fuerza detección de cambios en error
      }
    });
  }

  // Navegar a crear nueva categoría
  crearCategoria(): void {
    this.router.navigate(['/categorias/form']);
  }

  // Navegar a editar categoría
  editarCategoria(categoria: Categoria): void {
    if (categoria.cat_id) {
      this.router.navigate(['/categorias/form', categoria.cat_id]);
    }
  }

  // Mostrar modal de confirmación para eliminar
  confirmarEliminar(categoria: Categoria): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.categoriaToDelete = categoria;
    this.showDeleteModal = true;
  }

  // Cancelar eliminación
  cancelarEliminar(): void {
    this.showDeleteModal = false;
    this.categoriaToDelete = null;
  }

  // Eliminar categoría
  eliminarCategoria(): void {
    if (this.categoriaToDelete && this.categoriaToDelete.cat_id) {
      this.isLoading = true;
      this.categoriaService.eliminarCategoria(this.categoriaToDelete.cat_id).subscribe({
        next: () => {
          this.isLoading = false;
          this.showDeleteModal = false;
          this.categoriaToDelete = null;
          // Recargar la lista después de eliminar
          this.loadCategorias();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          this.errorMessage = 'Error al eliminar la categoría';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
