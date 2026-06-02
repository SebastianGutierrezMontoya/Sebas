import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Pedidos } from '../../models/models';
import { PedidosService } from '../../services/pedidos.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { EstadoPedidosService } from '../../services/estadopedidos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis_pedidos.html',
  styleUrl: './mis_pedidos.css',
})
export class Mis_pedidos implements OnInit {


    
      usuario: any = null;
      isAuthenticated = false;
      errorMessage = '';

      isLoading = false;
    
      pedidos: Pedidos[] = [];
      usuarioId: string | null = null;
      estadosPedidos: any[] = [];

    
      constructor(
        private service: PedidosService,
        public authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private estadoPedidosService: EstadoPedidosService,
      ) {}
    
      ngOnInit(): void {

        this.estadoPedidosService.getAll().subscribe({
          next: (data) => {
            this.estadosPedidos = data;
          },
          error: (err) => {
            console.error(err);
          }
        });
        
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.usuarioId = params['id'];
                this.loadPedidos();
            }
        });

        this.authService.usuario$.subscribe(usuario => {
          this.usuario = usuario;
          this.isAuthenticated = !!usuario;
          
        });

        

     
      }

      getNombreEstado(estadoId: number): string {
    const estado = this.estadosPedidos.find(e => e.est_id === estadoId);
    return estado ? estado.est_nombre : 'Estado desconocido';
  }


      loadPedidos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // console.log('data');
    this.service.getByUser(this.usuarioId!).subscribe({
      next: (data) => {
        this.pedidos = data;
        // console.log(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar pedidos';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  pedido_detalle(id: number): void {
    this.router.navigate(['/detalle_pedido', id]);
  }

}