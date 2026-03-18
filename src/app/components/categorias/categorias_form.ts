import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './categorias_form.html',
})
export class CategoriasForm implements OnInit, OnDestroy {
  form!: FormGroup;
  isEditMode = false;
  categoriaId: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
    console.log('✓ CategoriasForm constructor ejecutado');
  }

  ngOnInit(): void {
    // Verificar si es edición o creación
    this.route.params.subscribe(params => {
      console.log('Parámetros recibidos:', params);
      if (params['id']) {
        console.log('ID para editar:', params['id']);
        this.isEditMode = true;
        this.categoriaId = params['id'];
        this.loadCategoria();
      } else {
        console.log('No hay ID, modo creación');
      }
    });
  }

  // Inicializar el formulario
  private initializeForm(): void {
    this.form = this.formBuilder.group({
      cat_nombre: ['', [Validators.required, Validators.maxLength(50)]],
      cat_descripcion: ['', [Validators.maxLength(200)]]
    });
  }

  // Cargar categoría si es edición
  private loadCategoria(): void {
    if (this.categoriaId) {
      this.isLoading = true;
      console.log('Buscando categoría con ID:', this.categoriaId);
      this.categoriaService.getCategoria(this.categoriaId).subscribe({
        next: (data) => {
          console.log('Categoría cargada correctamente:', data);
          this.form.patchValue({
            cat_nombre: data.cat_nombre,
            cat_descripcion: data.cat_descripcion
          });
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar categoría:', err);
          console.error('Status:', err.status);
          console.error('Mensaje:', err.message);
          this.errorMessage = 'Error al cargar los datos de la categoría. ID: ' + this.categoriaId;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Enviar el formulario
  onSubmit(): void {
    console.log('→ onSubmit ejecutado');
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const categoriaData = this.form.value;

      if (this.isEditMode && this.categoriaId) {
        // Actualizar categoría
        this.categoriaService.actualizarCategoria(this.categoriaId, categoriaData).subscribe({
          next: () => {
            console.log('✓ Categoría actualizada correctamente');
            this.isLoading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/categorias']);
          },
          error: (err) => {
            console.error('❌ Error al actualizar categoría:', err);
            this.errorMessage = 'Error al guardar la categoría';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        // Crear nueva categoría
        this.categoriaService.crearCategoria(categoriaData).subscribe({
          next: () => {
            console.log('✓ Categoría creada correctamente');
            this.isLoading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/categorias']);
          },
          error: (err) => {
            console.error('❌ Error al crear categoría:', err);
            this.errorMessage = 'Error al guardar la categoría';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor, completa los campos requeridos';
      this.cdr.detectChanges();
    }
  }

  // Volver a la lista
  volver(): void {
    console.log('→ volver() ejecutado');
    this.router.navigate(['/categorias']);
  }

  // Getters para acceso fácil a los campos en el template
  get cat_nombre() {
    return this.form.get('cat_nombre');
  }

  get cat_descripcion() {
    return this.form.get('cat_descripcion');
  }

  ngOnDestroy(): void {
    console.log('✗ CategoriasForm destruido');
  }
}
