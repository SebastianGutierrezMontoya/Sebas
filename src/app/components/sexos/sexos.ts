import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SexosService } from '../../services/sexos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sexos',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './sexos.html',
})
export class Sexos implements OnInit {
  sexos: any[] = [];

  isLoading = false
  errorMessage = '';

  constructor(private service: SexosService
    , private router: Router,
    private cdr: ChangeDetectorRef
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
