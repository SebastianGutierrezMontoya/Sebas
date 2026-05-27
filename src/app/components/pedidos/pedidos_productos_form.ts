import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { PedidosProductosService } from '../../services/pedidosproductos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoPedidosService } from '../../services/estadopedidos.service';



@Component({
  selector: 'app-pedidos-productos-form',
  templateUrl: './pedidos_productos_form.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],

})
export class PedidosProductosForm implements OnInit {

Form!: FormGroup; 
isEditMode = false;
pedidoId: number | null = null
productoId: string | null = null;
isloading = false;
errorMessage = '';
estadosPedidos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pedidosProductosService: PedidosProductosService,
    private route: ActivatedRoute,
    private estadoPedidosService: EstadoPedidosService,
    private router: Router

  ) {

   }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['pedidoId'] && params['productoId']) {
        this.isEditMode = true;
        this.pedidoId = +params['pedidoId'];
        this.productoId = params['productoId'];
        this.loadEstadosPedidos();
        this.loadPedidoProducto();
      }
    });

}


initForm() {
  this.Form = this.fb.group({
    ped_id: ['', Validators.required],
    prod_id: ['', Validators.required],
    pped_fecha_entrega: [''],
    pped_cantidad: ['', [Validators.required, Validators.min(1)]],
    pped_precio_unitario: ['', [Validators.required, Validators.min(0)]],
    pped_descuento: ['', [Validators.required, Validators.min(0)]],
    pped_total: ['', [Validators.required, Validators.min(0)]],
    pped_estado: ['', Validators.required]
  });
}

loadPedidoProducto() {
  this.pedidosProductosService.getByIds({ ped_id: this.pedidoId!, prod_id: this.productoId! }).subscribe({
    next: (data) => {
      data.pped_fecha_entrega = data.pped_fecha_entrega ? data.pped_fecha_entrega.split('T')[0] : '';
      this.Form.patchValue(data);
    },
    error: (err) => {
      this.errorMessage = 'Error al cargar el pedido producto';
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


guardar() {
  if (this.Form.invalid) {
    return;
  }



    const data = this.Form.value;

    if (!data.pped_fecha_entrega) {
      delete data.pped_fecha_entrega
    }

    if (this.isEditMode) {
      this.pedidosProductosService.actualizar(this.pedidoId!, this.productoId!, data).subscribe({
        next: () => {
          this.router.navigate(['/pedidos/form', this.pedidoId]);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el pedido producto';
        }
      });
    } else {
      this.pedidosProductosService.create(data).subscribe({
        next: () => {
          this.router.navigate(['/pedidos/form', this.pedidoId]);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear el pedido producto';
        }
      });
    }
}

}