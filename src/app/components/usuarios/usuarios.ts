import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../models/models';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
})

export class UsuariosComponent implements OnInit {
 
  usuarios: Usuarios[] = [];

  isLoading = false;
  errorMessage = '';

  showDeleteModal = false;
  usuarioToDelete: Usuarios | null = null;

  page = 1;

  form = new FormGroup({
    search: new FormControl(''),
    match_id: new FormControl(false)
  });

  constructor(
    private service: UsuariosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.isLoading = true;

    const { search, match_id } = this.form.value;

    this.service.getUsuarios(search || '', match_id || false, this.page)
      .subscribe({
        next: (data) => {
          this.usuarios = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Error al cargar usuarios';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  buscar() {
    this.page = 1;
    this.loadUsuarios();
  }

  crearUsuario() {
    this.router.navigate(['/usuarios/form']);
  }

  editarUsuario(u: Usuarios) {
    this.router.navigate(['/usuarios/form', u.id_usuario]);
  }

  confirmarEliminar(u: Usuarios) {
    this.usuarioToDelete = u;
    this.showDeleteModal = true;
  }

  eliminarUsuario() {
    if (!this.usuarioToDelete) return;

    this.service.delete(this.usuarioToDelete.id_usuario).subscribe(() => {
      this.showDeleteModal = false;
      this.loadUsuarios();
    });
  }
}