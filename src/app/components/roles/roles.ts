import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './roles.html',
})

export class Roles implements OnInit {

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  roleToDelete: any = null;

  roles: any[] = [];

  constructor(private rolesService: RolesService,
              private router: Router,
              private cdr: ChangeDetectorRef
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
