import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfilesService } from '../../services/perfiles.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.html',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],

})
export class Perfiles implements OnInit {

    perfiles: any[] = [];
    showModal = false;
    perfilToDelete: any = null;

    isloading = false;
    errorMessage = '';

    MODULO_ID = 4; // Reemplaza con el ID del módulo de perfiles en tu sistema de permisos

  constructor(private perfilesService: PerfilesService,
     private router: Router,
     private cdr: ChangeDetectorRef,
     private permisosService: PermisosService) { }

  ngOnInit(): void {
    this.cargarPerfiles();
  }

  cargarPerfiles(): void {
    this.isloading = true;
    this.perfilesService.getAll().subscribe({
      next: (data: any[]) => {
        this.perfiles = data;
        this.isloading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los perfiles';
        this.isloading = false;
        this.cdr.detectChanges();
      }
    });
}

  editarPerfil(id: number): void {
    this.router.navigate(['/perfiles/form', id]);
  }

  crearPerfil(): void {
    this.router.navigate(['/perfiles/form']);
  }

    gestionarPermisos(id: number): void {
    this.router.navigate(['/perfiles/permisos', id]);
    }

    eliminarPerfil(): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.perfilesService.delete(this.perfilToDelete.id_perfil).subscribe(() => {
        this.perfiles = this.perfiles.filter(p => p.id_perfil !== this.perfilToDelete.id_perfil);
        this.closeModal();
    }); 
}

    showDeleteModal(perfil: any): void {
      if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.perfilToDelete = perfil;
    this.showModal = true;
    }

    closeModal(): void {
    this.showModal = false;
    this.perfilToDelete = null;
    }



}