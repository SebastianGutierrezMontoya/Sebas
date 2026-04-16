import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { EstadoPedidosService } from '../../services/estadopedidos.service';
import { CommonModule } from '@angular/common';
import { EstadoPedidos } from '../../models/models';


@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './estados.html',
})

export class Estados implements OnInit {

  estados: EstadoPedidos[] = [];

  isLoading = false;
  errorMessage = '';
  showDeleteModal = false;
  estadoToDelete: EstadoPedidos | null = null;

  constructor(
    private service: EstadoPedidosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getAll().subscribe({
      next: (estados) => {
        this.estados = estados;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los estados';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

  }

  crearEstado(): void {
    this.router.navigate(['/estado_pedidos/form']);
  }

  editarEstado(estado: EstadoPedidos): void {
    this.router.navigate(['/estado_pedidos/form', estado.est_id]);
  }

  confirmarEliminar(estado: EstadoPedidos): void {
    this.estadoToDelete = estado;
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.estadoToDelete = null;
    this.showDeleteModal = false;
  }

  eliminarEstado(): void {
    if (!this.estadoToDelete) return;
    this.service.delete(this.estadoToDelete.est_id).subscribe({
      next: () => {
        this.estados = this.estados.filter(e => e.est_id !== this.estadoToDelete?.est_id);
        this.cancelarEliminar();
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el estado';
      }
    });

  }





}
