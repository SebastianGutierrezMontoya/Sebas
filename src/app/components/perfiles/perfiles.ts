import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfilesService } from '../../services/perfiles.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.html',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],

})
export class Perfiles implements OnInit {

    perfiles: any[] = [];
    showModal = false;
    perfilToDelete: any = null;

    isloading = false;
    errorMessage = '';

  constructor(private perfilesService: PerfilesService,
     private router: Router,
     private cdr: ChangeDetectorRef) { }

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
    this.perfilesService.delete(this.perfilToDelete.id_perfil).subscribe(() => {
        this.perfiles = this.perfiles.filter(p => p.id_perfil !== this.perfilToDelete.id_perfil);
        this.closeModal();
    }); 
}

    showDeleteModal(perfil: any): void {
    this.perfilToDelete = perfil;
    this.showModal = true;
    }

    closeModal(): void {
    this.showModal = false;
    this.perfilToDelete = null;
    }



}