import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './roles.html',
})

export class Roles implements OnInit {

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  roleToDelete: any = null;

  roles: any[] = [];

  MODULO_ID = 3; // Reemplaza con el ID del módulo de roles en tu sistema de permisos

  constructor(private rolesService: RolesService,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private permisosService: PermisosService
  ) { }

  ngOnInit(): void {
    // Initialization logic here
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.rolesService.getAll().subscribe({
      next: (data) => {
        // Handle successful data retrieval
        this.roles = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err); 
        this.errorMessage = 'Error al cargar roles';
        this.isLoading = false;
        this.cdr.detectChanges();
      } 
    });
  }

  crearRol(): void {
    this.router.navigate(['/roles/form']);
  }

  editarRol(role: any): void {
    this.router.navigate(['/roles/form', role.id_rol]);
  }
  confirmarEliminarRol(role: any): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.roleToDelete = role;
    this.showDeleteModal = true;
  }
  cancelarEliminarRol(): void {
    this.roleToDelete = null;
    this.showDeleteModal = false;
  }
  eliminarRol(): void {
    if (!this.roleToDelete) return;
    this.rolesService.delete(this.roleToDelete.id_rol).subscribe({
      next: () => {
        this.loadRoles();
        this.cancelarEliminarRol();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar rol';
        this.cancelarEliminarRol();
        this.cdr.detectChanges();
      }
    });
  }


}
