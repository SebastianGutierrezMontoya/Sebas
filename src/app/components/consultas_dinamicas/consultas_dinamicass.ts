import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ConsultasDinamicasService } from '../../services/consultasdinamicas.service';
import { CommonModule } from '@angular/common';
import { ConsultasDinamicas } from '../../models/models';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-consultas_dinamicas',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './consultas_dinamicas.html',
})
export class ConsultasDinamicass implements OnInit {

  consultas: ConsultasDinamicas[] = [];
  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  consultaToDelete: ConsultasDinamicas | null = null;

  MODULO_ID = 11; // Reemplaza con el ID del módulo de consultas dinámicas en tu sistema de permisos

  constructor(
    private service: ConsultasDinamicasService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) { }

  ngOnInit(): void {
    this.loadConsultas();
  }

  loadConsultas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data) => {
        this.consultas = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar consultas dinámicas';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearConsulta(): void {
    this.router.navigate(['/consultas_dinamicas/form']);
  }
  editarConsulta(consulta: ConsultasDinamicas): void {
    this.router.navigate(['/consultas_dinamicas/form', consulta.cons_id]);
  }
  confirmarEliminar(consulta: ConsultasDinamicas): void { 
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) { // Reemplaza 11 con el ID del módulo de consultas dinámicas
      alert('No tienes permiso para eliminar');
      return;
    }
    this.consultaToDelete = consulta;
    this.showDeleteModal = true;
  }
  cancelarEliminar(): void {
    this.consultaToDelete = null;
    this.showDeleteModal = false;
  }
  eliminarConsulta(): void {
    if (!this.consultaToDelete) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.service.delete(this.consultaToDelete.cons_id).subscribe({
      next: () => {
        this.loadConsultas();
        this.cancelarEliminar();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar consulta dinámica';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verReporte(consulta: ConsultasDinamicas): void {
    // Navegar al componente de resultados con el ID de la consulta
    this.router.navigate(['/consultas_dinamicas/resultados', consulta.cons_id]);
  }


}
