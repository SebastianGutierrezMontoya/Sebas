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

  isLoading = false;
  errorMessage = '';
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
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      id_sexo: ['', Validators.required],
      nombre_sexo: ['', Validators.required],
    });
  }

  loadSexo(): void {
    if (!this.sexoId) return;
    this.isLoading = true;
    this.service.getById(this.sexoId).subscribe({
      next: (data) => {
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