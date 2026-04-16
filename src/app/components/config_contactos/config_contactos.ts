import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ConfigContactoService } from '../../services/configcontacto.service';
import { CommonModule } from '@angular/common';
import { ConfigContacto } from '../../models/models';

@Component({
  selector: 'app-config-contactos',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './config_contactos.html',
})
export class ConfigContactos implements OnInit {
  contactos: any[] = [];

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  contactoToDelete: any | null = null;

  constructor(
    private service: ConfigContactoService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.contactoToDelete = contacto;
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.contactoToDelete = null;
    this.showDeleteModal = false;
  }

  eliminarContacto(): void {
    if (!this.contactoToDelete) return;
    this.service.delete(this.contactoToDelete.id).subscribe({
      next: () => {
        this.contactos = this.contactos.filter(c => c.id !== this.contactoToDelete?.id);
        this.cancelarEliminar();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar contacto';
      }
    });
  
  }

}
