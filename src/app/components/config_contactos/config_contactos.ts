import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ConfigContactoService } from '../../services/configcontacto.service';
import { CommonModule } from '@angular/common';
import { ConfigContacto } from '../../models/models';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-config-contactos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './config_contactos.html',
})
export class ConfigContactos implements OnInit {
  contactos: any[] = [];

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  contactoToDelete: any | null = null;

  MODULO_ID = 6; // Reemplaza con el ID del módulo de config_contactos en tu sistema de permisos

  constructor(
    private service: ConfigContactoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.loadContactos();
  }


  loadContactos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data) => {
        this.contactos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar contactos';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearContacto(): void {
    this.router.navigate(['/config_contactos/form']);
  }

  editarContacto(contacto: ConfigContacto): void {
    this.router.navigate(['/config_contactos/form', contacto.id_regla]);
  }

  confirmarEliminar(contacto: ConfigContacto): void {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    this.contactoToDelete = contacto;
    console.log('Contacto a eliminar:', this.contactoToDelete);
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.contactoToDelete = null;
    this.showDeleteModal = false;
  }

  eliminarContacto(): void {
    if (!this.contactoToDelete) return;
    this.service.delete(this.contactoToDelete.id_regla).subscribe({
      next: () => {
        this.contactos = this.contactos.filter(c => c.id_regla !== this.contactoToDelete?.id_regla);
        this.showDeleteModal = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar contacto';
      }
    });
  
  }

}
