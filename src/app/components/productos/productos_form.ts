import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';

import { ProductosService } from '../../services/productos.service';
import { CategoriaService } from '../../services/categoria.service';


@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './productos_form.html',
})

export class ProductosForm implements OnInit {

  form!: FormGroup;

  categorias: any[] = [];
  


  isEditMode = false;
  productoId: string | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: ProductosService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategorias();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productoId = params['id'];
        this.loadProducto();
      }
    });
  }

  loadCategorias(): void {
  this.categoriaService.getCategorias().subscribe({
    next: (data) => {
      this.categorias = data;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error cargando categorías', err);
    }
  });
  }

  

  // ========================
  // FORM INIT
  // ========================
  private initForm(): void {
    this.form = this.fb.group({
  prod_id: ['PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase(), Validators.required],
  prod_nombre: ['', [Validators.required]],
  cat_id: ['', Validators.required],
  prod_descripcion: [''],
  prod_precio_venta: [0],
  prod_stock: [0],
  prod_imagen_url: [''],
  prod_descuento: [0]
});
  }

  // ========================
  // LOAD (EDIT)
  // ========================
  private loadProducto(): void {
    if (!this.productoId) return;

    this.isLoading = true;
    

    this.service.getById(this.productoId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
        // console.log('Producto cargado:', data);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el producto';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ========================
  // SUBMIT
  // ========================
  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Formulario inválido';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = this.form.value;

    if (this.isEditMode && this.productoId) {
      this.service.update(this.productoId, data).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.create(data).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }

  // ========================
  // GETTERS (VALIDACION)
  // ========================
  get prod_nombre() { return this.form.get('prod_nombre'); }
  get cat_id() { return this.form.get('cat_id'); }
}