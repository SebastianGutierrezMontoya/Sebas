import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PedidosProductosService } from '../../services/pedidosproductos.service';
import { PedidosProductos } from '../../models/models';
import { Pedidos } from '../../models/models';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../models/models';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle_pedido.html',
  styleUrl: './detalle_pedido.css',
})
export class Detalle_pedido implements OnInit {

    usuario: any = null;
      isAuthenticated = false;
      errorMessage = '';

      isLoading = false;
      pedidoId: number = 0;

      pedidos_productos: PedidosProductos[] = [];
      productos: Productos[] = [];
      pedidocombinado: any[] = [];

      pedido: Pedidos | any;

      estados_timeline = [
        {'id': 1, 'nombre': 'Pendiente'},
        {'id': 2, 'nombre': 'Confirmado'},
        {'id': 3, 'nombre': 'Preparación'},
        {'id': 4, 'nombre': 'Enviado'},
        {'id': 5, 'nombre': 'Entregado'},
        {'id': 6, 'nombre': 'Cancelado'},
    ]

      constructor(

              public authService: AuthService,
              private service: ProductosService,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private pedidosProductosService: PedidosProductosService,
              private PedidosService: PedidosService,
            ) {}
          
            ngOnInit(): void {
              
              this.route.params.subscribe(params => {
                  if (params['id']) {
                      this.pedidoId = params['id'];
                    //   this.loadPedidoProducto();

                    forkJoin({
                      pedidoprod: this.pedidosProductosService.getByPedidoId(this.pedidoId),
                      prods: this.service.getAll()
                    }).subscribe({
                      next: (resultado) => {
                        
                        this.pedidos_productos = resultado.pedidoprod
                        this.productos = resultado.prods

                        this.Combinar();

                      },
                      error: (err) => {
                        console.error('Error cargando datos:', err);
                        this.errorMessage = 'Error al cargar los datos del usuario';
                        this.isLoading = false;
                        this.cdr.detectChanges();
                      }
                    });




                  }
              });

            //   this.loadProductos();
            //   this.loadPedidoProducto();

              this.loadPedido();

              this.authService.usuario$.subscribe(usuario => {
                this.usuario = usuario;
                this.isAuthenticated = !!usuario;
                
              });

              this.Combinar();

            }




            // loadPedidoProducto(): void {
            //   this.pedidosProductosService.getByPedidoId(this.pedidoId).subscribe({
            //     next: (data) => {
            //     //   data.pped_fecha_entrega = data.pped_fecha_entrega ? data.pped_fecha_entrega.split('T')[0] : '';
            //       this.pedidos_productos = data;
            //     },
            //     error: (err) => {
            //       this.errorMessage = 'Error al cargar el pedido producto';
            //     }
            //   });
            // }

            // loadProductos(): void {
            //     this.isLoading = true;
            //     this.errorMessage = '';



            //     this.service.getAll().subscribe({
            //       next: (data) => {
            //         this.productos = data;
            //         this.isLoading = false;
            //         this.cdr.detectChanges();
            //       },
            //       error: (err) => {
            //         console.error(err);
            //         this.errorMessage = 'Error al cargar productos';
            //         this.isLoading = false;
            //         this.cdr.detectChanges();
            //       }
            //     });
            //     }

    
        Combinar(): void {
           this.pedidocombinado = this.pedidos_productos.map(ped => {
                 const pedidoprod = this.productos.find(
                    producto => producto.prod_id === ped.prod_id
               );
           
             return {
               ...ped,
               prod_imagen_url: pedidoprod?.prod_imagen_url || '',
               prod_nombre: pedidoprod?.prod_nombre || ''
             };
           });
           console.log(this.pedidocombinado)
        }



        loadPedido(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.PedidosService.getById(this.pedidoId).subscribe({
      next: (data) => {
        data.ped_fecha_pedido = data.ped_fecha_pedido ? data.ped_fecha_pedido.split('T')[0] : '';
        this.pedido = data; 

        
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
     


  mis_pedidos(): void {
    this.router.navigate(['/mis_pedidos', this.usuario.id_usuario]);
  }


}