import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { SexosService } from '../../services/sexos.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-sexos-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './sexos_form.html',
})
export class SexosForm implements OnInit {
  form!: FormGroup;

  isEditMode = false
  sexoId: number | null = null;
  Sexonombre: string = '';
  isLoading = false;
  errorMessage = '';

  nextId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: SexosService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.sexoId = params['id'];
        this.loadSexo();
      } else {
        this.loadid();
      }
    });
  }

  async loadid(): Promise<void> {
    this.obtenerProximoId().then(id => {
      this.nextId = id;
    });

  }

  private obtenerProximoId(): Promise<number> {
    return new Promise((resolve) => {
      this.service.getAll().subscribe({
        next: (sexos: any[]) => {
          if (!sexos || sexos.length === 0) {
            resolve(1);
          } else {
            const maxId = Math.max(...sexos.map(s => s.id_sexo || 0));
            resolve(maxId + 1);
          }
        },
        error: () => {
          // Si hay error, retorna 1
          resolve(1);
        }
      });
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      id_sexo: [null],
      nombre_sexo: ['', Validators.required],
    });
  }

  loadSexo(): void {
    if (!this.sexoId) return;
    this.isLoading = true;
    this.service.getById(this.sexoId).subscribe({
      next: (data) => {
        this.Sexonombre = data.nombre_sexo;
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log(data);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el sexo';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const sexoData = this.form.value;
    if (this.isEditMode && this.sexoId) {
      this.service.update(this.sexoId, sexoData).subscribe({
        next: () => {
          this.router.navigate(['/sexos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar el sexo';
        }
      });
    } else {
      sexoData.id_sexo = this.nextId; // Asigna el ID generado
      this.service.create(sexoData).subscribe({
        next: () => {
          this.router.navigate(['/sexos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear el sexo';
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/sexos']);
  }


}