import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { Pedidos } from '../../models/models';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './pedidos.html',
})
export class Pedidoss implements OnInit {

  pedidos: Pedidos[] = [];

  isLoading = false
  errorMessage = '';

  showDeleteModal = false;
  pedidoToDelete: Pedidos | null = null;

  page = 1;

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private service: PedidosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const search = this.form.value.search || '';
    this.service.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
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

  buscar(): void {
    this.page
    this.loadPedidos();
  }

  crearPedido(): void {
    this.router.navigate(['/pedidos/form']);
  }

  editarPedido(pedido: Pedidos): void {
    this.router.navigate(['/pedidos/form', pedido.ped_id]);
  }

  confirmarEliminar(pedido: Pedidos): void {
    this.pedidoToDelete = pedido;
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.pedidoToDelete = null;
    this.showDeleteModal = false;
  }

  eliminarPedido(): void {
    if (!this.pedidoToDelete) return;
    this.isLoading = true;
    this.service.delete(this.pedidoToDelete.ped_id).subscribe({
      next: () => {
        this.loadPedidos();
        this.cancelarEliminar();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar pedido';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  siguiente(): void {
    this.page++;
    this.loadPedidos();
  }

  anterior(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPedidos();
    }
  }



}
