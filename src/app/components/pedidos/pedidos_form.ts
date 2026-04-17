import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { PedidosProductos } from '../../models/models';
import { PedidosProductosService } from '../../services/pedidosproductos.service';

@Component({
  selector: 'app-pedidos-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './pedidos_form.html',
})

export class PedidosForm implements OnInit {
  form!: FormGroup;

  productos: any[] = [];
  usuarios: any[] = [];
  isEditMode = false;
  pedidoId: number | null = null;
  isLoading = false;
  errorMessage = '';
  pedidosID: any[] = [];


  productopedido(): FormArray {
    return this.form.get('productopedido') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private service: PedidosService,
    private productosService: ProductosService,
    private usuariosService: UsuariosService,
    private pedidosProductosService: PedidosProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProductos();
    this.loadUsuarios();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.pedidoId = params['id'];
        
        this.loadPedidosProductos();

        this.loadPedido();
      }
    });
  }

  loadPedido(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getById(this.pedidoId!).subscribe({
      next: (data) => {
        data.ped_fecha_pedido = data.ped_fecha_pedido ? data.ped_fecha_pedido.split('T')[0] : '';
        this.form.patchValue(data); 

        

        this.cdr.detectChanges();
        if (this.pedidosID) {
          this.pedidosID.forEach((pp: any) => {
            
            this.productopedido().push(
              this.fb.group({
                prod_id: [pp.prod_id, Validators.required],
                prod_nombre: ['', Validators.required],
                pped_cantidad: [pp.pped_cantidad, Validators.required],
                ped_id: [this.pedidoId]
              })
            );
          });
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el pedido';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  
  }

  loadProductos(): void {
    this.productosService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos', err);
      }
    });
  }

  loadPedidosProductos(): void {
    if (!this.pedidoId) return;
    this.pedidosProductosService.getByPedidoId(this.pedidoId).subscribe({
      next: (data) => {
        this.pedidosID = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos del pedido', err);
      }
    });
  }

  loadUsuarios(): void { 
    this.usuariosService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  agregarProducto() {
    this.productopedido().push(
      this.fb.group({
        prod_id: ['', Validators.required],
        prod_nombre: ['', Validators.required],
        pped_cantidad: [1, Validators.required],
        ped_id: [this.pedidoId || null]
      })
    );
  }

  eliminarProducto(index: number) {
    this.productopedido().removeAt(index);
  }


  initForm(): void {
    this.form = this.fb.group({
      ped_id: [null, Validators.required],
      usu_id: ['', Validators.required],
      ped_fecha_pedido: [''],
      ped_total: [0],
      ped_estado: [0],
      ped_direccion_envio: [''],
      ped_notas: [''],
      productopedido: this.fb.array([])
    });
  }

  Guardar(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    const pedidoData = this.form.value;

    if (this.isEditMode) {
      this.service.update(this.pedidoId!, pedidoData).subscribe({
        next: () => {
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar el pedido';
        }
      });
    } else {
      this.service.create(pedidoData).subscribe({
        next: () => {
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear el pedido';
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/pedidos']); 
  }
}
