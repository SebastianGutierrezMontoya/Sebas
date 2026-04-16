import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { ConfigContactoService } from '../../services/configcontacto.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-contactos-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './config_contactos_form.html',
})
export class ConfigContactosForm implements OnInit {

  form!: FormGroup;

  isEditMode = false;
  contactoId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private configContactoService: ConfigContactoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.initForm();
  }

 
  initForm(): void {
    this.form = this.fb.group({
      id_regla: ['', Validators.required],
      nombre_contacto: ['', Validators.required],
      descripcion: [''],
      regex_val: [''],
      min_length: [''],
      max_length: [''],
      mensaje_error: ['', Validators.required]
    });
  }

 

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contactoId = params['id'];
        this.loadContacto();
      }
    });

  }

  loadContacto(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.configContactoService.getById(this.contactoId!).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar contacto';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete los campos requeridos';
      return;
    }
    
    const contactoData = this.form.value;

    if (this.isEditMode) {
      this.configContactoService.update(this.contactoId!, contactoData).subscribe({
        next: () => {
          this.router.navigate(['/config-contactos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar contacto';
        }
      });
    } else {
      this.configContactoService.create(contactoData).subscribe({
        next: () => {
          this.router.navigate(['/config-contactos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear contacto';
        }
      });
    }
  }
  
}
