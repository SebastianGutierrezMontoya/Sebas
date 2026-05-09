import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SexosService } from '../../services/sexos.service';
import { CommonModule } from '@angular/common';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-sexos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './sexos.html',
})
export class Sexos implements OnInit {
  sexos: any[] = [];

  isLoading = false
  errorMessage = '';

  MODULO_ID = 2; // Reemplaza con el ID

  constructor(private service: SexosService
    , private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.loadSexos();
  }

  loadSexos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data) => {
        this.sexos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar sexos';
        this.isLoading = false;
      }
    });
  }

  deleteSexo(sexo: any): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    if (confirm(`¿Estás seguro de que deseas eliminar el sexo "${sexo.descripcion}"?`)) {
      this.service.delete(sexo.id_sexo).subscribe({
        next: () => {
          this.loadSexos();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al eliminar el sexo';
        }
      });
    }
  }

  crearSexo(): void {
    // Navegar al formulario de creación
    this.router.navigate(['/sexos/form']);
  }

  editarSexo(sexo: any): void {
    // Navegar al formulario de edición con el ID del sexo
    this.router.navigate(['/sexos/form', sexo.id_sexo]);
  }



}
