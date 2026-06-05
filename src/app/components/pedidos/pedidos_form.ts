import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { PedidosProductos } from '../../models/models';
import { PedidosProductosService } from '../../services/pedidosproductos.service';
import { EstadoPedidosService } from '../../services/estadopedidos.service';

import { Contactos } from '../../models/models';
import { ContactosService } from '../../services/contactos.service';


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
  estadosPedidos: any[] = [];

  contactos: Contactos[] = [];
  


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
    private cdr: ChangeDetectorRef,
    private estadoPedidosService: EstadoPedidosService,
    private contactosService: ContactosService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    
    this.loadEstadosPedidos();
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

  loadContactos(usuarioId: any): void {
    if (!usuarioId) return;
    this.contactosService.getByUsuarioId(usuarioId).subscribe({
      next: (data) => {
        this.contactos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando contactos', err);
      }
    });
  }

  loadEstadosPedidos() {
  this.estadoPedidosService.getAll().subscribe({
    next: (data) => {
        this.estadosPedidos = data;
    },
    error: (err) => {
        this.errorMessage = 'Error al cargar los estados de pedidos';
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
        
        // Cargar contactos del usuario del pedido
        const usuarioId = data.usu_id;
        if (usuarioId) {
          this.loadContactos(usuarioId);
        }

        this.cdr.detectChanges();
        if (this.pedidosID) {
          this.pedidosID.forEach((pp: any) => {
            
            this.productopedido().push(
              this.fb.group({
                prod_id: [pp.prod_id, Validators.required],
                prod_nombre: [''],
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
        prod_nombre: [''],
        pped_cantidad: [1, Validators.required],
        ped_id: [this.pedidoId || null]
      })
    );
  }

  eliminarProducto(index: number) {

    // Si el producto ya existe en la base de datos, eliminarlo también del backend
    const producto = this.productopedido().at(index).value; 
    if (producto.prod_id && this.pedidoId) {
      this.pedidosProductosService.borrar(this.pedidoId, producto.prod_id).subscribe({
        next: () => {
          console.log(`Producto ${producto.prod_id} eliminado del pedido ${this.pedidoId}`);
        }
      });
    }

    this.productopedido().removeAt(index);


  }


  initForm(): void {
    this.form = this.fb.group({
      ped_id: [null, Validators.required],
      usu_id: [{ value: null, disabled: true }, Validators.required],
      ped_fecha_pedido: [{ value: '', disabled: true }, Validators.required],
      ped_total: [{ value: 0, disabled: true }, Validators.required],
      ped_estado: [0],
      ped_direccion_envio: [''],
      ped_notas: [{ value: '', disabled: true }],
      productopedido: this.fb.array([])
    });
  }

  Guardar(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos';
      return;
    }

    const pedidoData = this.form.value;

    console.log('Datos del pedido a guardar:', pedidoData);

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


      for (const pedido of pedidoData.productopedido) {

        const datos: PedidosProductos = {
          // quiero que la fecha de entrega por defecto no tenga valor
          pped_fecha_entrega: undefined,
          pped_cantidad: pedido.pped_cantidad,
          pped_precio_unitario: this.productos.find(p => p.prod_id === pedido.prod_id)?.prod_precio_venta || 0,
          pped_descuento: this.productos.find(p => p.prod_id === pedido.prod_id)?.prod_descuento || 0,
          pped_total: (this.productos.find(p => p.prod_id === pedido.prod_id)?.prod_precio_venta || 0) * pedido.pped_cantidad,
          pped_estado: 1,
          ped_id: this.pedidoId!,
          prod_id: pedido.prod_id,
        };

        
        const pedidoExistente = this.pedidosID.find((pp: any) => pp.prod_id === pedido.prod_id);
        if (pedidoExistente) {
          this.pedidosProductosService.actualizar(this.pedidoId!, pedido.prod_id, datos).subscribe({
            next: () => {
              console.log(`Producto ${pedido.prod_id} actualizado en el pedido ${this.pedidoId}`);
            }
          });
        } else {
           this.pedidosProductosService.create(datos).subscribe({
            next: () => {
              console.log(`Producto ${pedido.prod_id} agregado al pedido ${this.pedidoId}`);
            }
          });
        }
          
        // this.pedidosProductosService.actualizar(this.pedidoId!, pedido.prod_id, datos).subscribe({
          
        // });
      }
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

  editarProducto(index: number): void {
    const producto = this.productopedido().at(index).value;
    this.router.navigate(['/pedidos_productos/form', this.pedidoId, producto.prod_id]);
  }

  volver(): void {
    this.router.navigate(['/pedidos']); 
  }
}
