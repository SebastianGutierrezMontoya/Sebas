import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { ConsultasDinamicasService } from '../../services/consultasdinamicas.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-consultas_dinamicas_form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './consultas_dinamicas_form.html',
})
export class ConsultasDinamicasForm implements OnInit {

  form!: FormGroup;

  isEditMode = false
  consultaId: number | null = null;

  isLoading = false
  errorMessage = '';


  constructor(
    private service: ConsultasDinamicasService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.consultaId = params['id'];
        this.loadConsulta();
      }
    });

  }


  initForm(): void {
    this.form = this.formBuilder.group({
      cons_id: [null, Validators.required],
      cons_nombre: ['', Validators.required],
      cons_sql: ['', Validators.required],
      cons_description: ['']
    });
  }

  loadConsulta(): void {
    if (!this.consultaId) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getById(this.consultaId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar consulta dinámica';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    }

  guardar(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    const consultaData = this.form.value;
    if (this.isEditMode && this.consultaId) {
      this.service.update(this.consultaId, consultaData).subscribe({
        next: () => {
          this.router.navigate(['/consultas_dinamicas']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar consulta dinámica';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.create(consultaData).subscribe({
        next: () => {
          this.router.navigate(['/consultas_dinamicas']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear consulta dinámica';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/consultas_dinamicas']);
  }
    

}
